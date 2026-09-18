<script setup lang="ts">
/**
 * ShadertoyBackdrop — Shadertoy 着色器背景运行时
 *
 * 将 Shadertoy 风格（mainImage 入口）的 GLSL 片段着色器渲染为全屏背景。
 * 支持 Shadertoy 的两类 pass：
 *   - Image   ：主画面，直接渲染到 canvas（必传）
 *   - Buffer A：自反馈缓冲，iChannel0 自动绑定为自身上一帧（可选，ping-pong FBO）
 *
 * 已内置的标准 uniform：iResolution / iTime / iTimeDelta / iFrame / iFrameRate /
 * iMouse / iDate / iSampleRate / iChannel0~3 / iChannelResolution / iChannelTime
 *
 * 输入通道（iChannel0~3）支持三种绑定：Buffer 输出（'buffer'）、Buffer 自身上一帧
 * （'feedback'）、外部贴图（{ url, wrap }，经 props.bufferChannels / imageChannels 配置）。
 *
 * 降级与性能策略（任一条件不满足时组件保持透明，页面回退到下层的静态壁纸）：
 *   - 浏览器不支持 WebGL2 或着色器编译失败 → 静默回退，并 emit('error')
 *   - 用户开启「减少动态效果」(prefers-reduced-motion) → 不初始化
 *   - 组件滚出视口 / 页面切到后台 → 自动暂停渲染循环
 *   - devicePixelRatio 与渲染分辨率均有上限，防止高分屏 GPU 过载
 *   - 帧率监测自适应降档：平均帧率低于 45fps 时自动下调渲染分辨率（最低 40%）
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

/** 纹理通道配置：url 为 public 目录下的贴图路径（如 /textures/blue_noise.png） */
interface ChannelTexture {
  url: string
  /** 环绕方式，默认 'repeat'（Shadertoy 噪声贴图通常为 repeat） */
  wrap?: 'repeat' | 'clamp'
}

type BufferChannelSpec = ChannelTexture | 'feedback'
type ImageChannelSpec = ChannelTexture | 'buffer'

interface Props {
  /** Image 主 pass 的 GLSL 源码（Shadertoy 风格，需含 mainImage 函数） */
  imageSource: string
  /** 可选：Buffer A pass 的 GLSL 源码（自反馈缓冲，iChannel0 为上一帧内容） */
  bufferSource?: string
  /** devicePixelRatio 上限，防止高分屏过载，默认 1.5 */
  maxPixelRatio?: number
  /** 渲染分辨率缩放（0~1），传 0 自动（窄屏 0.5 / 宽屏 0.75），默认 0 */
  resolutionScale?: number
  /** 是否监听窗口指针写入 iMouse（交互式着色器开启），默认 false */
  interactive?: boolean
  /** 站点扩展 uniform uNightBlend（0=原效果 / 1=夜间风格），供着色器做主题化调色，默认 0 */
  nightBlend?: number
  /** Buffer pass 输入通道（索引 = iChannel 编号）：贴图 / 'feedback'（自身上一帧），缺省为占位纹理，默认 ['feedback'] */
  bufferChannels?: (BufferChannelSpec | null)[]
  /** Image pass 输入通道（索引 = iChannel 编号）：贴图 / 'buffer'（Buffer 输出），缺省为占位纹理，默认 ['buffer'] */
  imageChannels?: (ImageChannelSpec | null)[]
}

const props = withDefaults(defineProps<Props>(), {
  bufferSource: undefined,
  maxPixelRatio: 1.5,
  resolutionScale: 0,
  interactive: false,
  nightBlend: 0,
  bufferChannels: undefined,
  imageChannels: undefined
})

const emit = defineEmits<{
  /** 首帧渲染成功 */
  ready: []
  /** 初始化或编译失败（组件保持透明，页面自动回退到下层静态背景） */
  error: [message: string]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isReady = ref(false)

// ---------------------------------------------------------------------------
// GLSL 模板：顶点着色器 + Shadertoy 兼容包装
// ---------------------------------------------------------------------------

const VERTEX_SOURCE = `#version 300 es
layout(location = 0) in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`

const FRAGMENT_PREAMBLE = `#version 300 es
precision highp float;
precision highp int;

uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform float iFrameRate;
uniform vec4 iMouse;
uniform vec4 iDate;
uniform float iSampleRate;
uniform float uNightBlend;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec3 iChannelResolution[4];
uniform float iChannelTime[4];

// 兼容旧式 Shadertoy 代码中的 texture2D 调用
#define texture2D texture

out vec4 shadertoyFragColor;

`

const FRAGMENT_POSTAMBLE = `
void main() {
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  mainImage(color, gl_FragCoord.xy);
  shadertoyFragColor = color;
}
`

function wrapFragmentSource(source: string): string {
  return `${FRAGMENT_PREAMBLE}\n${source}\n${FRAGMENT_POSTAMBLE}`
}

// ---------------------------------------------------------------------------
// WebGL 工具函数
// ---------------------------------------------------------------------------

interface ProgramInfo {
  program: WebGLProgram
  uniformLocations: Map<string, WebGLUniformLocation | null>
}

interface FrameTarget {
  framebuffer: WebGLFramebuffer
  texture: WebGLTexture
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('无法创建着色器对象')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || '未知编译错误'
    gl.deleteShader(shader)
    throw new Error(log)
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext, fragmentSource: string): ProgramInfo {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()
  if (!program) throw new Error('无法创建着色器程序')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || '未知链接错误'
    gl.deleteProgram(program)
    throw new Error(log)
  }
  return { program, uniformLocations: new Map() }
}

function getLocation(gl: WebGL2RenderingContext, info: ProgramInfo, name: string): WebGLUniformLocation | null {
  if (!info.uniformLocations.has(name)) {
    info.uniformLocations.set(name, gl.getUniformLocation(info.program, name))
  }
  return info.uniformLocations.get(name) ?? null
}

function createFrameTarget(gl: WebGL2RenderingContext, width: number, height: number): FrameTarget {
  const texture = gl.createTexture()
  const framebuffer = gl.createFramebuffer()
  if (!texture || !framebuffer) throw new Error('无法创建帧缓冲对象')
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { framebuffer, texture }
}

function destroyFrameTarget(gl: WebGL2RenderingContext, target: FrameTarget): void {
  gl.deleteFramebuffer(target.framebuffer)
  gl.deleteTexture(target.texture)
}

function createPlaceholderTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const texture = gl.createTexture()
  if (!texture) throw new Error('无法创建占位纹理')
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return texture
}

interface LoadedTexture {
  texture: WebGLTexture
  width: number
  height: number
}

/** 异步加载贴图；失败时返回 null（调用方回退到占位纹理，着色器仍可运行） */
async function loadTexture(gl: WebGL2RenderingContext, spec: ChannelTexture): Promise<LoadedTexture | null> {
  try {
    const img = new Image()
    img.src = spec.url
    await img.decode()
    const texture = gl.createTexture()
    if (!texture) return null
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    const wrapMode = spec.wrap === 'clamp' ? gl.CLAMP_TO_EDGE : gl.REPEAT
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    const isPot = (v: number) => (v & (v - 1)) === 0
    if (isPot(img.width) && isPot(img.height)) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
    return { texture, width: img.width, height: img.height }
  } catch (err) {
    console.warn(`[ShadertoyBackdrop] 贴图加载失败 ${spec.url}，已回退到占位纹理：`, err)
    return null
  }
}

// ---------------------------------------------------------------------------
// 渲染引擎（返回清理函数）
// ---------------------------------------------------------------------------

async function initEngine(canvas: HTMLCanvasElement): Promise<() => void> {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false
  })
  if (!gl) throw new Error('当前浏览器不支持 WebGL2')

  // 顶点缓冲：一个覆盖全屏的三角形（比四边形少一个顶点，无需索引）
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  // 编译两个 pass（编译失败会抛出，由外层捕获后回退到静态壁纸）
  const imageProgram = createProgram(gl, wrapFragmentSource(props.imageSource))
  const bufferProgram = props.bufferSource ? createProgram(gl, wrapFragmentSource(props.bufferSource)) : null

  const placeholderTexture = createPlaceholderTexture(gl)

  // 通道配置（缺省保持向后兼容：Buffer 自反馈，Image 读 Buffer 输出）
  const bufferChannelSpecs: (BufferChannelSpec | null)[] = props.bufferChannels ?? ['feedback']
  const imageChannelSpecs: (ImageChannelSpec | null)[] = props.imageChannels ?? ['buffer']

  // 预加载全部外部贴图（单张失败仅回退该通道为占位纹理，不阻塞渲染管线）
  const loadedTextures = new Map<string, LoadedTexture>()
  const textureSpecs = new Map<string, ChannelTexture>()
  for (const spec of [...bufferChannelSpecs, ...imageChannelSpecs]) {
    if (spec && typeof spec === 'object') textureSpecs.set(spec.url, spec)
  }
  await Promise.all(
    [...textureSpecs.values()].map(async (spec) => {
      const loaded = await loadTexture(gl, spec)
      if (loaded) loadedTextures.set(spec.url, loaded)
    })
  )

  // ---- 尺寸与帧缓冲（ping-pong）----
  let frameTargets: [FrameTarget, FrameTarget] | null = null
  let readIndex = 0
  let renderWidth = 0
  let renderHeight = 0
  const channelResolutions = new Float32Array(12)
  const channelTimeScratch = new Float32Array(4)
  const nowDate = new Date()

  // 自适应降档的当前分辨率缩放（下限 0.4，由帧率监测驱动逐步下调）
  let currentScale = props.resolutionScale > 0 ? props.resolutionScale : (window.innerWidth < 768 ? 0.5 : 0.75)

  const resize = () => {
    const parent = canvas.parentElement
    if (!parent) return
    const scale = currentScale
    const dpr = Math.min(window.devicePixelRatio || 1, props.maxPixelRatio)
    const width = Math.max(1, Math.floor(parent.clientWidth * dpr * scale))
    const height = Math.max(1, Math.floor(parent.clientHeight * dpr * scale))
    if (width === renderWidth && height === renderHeight) return
    renderWidth = width
    renderHeight = height
    canvas.width = width
    canvas.height = height
    if (bufferProgram) {
      if (frameTargets) {
        destroyFrameTarget(gl, frameTargets[0])
        destroyFrameTarget(gl, frameTargets[1])
      }
      frameTargets = [createFrameTarget(gl, width, height), createFrameTarget(gl, width, height)]
      readIndex = 0
    }
  }

  // ---- uniform 写入 ----
  const mouse = { x: 0, y: 0, z: 0, w: 0 }

  const bindChannel = (info: ProgramInfo, unit: number, texture: WebGLTexture) => {
    const loc = getLocation(gl, info, `iChannel${unit}`)
    if (!loc) return
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1i(loc, unit)
  }

  /** 解析单个输入通道：feedback/buffer → 帧缓冲纹理，贴图 → 已加载纹理，缺省 → 占位 */
  const resolveChannel = (
    spec: BufferChannelSpec | ImageChannelSpec | null | undefined,
    forBufferPass: boolean
  ): LoadedTexture => {
    if (spec === 'feedback' && forBufferPass && frameTargets) {
      return { texture: frameTargets[readIndex].texture, width: renderWidth, height: renderHeight }
    }
    if (spec === 'buffer' && !forBufferPass && frameTargets) {
      return { texture: frameTargets[readIndex].texture, width: renderWidth, height: renderHeight }
    }
    if (spec && typeof spec === 'object') {
      const loaded = loadedTextures.get(spec.url)
      if (loaded) return loaded
    }
    return { texture: placeholderTexture, width: 1, height: 1 }
  }

  /** 绑定一个 pass 的全部输入通道，并同步写入 iChannelResolution */
  const bindPassChannels = (
    info: ProgramInfo,
    specs: (BufferChannelSpec | ImageChannelSpec | null)[],
    forBufferPass: boolean
  ) => {
    for (let unit = 0; unit < 4; unit++) {
      const ch = resolveChannel(specs[unit], forBufferPass)
      bindChannel(info, unit, ch.texture)
      channelResolutions[unit * 3] = ch.width
      channelResolutions[unit * 3 + 1] = ch.height
      channelResolutions[unit * 3 + 2] = 1
    }
    const loc = getLocation(gl, info, 'iChannelResolution')
    if (loc) gl.uniform3fv(loc, channelResolutions)
  }

  const setCommonUniforms = (info: ProgramInfo, time: number, timeDelta: number, frame: number) => {
    let loc = getLocation(gl, info, 'iResolution')
    if (loc) gl.uniform3f(loc, renderWidth, renderHeight, 1)
    loc = getLocation(gl, info, 'iTime')
    if (loc) gl.uniform1f(loc, time)
    loc = getLocation(gl, info, 'iTimeDelta')
    if (loc) gl.uniform1f(loc, timeDelta)
    loc = getLocation(gl, info, 'iFrame')
    if (loc) gl.uniform1i(loc, frame)
    loc = getLocation(gl, info, 'iFrameRate')
    if (loc) gl.uniform1f(loc, timeDelta > 0 ? 1 / timeDelta : 60)
    loc = getLocation(gl, info, 'iMouse')
    if (loc) gl.uniform4f(loc, mouse.x, mouse.y, mouse.z, mouse.w)
    nowDate.setTime(Date.now())
    loc = getLocation(gl, info, 'iDate')
    if (loc) {
      gl.uniform4f(
        loc,
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
        nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds()
      )
    }
    // 站点扩展：夜间混合系数（着色器未声明该 uniform 时自动跳过）
    loc = getLocation(gl, info, 'uNightBlend')
    if (loc) gl.uniform1f(loc, props.nightBlend)
    // 通道元数据由 bindPassChannels 按各 pass 实际绑定写入
    channelTimeScratch[0] = time
    loc = getLocation(gl, info, 'iChannelTime')
    if (loc) gl.uniform1fv(loc, channelTimeScratch)
    loc = getLocation(gl, info, 'iSampleRate')
    if (loc) gl.uniform1f(loc, 44100)
  }

  // ---- 帧循环（时间累加制：暂停后继续，画面不跳变）----
  let rafId = 0
  let running = false
  let inViewport = true
  let docVisible = !document.hidden
  let elapsed = 0
  let lastNow = 0
  let frame = 0
  let perfFrames = 0
  let perfAccum = 0

  const renderFrame = (now: number) => {
    rafId = 0
    if (!running) return
    if (lastNow === 0) lastNow = now
    // 钳制单帧步长，避免切后台再回来时出现时间跳变
    const delta = Math.min((now - lastNow) / 1000, 0.1)
    lastNow = now
    elapsed += delta

    // 自适应降档：滑动窗口平均帧率低于 45fps 时逐步降低渲染分辨率（下限 40%），
    // 在 Firefox 等着色器编译/GPU 较弱的组合上自动换取流畅度
    perfFrames += 1
    perfAccum += delta * 1000
    if (perfFrames >= 90) {
      const avgFps = perfFrames / (perfAccum / 1000)
      if (avgFps < 45 && currentScale > 0.4) {
        currentScale = Math.max(0.4, currentScale - 0.15)
        console.info(
          `[ShadertoyBackdrop] 平均帧率 ${avgFps.toFixed(0)}fps，已自动降档渲染分辨率至 ${Math.round(currentScale * 100)}%`
        )
        resize()
      }
      perfFrames = 0
      perfAccum = 0
    }

    if (bufferProgram && frameTargets) {
      const writeIndex = 1 - readIndex
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameTargets[writeIndex].framebuffer)
      gl.viewport(0, 0, renderWidth, renderHeight)
      gl.useProgram(bufferProgram.program)
      setCommonUniforms(bufferProgram, elapsed, delta, frame)
      bindPassChannels(bufferProgram, bufferChannelSpecs, true)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      readIndex = writeIndex
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, renderWidth, renderHeight)
    gl.useProgram(imageProgram.program)
    setCommonUniforms(imageProgram, elapsed, delta, frame)
    bindPassChannels(imageProgram, imageChannelSpecs, false)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    frame++
    if (!isReady.value) {
      isReady.value = true
      emit('ready')
    }
    if (running) rafId = requestAnimationFrame(renderFrame)
  }

  const start = () => {
    if (running) return
    running = true
    lastNow = 0
    rafId = requestAnimationFrame(renderFrame)
  }
  const stop = () => {
    running = false
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }
  const updateRunning = () => {
    if (inViewport && docVisible) start()
    else stop()
  }

  // ---- 生命周期监听 ----
  const intersectionObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    inViewport = entry ? entry.isIntersecting : true
    updateRunning()
  }, { threshold: 0 })
  intersectionObserver.observe(canvas)

  const resizeObserver = new ResizeObserver(() => resize())
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

  const onVisibilityChange = () => {
    docVisible = !document.hidden
    updateRunning()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    mouse.x = ((event.clientX - rect.left) / rect.width) * renderWidth
    mouse.y = renderHeight - ((event.clientY - rect.top) / rect.height) * renderHeight
  }
  if (props.interactive) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    stop()
    console.warn('[ShadertoyBackdrop] WebGL 上下文丢失，已停止渲染')
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  resize()
  updateRunning()

  // ---- 清理 ----
  return () => {
    stop()
    intersectionObserver.disconnect()
    resizeObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    if (props.interactive) window.removeEventListener('pointermove', onPointerMove)
    if (frameTargets) {
      destroyFrameTarget(gl, frameTargets[0])
      destroyFrameTarget(gl, frameTargets[1])
    }
    for (const loaded of loadedTextures.values()) gl.deleteTexture(loaded.texture)
    gl.deleteTexture(placeholderTexture)
    gl.deleteBuffer(vertexBuffer)
    gl.deleteProgram(imageProgram.program)
    if (bufferProgram) gl.deleteProgram(bufferProgram.program)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

// ---------------------------------------------------------------------------
// 挂载 / 卸载
// ---------------------------------------------------------------------------

let cleanup: (() => void) | null = null
let disposed = false

onMounted(async () => {
  const canvas = canvasRef.value
  if (!canvas) return
  // 尊重系统「减少动态效果」设置：直接保持透明，展示下层静态壁纸
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  try {
    const dispose = await initEngine(canvas)
    // 贴图加载期间组件可能已被卸载
    if (disposed) {
      dispose()
      return
    }
    cleanup = dispose
  } catch (err) {
    console.error('[ShadertoyBackdrop] 初始化失败，已回退到静态背景：', err)
    emit('error', err instanceof Error ? err.message : String(err))
    cleanup?.()
    cleanup = null
  }
})

onBeforeUnmount(() => {
  disposed = true
  cleanup?.()
  cleanup = null
})
</script>

<template>
  <canvas
    ref="canvasRef"
    aria-hidden="true"
    :class="[
      'absolute inset-0 block h-full w-full transition-opacity duration-1000 ease-out',
      isReady ? 'opacity-100' : 'opacity-0'
    ]"
  />
</template>

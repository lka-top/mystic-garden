// ============================================================================
// Image —— 最终输出 pass（渲染到屏幕）
//
// 原作：Up in the Cloud Sea by mdb
// 来源：https://www.shadertoy.com/view/Ndc3zl
// 授权：Shadertoy 默认 CC BY-NC-SA 3.0（非商用 + 署名 + 相同方式共享）
//
// 运行时通道绑定：
//   - iChannel0 = Buffer A 当前帧（场景画面）
//
// 站点扩展（区别于原作的部分）：
//   - uNightBlend（0=日落 / 1=深夜）：由 HeroBanner 根据站点亮暗主题驱动，
//     在本 pass 内做夜间色调变换、月亮与星空，实现「日落 ↔ 星夜」平滑过渡。
//     该 uniform 由 ShadertoyBackdrop 运行时自动声明并注入。
// ============================================================================

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    vec3 col = texture(iChannel0, uv).rgb;

    // ---- 暗角校正（原作）----
    col *= 0.5 + 0.5*pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.2 );

    // ---- 夜间风格（站点扩展，uNightBlend=0 时画面与原作完全一致）----
    if (uNightBlend > 0.001) {
        float nb = uNightBlend;

        // 夜色调：降饱和 -> 蓝移 -> 压暗 -> 补一点深夜环境光
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        vec3 nightCol = mix(col, vec3(lum), 0.55);
        nightCol *= vec3(0.45, 0.58, 0.92);
        nightCol *= 0.52;
        nightCol += vec3(0.015, 0.03, 0.07);

        // 月亮（右上，云后透光，不做区域蒙版）
        vec2 moonP = (uv - vec2(0.76, 0.78)) * vec2(iResolution.x / iResolution.y, 1.0);
        float moonDist = length(moonP);
        float moonGlow = exp(-moonDist * 6.0) * 0.28;
        float moonDisc = 1.0 - smoothstep(0.028, 0.033, moonDist);
        nightCol += (moonGlow + moonDisc * 0.75) * vec3(0.92, 0.95, 1.0);

        // 星空：只落在白天的天空区域（暖色云、桥与火车蒙版为 0）
        float skyMask = smoothstep(0.05, 0.25, col.b - col.r);
        vec2 sp = uv * iResolution.xy / 3.0;
        vec2 cell = floor(sp);
        float rnd = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
        vec2 cellUv = fract(sp) - 0.5;
        vec2 starOffset = (vec2(rnd, fract(rnd * 91.17)) - 0.5) * 0.5;
        float starDot = 1.0 - smoothstep(0.0, 0.42, length(cellUv - starOffset));
        float twinkle = 0.55 + 0.45 * sin(iTime * 2.0 + rnd * 62.8);
        float star = step(0.9965, rnd) * starDot * twinkle * skyMask;
        nightCol += star * vec3(0.85, 0.92, 1.0) * 0.9;

        col = mix(col, nightCol, nb);
    }

    fragColor = vec4(col, 1.0);
}

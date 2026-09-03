<script setup lang="ts">
import {
  User,
  Sparkles,
  Code2,
  ExternalLink,
  Cpu,
  Layers,
  Database,
  Terminal,
  Compass,
  Mail,
  Rss,
} from "lucide-vue-next";
import Card from "~/components/ui/Card.vue";
import BrandIcon, { type BrandName } from "~/components/ui/BrandIcon.vue";
import HeroBanner from "~/components/layout/HeroBanner.vue";

useSeoMeta({
  title: "关于神秘花园",
  description: "关于神秘花园的诞生、技术栈与博主简介",
});

interface SkillItem {
  name: string;
  desc: string;
  tag: string;
  brand: BrandName;
  url: string;
  bg: string;
}

interface SkillCategory {
  title: string;
  icon: any;
  tag: string;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "编程语言核心",
    icon: Code2,
    tag: "Core Languages",
    skills: [
      {
        name: "Java",
        desc: "面向对象、高并发与企业级服务端核心",
        tag: "Backend Language",
        brand: "java",
        url: "https://dev.java",
        bg: "bg-amber-500/10 border-amber-500/20",
      },
      {
        name: "Python",
        desc: "脚本自动化、数据分析与 AI 工程管道",
        tag: "Scripting & AI",
        brand: "python",
        url: "https://www.python.org",
        bg: "bg-blue-500/10 border-blue-500/20",
      },
      {
        name: "JavaScript",
        desc: "现代 ESNext 标准与 Web 全平台互联",
        tag: "Web Standard",
        brand: "javascript",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        bg: "bg-yellow-500/10 border-yellow-500/20",
      },
      {
        name: "TypeScript",
        desc: "端到端强类型系统与企业级大型工程架构",
        tag: "Type Safety",
        brand: "typescript",
        url: "https://www.typescriptlang.org",
        bg: "bg-sky-500/10 border-sky-500/20",
      },
      {
        name: "HTML5",
        desc: "语义化标记、现代化可访问性与 Web Components",
        tag: "Markup",
        brand: "html",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        bg: "bg-orange-500/10 border-orange-500/20",
      },
      {
        name: "CSS3",
        desc: "现代响应式网格布局、Flexbox 与微交互动效",
        tag: "Styling",
        brand: "css",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
        bg: "bg-blue-500/10 border-blue-500/20",
      },
    ],
  },
  {
    title: "现代前端与全栈生态",
    icon: Layers,
    tag: "Frontend & Fullstack",
    skills: [
      {
        name: "Nuxt 3",
        desc: "SSR / SSG 混合渲染与同构全栈引擎",
        tag: "Fullstack Framework",
        brand: "nuxt",
        url: "https://nuxt.com",
        bg: "bg-emerald-500/10 border-emerald-500/20",
      },
      {
        name: "Vue 3",
        desc: "Composition API、响应式核心与生态系统",
        tag: "UI Library",
        brand: "vue",
        url: "https://vuejs.org",
        bg: "bg-emerald-500/10 border-emerald-500/20",
      },
      {
        name: "Tailwind CSS",
        desc: "原子化样式系统与无缝暗黑模式",
        tag: "Design System",
        brand: "tailwindcss",
        url: "https://tailwindcss.com",
        bg: "bg-sky-500/10 border-sky-500/20",
      },
      {
        name: "Vite",
        desc: "极速 esbuild / Rollup 构建工具链与 HMR",
        tag: "Bundler",
        brand: "vite",
        url: "https://vitejs.dev",
        bg: "bg-purple-500/10 border-purple-500/20",
      },
    ],
  },
  {
    title: "后端架构与数据持久化",
    icon: Database,
    tag: "Backend & Data",
    skills: [
      {
        name: "Spring Boot",
        desc: "Java 企业级微服务、IoC/DI 与生态体系",
        tag: "Enterprise Framework",
        brand: "spring",
        url: "https://spring.io/projects/spring-boot",
        bg: "bg-emerald-500/10 border-emerald-500/20",
      },
      {
        name: "Node.js",
        desc: "高并发异步 I/O 驱动的服务端运行时",
        tag: "Runtime",
        brand: "nodejs",
        url: "https://nodejs.org",
        bg: "bg-green-500/10 border-green-500/20",
      },
      {
        name: "MySQL 8.0",
        desc: "高可靠关系型数据存储与 ACID 事务保障",
        tag: "RDBMS",
        brand: "mysql",
        url: "https://www.mysql.com",
        bg: "bg-blue-500/10 border-blue-500/20",
      },
      {
        name: "Redis",
        desc: "内存级高速缓存、分布式锁与会话存储",
        tag: "In-Memory DB",
        brand: "redis",
        url: "https://redis.io",
        bg: "bg-red-500/10 border-red-500/20",
      },
      {
        name: "Prisma ORM",
        desc: "下一代类型安全的数据库客户端与迁移工具",
        tag: "ORM & Modeling",
        brand: "prisma",
        url: "https://www.prisma.io",
        bg: "bg-slate-500/10 border-slate-500/20",
      },
    ],
  },
  {
    title: "基础设施与工程运维",
    icon: Terminal,
    tag: "DevOps & Tooling",
    skills: [
      {
        name: "Docker",
        desc: "容器化编排、环境隔离与镜像交付",
        tag: "Container",
        brand: "docker",
        url: "https://www.docker.com",
        bg: "bg-blue-500/10 border-blue-500/20",
      },
      {
        name: "Linux",
        desc: "Shell 自动化脚本、服务器运维与内核管理",
        tag: "Operating System",
        brand: "linux",
        url: "https://www.kernel.org",
        bg: "bg-amber-500/10 border-amber-500/20",
      },
      {
        name: "Git",
        desc: "分布式版本控制、分支协作与工作流",
        tag: "VCS",
        brand: "git",
        url: "https://git-scm.com",
        bg: "bg-orange-500/10 border-orange-500/20",
      },
      {
        name: "Zod",
        desc: "以 TypeScript 为核心的运行时模式验证",
        tag: "Validation",
        brand: "zod",
        url: "https://zod.dev",
        bg: "bg-blue-500/10 border-blue-500/20",
      },
    ],
  },
];
</script>

<template>
  <div>
    <!-- 顶部全宽 HeroBanner + 动态波浪 -->
    <HeroBanner
      title="关于「神秘花园」"
      subtitle="Digital Garden · 全栈架构设计、现代 Web 美学与极客探索"
      height="md"
      :show-wave="true"
    />

    <div class="space-y-12 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <!-- 头部关于介绍 -->
      <div class="pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <h1
          class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5"
        >
          <User class="w-7 h-7 text-brand-600 dark:text-brand-400" />
          关于「神秘花园」
        </h1>
        <p class="text-xs text-zinc-400 mt-1 font-mono">
          Digital Garden & Technical Architecture Matrix
        </p>
      </div>

      <!-- 个人简介卡片 -->
      <Card
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8"
      >
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 shadow-md"
        >
          <img
            src="/images/avatar.png"
            alt="lka"
            class="w-full h-full object-cover rounded-[20px] bg-sky-50 dark:bg-slate-800"
          />
        </div>
        <div class="space-y-2 text-center sm:text-left flex-1">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <h2
              class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100"
            >
              lka (Mystic Developer)
            </h2>
            <span
              class="text-xs font-mono px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 self-center sm:self-auto"
            >
              Full-Stack Software Engineer
            </span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Java / Python · Nuxt 3 / Vue 3 · Cloud & Database Architecture
          </p>
          <p
            class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1"
          >
            热衷于现代 Web 前沿、高可靠分布式后端与精致 UI
            设计系统。坚信代码可维护性、极简审美与工程化严谨力量。
          </p>

          <!-- 简单的社交与外链图标栏 (GitHub, B站, Email, RSS) -->
          <div
            class="flex items-center justify-center sm:justify-start gap-2.5 pt-3"
          >
            <a
              href="https://github.com/lka-top"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-200 hover:scale-110 shadow-xs"
              title="GitHub (@lka-top)"
            >
              <BrandIcon name="github" :size="16" />
            </a>
            <a
              href="https://space.bilibili.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-[#FB7299] hover:bg-[#FB7299] hover:text-white transition-all duration-200 hover:scale-110 shadow-xs"
              title="哔哩哔哩 (Bilibili)"
            >
              <BrandIcon name="bilibili" :size="16" />
            </a>
            <a
              href="mailto:admin@mysgarden.top"
              class="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-xs"
              title="Email (admin@mysgarden.top)"
            >
              <Mail class="w-4 h-4" />
            </a>
            <a
              href="/feed.xml"
              target="_blank"
              class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-xs"
              title="RSS 订阅"
            >
              <Rss class="w-4 h-4" />
            </a>
          </div>
        </div>
      </Card>

      <!-- 数字花园的理念 -->
      <div class="space-y-4">
        <h2
          class="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
        >
          <Sparkles class="w-4 h-4 text-brand-600 dark:text-brand-400" />
          数字花园理念
        </h2>
        <div
          class="prose prose-zinc dark:prose-invert text-sm leading-relaxed space-y-3"
        >
          <p class="text-zinc-600 dark:text-zinc-400">
            「神秘花园」不仅是一个发布完成文章的博客，更是一套持续演进的知识与工程底座：
          </p>
          <ul
            class="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400 text-xs"
          >
            <li>
              <strong>随笔微言</strong
              >：随时记录未经雕琢的灵感、开发调试火花与生活碎片。
            </li>
            <li>
              <strong>结构笔记</strong
              >：速查表、设计模式规范与系统性工程备忘录。
            </li>
            <li>
              <strong>深度长文</strong
              >：严谨推敲、经过工程化验证的技术架构总结与复盘。
            </li>
          </ul>
        </div>
      </div>

      <!-- 技能全景矩阵 (按领域分类呈现) -->
      <div class="space-y-8">
        <div
          class="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80"
        >
          <h2
            class="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
          >
            <Code2 class="w-5 h-5 text-brand-600 dark:text-brand-400" />
            全栈技能与技术栈全景
          </h2>
          <span class="text-xs font-mono text-zinc-400"
            >Full Spectrum Matrix</span
          >
        </div>

        <!-- 分组循环 -->
        <div
          v-for="category in skillCategories"
          :key="category.title"
          class="space-y-3.5"
        >
          <div class="flex items-center justify-between">
            <h3
              class="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2"
            >
              <component
                :is="category.icon"
                class="w-4 h-4 text-zinc-500 dark:text-zinc-400"
              />
              <span>{{ category.title }}</span>
            </h3>
            <span
              class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider"
            >
              {{ category.tag }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <a
              v-for="(skill, sIdx) in category.skills"
              :key="skill.name"
              :href="skill.url"
              target="_blank"
              rel="noopener noreferrer"
              v-motion
              :initial="{ opacity: 0, y: 16, scale: 0.98 }"
              :visible-once="{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 300,
                  delay: (sIdx % 6) * 50,
                  ease: 'easeOut',
                },
              }"
              class="p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div class="flex items-center justify-between">
                <div
                  :class="[
                    'w-9 h-9 rounded-2xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-xs',
                    skill.bg,
                  ]"
                >
                  <BrandIcon :name="skill.brand" :size="20" />
                </div>
                <div class="flex items-center gap-1">
                  <span
                    class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider"
                  >
                    {{ skill.tag }}
                  </span>
                  <ExternalLink
                    class="w-2.5 h-2.5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div
                  class="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-mono tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{{ skill.name }}</span>
                </div>
                <p
                  class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed"
                >
                  {{ skill.desc }}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

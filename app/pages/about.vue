<script setup lang="ts">
import {
  User,
  Sparkles,
  ExternalLink,
  Cpu,
  Compass,
  Mail,
  Rss,
} from "lucide-vue-next";
import Card from "~/components/ui/Card.vue";
import BrandIcon, { type BrandName } from "~/components/ui/BrandIcon.vue";
import HeroBanner from "~/components/layout/HeroBanner.vue";

useSeoMeta({
  title: "关于神秘花园",
  description: "了解神秘花园与这里记录的游戏、兴趣、笔记和日常",
});

interface ProjectStackItem {
  name: string;
  brand: BrandName;
  url: string;
}

const projectStack: ProjectStackItem[] = [
  { name: "Nuxt 3", brand: "nuxt", url: "https://nuxt.com" },
  { name: "Vue 3", brand: "vue", url: "https://vuejs.org" },
  {
    name: "TypeScript",
    brand: "typescript",
    url: "https://www.typescriptlang.org",
  },
  {
    name: "Tailwind CSS",
    brand: "tailwindcss",
    url: "https://tailwindcss.com",
  },
  {
    name: "Spring Boot",
    brand: "spring",
    url: "https://spring.io/projects/spring-boot",
  },
  { name: "Java 21", brand: "java", url: "https://dev.java" },
  { name: "MySQL 8", brand: "mysql", url: "https://www.mysql.com" },
  { name: "Docker", brand: "docker", url: "https://www.docker.com" },
];
</script>

<template>
  <div>
    <!-- 顶部全宽 HeroBanner + 动态波浪 -->
    <HeroBanner
      title="关于「神秘花园」"
      subtitle="Personal Space · 游戏、兴趣、笔记与日常记录"
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
          Games, Notes & Everyday Moments
        </p>
      </div>

      <!-- 个人简介卡片 -->
      <Card
        class-name="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8"
      >
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 shadow-md"
        >
          <img
            src="/images/avatar.webp"
            alt="lka"
            class="w-full h-full object-cover rounded-full"
          />
        </div>
        <div class="space-y-2 text-center sm:text-left flex-1">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <h2
              class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100"
            >
              lka
            </h2>
            <span
              class="text-xs font-mono px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 self-center sm:self-auto"
            >
              Gamer · Blogger
            </span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Games · Notes · Daily Life
          </p>
          <p
            class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1"
          >
            喜欢游戏和各种有意思的事。这里放着我的游戏记录、知识笔记、日常想法，以及偶尔遇到的技术问题。
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
              href="https://space.bilibili.com/190840886"
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

      <!-- 小站的内容说明 -->
      <div class="space-y-4">
        <h2
          class="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
        >
          <Sparkles class="w-4 h-4 text-brand-600 dark:text-brand-400" />
          关于这个小站
        </h2>
        <div
          class="prose prose-zinc dark:prose-invert text-sm leading-relaxed space-y-3"
        >
          <p class="text-zinc-600 dark:text-zinc-400">
            「神秘花园」是一个用来收集兴趣和保存重要内容的个人小站。它没有固定的更新方向，记录的都是我当下真正感兴趣、以后还想回来查看的东西。
          </p>
          <ul
            class="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400 text-xs"
          >
            <li>
              <strong>文章</strong
              >：游戏体验、攻略、兴趣分享和想认真保存的文字。
            </li>
            <li>
              <strong>笔记</strong
              >：需要反复查阅的知识、操作步骤和实用资料。
            </li>
            <li>
              <strong>随笔</strong
              >：游戏进度、日常碎片和当时想记下的小事。
            </li>
          </ul>
        </div>
      </div>

      <!-- 未来展示区：预留主要视觉空间 -->
      <section class="space-y-4">
        <div
          class="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80"
        >
          <h2
            class="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
          >
            <Compass class="w-5 h-5 text-brand-600 dark:text-brand-400" />
            展示区域
          </h2>
          <span class="text-xs font-mono text-zinc-400">Future Space</span>
        </div>

        <div
          class="relative flex min-h-[30rem] items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-sky-200 bg-white/60 p-8 text-center shadow-xs backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50 sm:min-h-[34rem]"
        >
          <div class="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/20" />
          <div class="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/15" />
          <div class="relative max-w-md space-y-4">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-sky-50/80 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-sky-600 uppercase dark:border-sky-800/70 dark:bg-sky-950/40 dark:text-sky-300"
            >
              <Sparkles class="w-3 h-3" />
              Reserved for a future idea
            </span>
            <h3 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              一个还在构思中的展示区域
            </h3>
            <p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              这里暂时留白，未来会用来放置更适合这个小站的个人展示内容。
            </p>
          </div>
        </div>
      </section>

      <!-- 当前项目技术栈：作为页面底部的辅助信息 -->
      <section class="space-y-4 pb-12">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 class="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
              <Cpu class="w-4 h-4 text-brand-600 dark:text-brand-400" />
              这个小站使用的技术
            </h2>
            <p class="mt-1 text-xs text-zinc-400">
              仅列出当前项目实际使用的主要技术栈。
            </p>
          </div>
          <span class="hidden text-[10px] font-mono tracking-wider text-zinc-400 uppercase sm:block">
            Project Stack
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <a
            v-for="stack in projectStack"
            :key="stack.name"
            :href="stack.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-white/70 px-3 py-3 text-xs font-semibold text-zinc-700 shadow-xs transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-sky-700 dark:hover:text-sky-300"
          >
            <BrandIcon :name="stack.brand" :size="17" />
            <span class="truncate">{{ stack.name }}</span>
            <ExternalLink class="ml-auto w-3 h-3 shrink-0 text-zinc-300 transition-colors group-hover:text-sky-400 dark:text-zinc-600" />
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

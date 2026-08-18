<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Archive,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  ArrowRight,
  BookOpen,
  Tag as TagIcon,
  Filter,
  Sparkles,
  Layers
} from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Article } from '~/types'
import Badge from '~/components/ui/Badge.vue'
import Button from '~/components/ui/Button.vue'

// SSR 预取全部文章 (不限分页获取所有已发布文章进行全量归档)
const { data: res } = await useFetch<ApiResponse<{ list: Article[] }>>('/api/v1/articles', {
  params: { pageSize: 200 },
  transform: (response) => {
    if (response?.data?.list) {
      response.data.list = response.data.list.map(({ id, slug, title, createdAt, views, category, readingTime, tags, isPublished, isPinned, commentCount }) => ({
        id, slug, title, createdAt, views, category, readingTime, tags, isPublished, isPinned, commentCount
      })) as Article[]
    }
    return response
  }
})

const articles = computed(() => res.value?.data?.list || [])

// 选中的具体筛选日期 (格式: 'YYYY-MM-DD', 为 null 时展示完整时间轴)
const selectedDate = ref<string | null>(null)

// 当前日历正在查看的月份
const viewMonth = ref(dayjs())

// 日期文章映射表 Map<"YYYY-MM-DD", Article[]>
const articlesDateMap = computed(() => {
  const map = new Map<string, Article[]>()
  for (const a of articles.value) {
    const key = dayjs(a.createdAt).format('YYYY-MM-DD')
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(a)
  }
  return map
})

// 当前选中日期的文章列表
const selectedDayArticles = computed(() => {
  if (!selectedDate.value) return []
  return articlesDateMap.value.get(selectedDate.value) || []
})

// 全量文章按年份 + 月份二级分组 (用于默认全部展示)
const archivesByYear = computed(() => {
  const yearMap: Record<string, { year: string; count: number; months: Record<string, Article[]> }> = {}
  
  for (const a of articles.value) {
    const year = dayjs(a.createdAt).format('YYYY')
    const month = dayjs(a.createdAt).format('MM')
    
    if (!yearMap[year]) {
      yearMap[year] = { year, count: 0, months: {} }
    }
    yearMap[year].count++
    
    if (!yearMap[year].months[month]) {
      yearMap[year].months[month] = []
    }
    yearMap[year].months[month].push(a)
  }
  
  return Object.values(yearMap).sort((a, b) => Number(b.year) - Number(a.year))
})

// 计算日历网格数据 (42格 / 6行7列)
const calendarGrid = computed(() => {
  const startOfMonth = viewMonth.value.startOf('month')
  const endOfMonth = viewMonth.value.endOf('month')
  
  // 星期日为 0，星期一为 1... 调整为周一为起始
  const startDay = (startOfMonth.day() + 6) % 7
  const startDate = startOfMonth.subtract(startDay, 'day')
  
  const todayStr = dayjs().format('YYYY-MM-DD')
  const days = []

  for (let i = 0; i < 42; i++) {
    const current = startDate.add(i, 'day')
    const dateStr = current.format('YYYY-MM-DD')
    const isCurrentMonth = current.month() === viewMonth.value.month()
    const isToday = dateStr === todayStr
    const isSelected = dateStr === selectedDate.value
    const dayArticles = articlesDateMap.value.get(dateStr) || []
    const postCount = dayArticles.length

    days.push({
      date: current,
      dateStr,
      dayNum: current.date(),
      isCurrentMonth,
      isToday,
      isSelected,
      postCount
    })
  }
  return days
})

// 本月归档统计
const currentMonthArticleCount = computed(() => {
  const currentMonthStr = viewMonth.value.format('YYYY-MM')
  let count = 0
  for (const a of articles.value) {
    if (dayjs(a.createdAt).format('YYYY-MM') === currentMonthStr) {
      count++
    }
  }
  return count
})

// 日历操作函数
function prevMonth() {
  viewMonth.value = viewMonth.value.subtract(1, 'month')
}

function nextMonth() {
  viewMonth.value = viewMonth.value.add(1, 'month')
}

function resetToToday() {
  viewMonth.value = dayjs()
  selectedDate.value = null
}

function handleDateClick(day: any) {
  if (selectedDate.value === day.dateStr) {
    selectedDate.value = null // 再次点击取消筛选
  } else {
    selectedDate.value = day.dateStr
    // 如果点击的日期不在当前月份，自动同步切换月份视口
    if (!day.isCurrentMonth) {
      viewMonth.value = day.date.startOf('month')
    }
  }
}

function clearSelection() {
  selectedDate.value = null
}

useSeoMeta({
  title: '归档时间轴与日历检索 - 神秘花园',
  description: '按时间维度与交互式日历检索神秘花园的所有技术沉淀与架构长文'
})
</script>

<template>
  <div class="space-y-8 max-w-6xl mx-auto">
    <!-- 1. 顶部 Header 标题 -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
          <Archive class="w-7 h-7 text-brand-600 dark:text-brand-400" />
          归档时光轴
        </h1>
        <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
          Interactive Chronological Matrix · 共收录 {{ articles.length }} 篇深度长文
        </p>
      </div>

      <!-- 快速状态提示 / 重置 -->
      <div v-if="selectedDate" class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-800/50 text-xs font-mono text-brand-700 dark:text-brand-300">
          <Filter class="w-3.5 h-3.5" />
          <span>已过滤: {{ selectedDate }} ({{ selectedDayArticles.length }} 篇)</span>
        </div>
        <Button variant="outline" size="sm" class="gap-1 shadow-xs" @click="clearSelection">
          <RotateCcw class="w-3.5 h-3.5" />
          查看全部
        </Button>
      </div>
    </div>

    <!-- 2. 双栏布局 (左侧文章流 8列 + 右侧日历侧边栏 4列) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- 2.1 左侧主要内容区 (8列) -->
      <div class="lg:col-span-8 space-y-8">
        <!-- A. 模式一：选中具体日期时的精细展示 -->
        <div v-if="selectedDate" class="space-y-6">
          <div class="p-5 sm:p-6 rounded-3xl border border-brand-200/60 dark:border-brand-900/40 bg-brand-50/30 dark:bg-brand-950/10 backdrop-blur-md flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-400/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <CalendarIcon class="w-5 h-5" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {{ dayjs(selectedDate).format('YYYY年MM月DD日') }}
                </h2>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  当日共发布 {{ selectedDayArticles.length }} 篇归档内容
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" class="text-xs" @click="clearSelection">
              清除筛选
            </Button>
          </div>

          <!-- 当日文章列表 -->
          <div v-if="selectedDayArticles.length" class="space-y-3">
            <div
              v-for="article in selectedDayArticles"
              :key="article.id"
              class="p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:shadow-md transition-all duration-200 group"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-2 flex-1">
                  <div class="flex items-center gap-2">
                    <span v-if="article.category" class="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {{ article.category.name }}
                    </span>
                    <span class="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Clock class="w-3 h-3" />
                      {{ dayjs(article.createdAt).format('HH:mm:ss') }}
                    </span>
                    <span class="text-xs font-mono text-zinc-400">
                      · {{ article.readingTime }} 分钟阅读
                    </span>
                  </div>

                  <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    <NuxtLink :to="`/articles/${article.slug}`">
                      {{ article.title }}
                    </NuxtLink>
                  </h3>

                  <p v-if="article.summary" class="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {{ article.summary }}
                  </p>
                </div>

                <NuxtLink
                  :to="`/articles/${article.slug}`"
                  class="p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-zinc-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/40 transition-all self-center"
                >
                  <ArrowRight class="w-4 h-4" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- 当日无文章空状态 -->
          <div v-else class="text-center py-16 p-8 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-3">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
              <BookOpen class="w-6 h-6" />
            </div>
            <div class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              该日期暂无发表的文章归档
            </div>
            <p class="text-xs text-zinc-400 max-w-xs mx-auto">
              可以在右侧日历中点击带有绿色圆点标记的高亮日期查看对应文章
            </p>
            <div class="pt-2">
              <Button variant="outline" size="sm" @click="clearSelection">
                返回全站完整时间轴
              </Button>
            </div>
          </div>
        </div>

        <!-- B. 模式二：未过滤时展示完整年份时间轴 -->
        <div v-else class="space-y-12">
          <div v-for="yData in archivesByYear" :key="yData.year" class="space-y-6">
            <!-- 年份标头 -->
            <div class="flex items-center justify-between pb-3 border-b-2 border-zinc-200 dark:border-zinc-800">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
                  {{ yData.year }}
                </span>
                <span class="text-xs font-mono text-zinc-400">
                  {{ yData.count }} 篇沉淀
                </span>
              </div>
            </div>

            <!-- 月份分组与文章条目 -->
            <div class="space-y-8 pl-2">
              <div
                v-for="(mArticles, month) in yData.months"
                :key="month"
                class="relative pl-6 border-l-2 border-zinc-200/80 dark:border-zinc-800/80 space-y-3"
              >
                <!-- 月份指示点 -->
                <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-brand-500 ring-4 ring-white dark:ring-zinc-950" />

                <!-- 月份标签 -->
                <div class="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
                  {{ yData.year }}年 {{ month }}月 ({{ mArticles.length }} 篇)
                </div>

                <!-- 文章行 -->
                <div class="space-y-2.5">
                  <div
                    v-for="article in mArticles"
                    :key="article.id"
                    class="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="text-xs font-mono text-zinc-400 shrink-0">
                        {{ dayjs(article.createdAt).format('MM-DD') }}
                      </span>
                      <NuxtLink
                        :to="`/articles/${article.slug}`"
                        class="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate"
                      >
                        {{ article.title }}
                      </NuxtLink>
                    </div>

                    <div class="flex items-center gap-2 shrink-0 pl-11 sm:pl-0">
                      <span v-if="article.category" class="text-[11px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md">
                        {{ article.category.name }}
                      </span>
                      <span class="text-[11px] font-mono text-zinc-400">
                        {{ article.views }} 阅
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.2 右侧侧边栏：交互式日历矩阵 (4列) -->
      <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
        <!-- 日历卡片 -->
        <div class="p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs space-y-4">
          <!-- 日历头部控制器 -->
          <div class="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <div class="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {{ viewMonth.format('YYYY年 MM月') }}
              </div>
              <div class="text-[10px] font-mono text-zinc-400 mt-0.5">
                本月已归档 {{ currentMonthArticleCount }} 篇
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                type="button"
                class="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                title="上个月"
                @click="prevMonth"
              >
                <ChevronLeft class="w-4 h-4" />
              </button>
              <button
                type="button"
                class="px-2 py-1 rounded-xl text-xs font-mono font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                title="回到本月"
                @click="resetToToday"
              >
                今
              </button>
              <button
                type="button"
                class="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                title="下个月"
                @click="nextMonth"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 星期标头 -->
          <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-bold font-mono text-zinc-400 select-none">
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
            <span>日</span>
          </div>

          <!-- 42格日期网格 -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="cell in calendarGrid"
              :key="cell.dateStr"
              type="button"
              :class="[
                'relative h-9 rounded-xl text-xs font-mono font-medium flex flex-col items-center justify-center transition-all cursor-pointer select-none',
                // 1. 选中态
                cell.isSelected
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 font-bold scale-105 z-10'
                  : cell.isToday
                    ? 'ring-1.5 ring-brand-500/80 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-bold'
                    : cell.isCurrentMonth
                      ? 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                      : 'text-zinc-300 dark:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 opacity-40',
                // 2. 有文章日期的微底色强调
                cell.postCount > 0 && !cell.isSelected && 'font-bold text-zinc-900 dark:text-zinc-100'
              ]"
              @click="handleDateClick(cell)"
            >
              <span>{{ cell.dayNum }}</span>

              <!-- 文章数量标记小圆点 / 徽标 -->
              <span
                v-if="cell.postCount > 0"
                :class="[
                  'absolute bottom-1 w-1 h-1 rounded-full',
                  cell.isSelected ? 'bg-white' : 'bg-emerald-500 ring-1 ring-white dark:ring-zinc-900'
                ]"
              />
            </button>
          </div>

          <!-- 图例说明与快速提示 -->
          <div class="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>有发布文章</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-md border border-brand-500/80 inline-block" />
              <span>今日</span>
            </div>
          </div>
        </div>

        <!-- 归档维度小面板 (统计总览) -->
        <div class="p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-3">
          <div class="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 font-mono">
            <Layers class="w-3.5 h-3.5 text-zinc-500" />
            时序统计矩阵
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-800/50">
              <div class="text-zinc-400 text-[10px]">总收录年份</div>
              <div class="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {{ archivesByYear.length }} 年
              </div>
            </div>
            <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-800/50">
              <div class="text-zinc-400 text-[10px]">发文覆盖天数</div>
              <div class="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {{ articlesDateMap.size }} 天
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

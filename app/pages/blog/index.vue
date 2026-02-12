<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

useSeoMeta({
  title: 'Blog | Alkamind',
  description: 'Articles and thought leadership from Alkamind Consulting Inc.',
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          Blog
        </h1>
        <p class="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          Insights, articles, and thought leadership on change management, AI, and digital transformation.
        </p>

        <!-- Blog Posts Grid -->
        <div v-if="posts && posts.length > 0" class="space-y-8">
          <article
            v-for="post in posts"
            :key="post.path"
            class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <NuxtLink :to="post.path" class="block p-6">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <h2 class="text-xl font-semibold text-blue-800 hover:text-blue-600 transition-colors">
                  {{ post.title }}
                </h2>
                <span class="text-sm text-slate-500 mt-2 md:mt-0">
                  {{ formatDate(post.date) }}
                </span>
              </div>
              <p v-if="post.summary" class="text-slate-600 mb-2">{{ post.summary }}</p>
              <p v-if="post.author" class="text-sm text-slate-500">
                By {{ post.author }}
              </p>
            </NuxtLink>
          </article>
        </div>

        <!-- Fallback when no posts -->
        <div v-else class="text-center py-12">
          <div class="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h2 class="text-xl font-semibold text-slate-700 mb-2">No Posts Yet</h2>
            <p class="text-slate-500">
              Blog posts are coming soon. Check back later for articles and insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

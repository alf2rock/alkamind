<script setup lang="ts">
const route = useRoute()
const { getBlogPost } = useContentful()

const slug = route.params.slug as string
const { data: post } = await useAsyncData(`blogPost-${slug}`, () => getBlogPost(slug))

useSeoMeta({
  title: post.value?.blogPost ? `${post.value.blogPost} | Alkamind Blog` : 'Blog Post | Alkamind',
  description: post.value?.blogPost || 'Read this article from Alkamind Consulting.',
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

// Get image URL if available
const imageUrl = computed(() => {
  if (!post.value?.image?.fields?.file?.url) return null
  const url = post.value.image.fields.file.url
  return url.startsWith('//') ? `https:${url}` : url
})
</script>

<template>
  <div>
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-3xl mx-auto">
        <!-- Back link -->
        <NuxtLink
          to="/blog"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </NuxtLink>

        <article v-if="post">
          <!-- Featured Image -->
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="post.blogPost"
            class="w-full rounded-lg shadow-md mb-8"
          />

          <!-- Header -->
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {{ post.blogPost }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-slate-600">
              <span v-if="post.publishDate">{{ formatDate(post.publishDate) }}</span>
              <span v-if="post.author" class="flex items-center">
                <span class="w-1 h-1 bg-slate-400 rounded-full mx-3"></span>
                By {{ post.author }}
              </span>
            </div>
          </header>

          <!-- Content -->
          <div
            v-if="post.body"
            class="prose prose-lg max-w-none text-slate-700"
            v-html="renderRichText(post.body)"
          ></div>
        </article>

        <!-- Post not found -->
        <div v-else class="text-center py-12">
          <div class="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <h2 class="text-xl font-semibold text-slate-700 mb-2">Post Not Found</h2>
            <p class="text-slate-500 mb-6">
              The blog post you're looking for doesn't exist or hasn't been published yet.
            </p>
            <NuxtLink
              to="/blog"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Browse All Posts
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

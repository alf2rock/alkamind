<script setup lang="ts">
const { getOurStoryPage } = useContentful()

const { data: pageData } = await useAsyncData('ourStory', () => getOurStoryPage())

useSeoMeta({
  title: pageData.value?.title ? `${pageData.value.title} | Alkamind` : 'Our Story | Alkamind',
  description: 'Discover the journey and story behind Alkamind Consulting Inc.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          {{ pageData?.title || 'Our Story' }}
        </h1>

        <div v-if="pageData?.content" class="prose prose-lg max-w-none text-slate-700">
          <div v-html="renderRichText(pageData.content)"></div>
        </div>

        <!-- Fallback content when no Contentful data -->
        <div v-else class="text-lg text-slate-600 space-y-6">
          <p>
            Alkamind Consulting Inc. was founded with a vision to help small businesses navigate
            the rapidly changing landscape of technology and digital transformation.
          </p>
          <p>
            Our journey began with a simple belief: that every business, regardless of size,
            deserves access to enterprise-level consulting and technology solutions.
          </p>
          <p>
            Today, we continue to serve our clients with dedication, helping them embrace
            change management practices and leverage AI to secure their future in the digital age.
          </p>
          <p class="text-slate-500 italic">
            Content coming soon. Check back for the full story of Alkamind.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

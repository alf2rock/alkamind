<script setup lang="ts">
const { getOurStoryPage } = useContentful()

const { data: pageData } = await useAsyncData('ourStory', () => getOurStoryPage())

useSeoMeta({
  title: pageData.value?.pageTitle ? `${pageData.value.pageTitle} | Alkamind` : 'Our Story | Alkamind',
  description: 'Discover the journey and story behind Alkamind Consulting Inc.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          {{ pageData?.pageTitle || 'Our Story' }}
        </h1>

        <p v-if="pageData?.subtitle" class="text-xl text-slate-600 text-center mb-12">
          {{ pageData.subtitle }}
        </p>

        <div v-if="pageData?.bodyContent" class="prose prose-lg max-w-none text-slate-700">
          <div v-html="renderRichText(pageData.bodyContent)"></div>
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

        <!-- CTA Button -->
        <div v-if="pageData?.ctaText && pageData?.ctaLink" class="text-center mt-12">
          <a
            :href="pageData.ctaLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {{ pageData.ctaText }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

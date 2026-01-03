<script setup lang="ts">
const { getAboutPage } = useContentful()

const { data: pageData } = await useAsyncData('about', () => getAboutPage())

useSeoMeta({
  title: pageData.value?.title ? `${pageData.value.title} | Alkamind` : 'About Us | Alkamind',
  description: 'Learn about Alkamind Consulting Inc. and our team of experts.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          {{ pageData?.title || 'About Us' }}
        </h1>

        <div v-if="pageData?.content" class="prose prose-lg max-w-none text-slate-700">
          <div v-html="renderRichText(pageData.content)"></div>
        </div>

        <!-- Fallback content when no Contentful data -->
        <div v-else class="text-lg text-slate-600 space-y-6">
          <p>
            At Alkamind Consulting Inc., we specialize in Change Management and Application Development,
            helping organizations navigate complex transformations with confidence.
          </p>
          <p>
            Our team brings decades of experience in enterprise technology, digital transformation,
            and AI implementation to help small businesses compete in today's fast-paced market.
          </p>
          <div class="bg-white rounded-lg p-8 shadow-sm border border-slate-200 mt-8">
            <h2 class="text-2xl font-semibold text-blue-800 mb-4">Our Services</h2>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="text-blue-600 mr-3">•</span>
                Change Management Consulting
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-3">•</span>
                Application Development
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-3">•</span>
                AI Solutions & Integration
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-3">•</span>
                eCommerce Strategy
              </li>
            </ul>
          </div>
          <p class="text-slate-500 italic">
            Full team and company information coming soon.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

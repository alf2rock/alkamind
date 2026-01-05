<script setup lang="ts">
const { data: page } = await useAsyncData('use-cases', () =>
  queryContent('/pages/use-cases').findOne()
)

useSeoMeta({
  title: 'Use Cases | Alkamind',
  description: 'Explore client success stories and use cases from Alkamind Consulting Inc.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          {{ page?.title || 'Use Cases' }}
        </h1>

        <div class="prose prose-lg max-w-none text-slate-600">
          <ContentRenderer v-if="page" :value="page" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Placeholder content - will be replaced with Nuxt Content in Phase 3
const useCases: any[] = []

useSeoMeta({
  title: 'Use Cases | Alkamind',
  description: 'Explore client success stories and use cases from Alkamind Consulting Inc.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          Use Cases
        </h1>
        <p class="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          Discover how we've helped organizations overcome challenges and achieve meaningful results.
        </p>

        <!-- Use Cases List -->
        <div v-if="useCases && useCases.length > 0" class="space-y-8">
          <article
            v-for="useCase in useCases"
            :key="useCase.title"
            class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
          >
            <div class="p-6 md:p-8">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 class="text-2xl font-semibold text-blue-800">
                  {{ useCase.title }}
                </h2>
                <span v-if="useCase.client" class="text-sm text-slate-500 mt-2 md:mt-0 bg-slate-100 px-3 py-1 rounded-full">
                  {{ useCase.client }}
                </span>
              </div>

              <div v-if="useCase.challenge" class="mb-6">
                <h3 class="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                  <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Challenge
                </h3>
                <p class="text-slate-600 pl-4">{{ useCase.challenge }}</p>
              </div>

              <div v-if="useCase.solution" class="mb-6">
                <h3 class="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Solution
                </h3>
                <p class="text-slate-600 pl-4">{{ useCase.solution }}</p>
              </div>

              <div v-if="useCase.results">
                <h3 class="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Results
                </h3>
                <p class="text-slate-600 pl-4">{{ useCase.results }}</p>
              </div>
            </div>
          </article>
        </div>

        <!-- Fallback when no use cases -->
        <div v-else class="text-center py-12">
          <div class="bg-white rounded-lg p-8 shadow-sm border border-slate-200 max-w-lg mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h2 class="text-xl font-semibold text-slate-700 mb-2">Case Studies Coming Soon</h2>
            <p class="text-slate-500 mb-6">
              We're documenting our client success stories. Check back soon to explore our use cases.
            </p>
            <NuxtLink
              to="/"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { getAIPortals } = useContentful()

const { data: portals } = await useAsyncData('aiPortals', () => getAIPortals())

useSeoMeta({
  title: 'AI Portals | Alkamind',
  description: 'Explore AI tools and solutions from Alkamind Consulting Inc.',
})

// Get icon URL from portal
const getIconUrl = (portal: any) => {
  if (!portal?.icon?.fields?.file?.url) return null
  const url = portal.icon.fields.file.url
  return url.startsWith('//') ? `https:${url}` : url
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          AI Portals
        </h1>
        <p class="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          Access our curated collection of AI tools and solutions designed to help your business thrive in the Age of AI.
        </p>

        <!-- Portals Grid -->
        <div v-if="portals && portals.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            v-for="portal in portals"
            :key="portal.id"
            :href="portal.link"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <div class="flex items-start gap-4">
              <div v-if="getIconUrl(portal)" class="flex-shrink-0">
                <img
                  :src="getIconUrl(portal)"
                  :alt="portal.title"
                  class="w-12 h-12 rounded-lg object-cover"
                />
              </div>
              <div v-else class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-semibold text-blue-800 group-hover:text-blue-600 transition-colors mb-2">
                  {{ portal.title }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </h2>
                <p class="text-slate-600 text-sm">
                  {{ portal.description }}
                </p>
              </div>
            </div>
          </a>
        </div>

        <!-- Fallback when no portals -->
        <div v-else class="text-center py-12">
          <div class="bg-white rounded-lg p-8 shadow-sm border border-slate-200 max-w-lg mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 class="text-xl font-semibold text-slate-700 mb-2">AI Portals Coming Soon</h2>
            <p class="text-slate-500">
              We're curating a collection of powerful AI tools. Check back soon to explore our AI portals.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

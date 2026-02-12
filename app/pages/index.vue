<script setup lang="ts">
const { data: home } = await useAsyncData('home', () =>
  queryCollection('pages').path('/pages/home').first()
)

useSeoMeta({
  title: 'Alkamind Consulting Inc.',
  description: 'Change Management & Application Development consultancy helping small businesses with eComm and AI solutions.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="px-6 py-20 md:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
          {{ home?.title || 'Change Management & Application Development' }}
        </h1>
        <div class="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed whitespace-pre-line text-left">
          {{ home?.subtitle || 'We are dedicated to providing small businesses with eComm and AI solutions to protect their viability and position them into the Age of AI.' }}
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            :href="home?.ctaLink || 'https://calendly.com/alf-alkamind/coaching-session'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {{ home?.ctaText || 'Book a Session' }}
          </a>
          <a
            v-if="home?.cta2Text && home?.cta2Link"
            :href="home.cta2Link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
          >
            {{ home.cta2Text }}
          </a>
        </div>

        <div v-if="home?.heroImage" class="mt-10">
          <img
            :src="home.heroImage"
            :alt="home?.title || 'Alkamind'"
            class="mx-auto rounded-lg shadow-md max-w-full"
          />
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="px-6 py-16 md:py-24 bg-white">
      <div class="max-w-3xl mx-auto text-center">
        <p class="text-lg md:text-xl text-slate-600 mb-10">
          Let us start with a conversation around context, needs and wants.
        </p>

        <div class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          <!-- Email -->
          <a
            href="mailto:alf@alkamind.com"
            class="flex items-center gap-3 text-blue-800 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-lg">alf@alkamind.com</span>
          </a>

          <!-- Phone -->
          <a
            href="tel:+14165745330"
            class="flex items-center gap-3 text-blue-800 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="text-lg">+1-416-574-5330</span>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/in/alfrock"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 text-blue-800 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span class="text-lg">alfrock</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-6 py-8 text-center text-slate-500 text-sm">
      <div class="max-w-4xl mx-auto mb-6">
        <img src="/stratified-governance-model.jpg" alt="Stratified Governance Model" class="mx-auto rounded-lg shadow-md" />
      </div>
      <p>&copy; {{ new Date().getFullYear() }} Alkamind Consulting Inc.</p>
    </footer>
  </div>
</template>

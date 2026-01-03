<script setup lang="ts">
const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Our Story', path: '/our-story' },
  { name: 'About Us', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'AI Portals', path: '/ai-portals' },
  { name: 'Use Cases', path: '/use-cases' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0" @click="closeMenu">
          <img src="/logo Alkamind.jpg" alt="Alkamind" class="h-12 md:h-16" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200"
            active-class="text-blue-600"
          >
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- Mobile Hamburger Button -->
        <button
          type="button"
          class="md:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors"
          @click="toggleMenu"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <!-- Hamburger Icon -->
          <svg
            v-if="!isMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <!-- Close Icon -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <div
        v-show="isMenuOpen"
        class="md:hidden border-t border-slate-100 py-4"
      >
        <div class="flex flex-col space-y-3">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-slate-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
            active-class="text-blue-600"
            @click="closeMenu"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

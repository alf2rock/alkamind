<script setup lang="ts">
// Netlify Identity widget handler for CMS login redirect
onMounted(() => {
  if (typeof window !== 'undefined' && (window as any).netlifyIdentity) {
    (window as any).netlifyIdentity.on('init', (user: any) => {
      if (!user) {
        (window as any).netlifyIdentity.on('login', () => {
          document.location.href = '/admin/'
        })
      }
    })
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

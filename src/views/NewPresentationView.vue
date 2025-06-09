<template>
  <div>
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Create New Presentation
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <router-link
          :to="{ name: 'presentations' }"
          class="kt-btn-secondary"
        >
          Back to Presentations
        </router-link>
      </div>
    </div>

    <PresentationGenerator />
  </div>
</template>

<script setup lang="ts">
import PresentationGenerator from '@/components/PresentationGenerator.vue'
</script> 
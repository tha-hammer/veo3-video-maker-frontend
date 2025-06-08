<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="../assets/logo.svg" alt="Logo" />
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                :class="[
                  isCurrentRoute('/') 
                    ? 'border-kt-primary text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                Dashboard
              </router-link>
              <router-link
                to="/presentations"
                :class="[
                  isCurrentRoute('/presentations') 
                    ? 'border-kt-primary text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                Presentations
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <router-link
              :to="{ name: 'new-presentation' }"
              class="kt-btn-primary"
            >
              New Presentation
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isCurrentRoute = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script> 
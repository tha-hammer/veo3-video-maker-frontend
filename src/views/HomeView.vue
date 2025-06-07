<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Recent Presentations Card -->
      <div class="kt-card">
        <h3 class="text-lg font-medium text-gray-900">Recent Presentations</h3>
        <div class="mt-4 space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-lg bg-kt-primary-light flex items-center justify-center">
                <svg class="h-6 w-6 text-kt-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900">Sample Presentation {{ i }}</p>
              <p class="text-sm text-gray-500">Last edited 2h ago</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Card -->
      <div class="kt-card">
        <h3 class="text-lg font-medium text-gray-900">Statistics</h3>
        <dl class="mt-4 grid grid-cols-1 gap-4">
          <div class="rounded-lg bg-kt-primary-light p-4">
            <dt class="text-sm font-medium text-kt-primary">Total Presentations</dt>
            <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div class="flex items-baseline text-2xl font-semibold text-kt-primary">
                12
              </div>
            </dd>
          </div>
          <div class="rounded-lg bg-green-50 p-4">
            <dt class="text-sm font-medium text-green-700">Completed Reviews</dt>
            <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div class="flex items-baseline text-2xl font-semibold text-green-700">
                8
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <!-- Quick Actions Card -->
      <div class="kt-card">
        <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
        <div class="mt-4 space-y-4">
          <button class="w-full kt-btn-primary">
            Create New Presentation
          </button>
          <button class="w-full kt-btn-light">
            View All Presentations
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script> 
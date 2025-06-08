<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Presentations
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <router-link
          :to="{ name: 'new-presentation' }"
          class="kt-btn-primary"
        >
          New Presentation
        </router-link>
      </div>
    </div>

    <!-- Presentation List -->
    <div class="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="i in 5" :key="i">
          <a href="#" class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="truncate">
                  <div class="flex text-sm">
                    <p class="font-medium text-kt-primary truncate">Sample Presentation {{ i }}</p>
                    <p class="ml-1 flex-shrink-0 font-normal text-gray-500">in Marketing</p>
                  </div>
                  <div class="mt-2 flex">
                    <div class="flex items-center text-sm text-gray-500">
                      <svg class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
                      </svg>
                      <span>Created on <time>Mar 15, 2024</time></span>
                    </div>
                  </div>
                </div>
                <div class="ml-5 flex flex-shrink-0">
                  <span class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script> 
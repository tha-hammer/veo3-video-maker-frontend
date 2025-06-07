<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Review Presentation
        </h2>
      </div>
      <div class="mt-4 flex space-x-3 md:ml-4 md:mt-0">
        <button type="button" class="kt-btn-light">
          Request Changes
        </button>
        <button type="button" class="kt-btn-primary">
          Approve
        </button>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Preview Panel -->
      <div class="lg:col-span-2">
        <div class="kt-card h-[600px] flex items-center justify-center">
          <p class="text-gray-500">Presentation Preview</p>
        </div>
      </div>

      <!-- Review Panel -->
      <div class="space-y-6">
        <!-- Quality Scores -->
        <div class="kt-card">
          <h3 class="text-lg font-medium text-gray-900">Quality Scores</h3>
          <dl class="mt-4 space-y-4">
            <div class="flex items-center justify-between">
              <dt class="text-sm font-medium text-gray-500">Structure</dt>
              <dd class="text-sm font-medium text-kt-primary">85%</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-sm font-medium text-gray-500">Content</dt>
              <dd class="text-sm font-medium text-kt-success">92%</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-sm font-medium text-gray-500">Visual Design</dt>
              <dd class="text-sm font-medium text-kt-warning">78%</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-sm font-medium text-gray-500">Flow</dt>
              <dd class="text-sm font-medium text-kt-info">88%</dd>
            </div>
          </dl>
        </div>

        <!-- Feedback -->
        <div class="kt-card">
          <h3 class="text-lg font-medium text-gray-900">Agent Feedback</h3>
          <div class="mt-4 space-y-4">
            <div class="rounded-md bg-yellow-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">Visual Design Suggestions</h3>
                  <div class="mt-2 text-sm text-yellow-700">
                    <ul role="list" class="list-disc space-y-1 pl-5">
                      <li>Consider increasing contrast in slide 3</li>
                      <li>Optimize image placement for better flow</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Content Strengths</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <ul role="list" class="list-disc space-y-1 pl-5">
                      <li>Clear and concise messaging</li>
                      <li>Well-structured arguments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Notes -->
        <div class="kt-card">
          <h3 class="text-lg font-medium text-gray-900">Review Notes</h3>
          <div class="mt-4">
            <textarea
              rows="4"
              class="kt-input block w-full"
              placeholder="Add your review notes here..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const presentationId = route.params.id
</script> 
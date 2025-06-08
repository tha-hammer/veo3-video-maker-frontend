<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <div class="kt-card">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Create Presentation</h3>
      </div>
      
      <div class="space-y-6">
        <!-- Script Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Presentation Script
          </label>
          <textarea
            v-model="store.script"
            rows="6"
            class="kt-input w-full"
            placeholder="Enter your presentation script here..."
            :disabled="store.isGenerating"
          ></textarea>
        </div>

        <!-- Options -->
        <div class="flex items-center">
          <label class="inline-flex items-center cursor-pointer">
            <input
              v-model="enhancedMode"
              type="checkbox"
              id="enhancedMode"
              class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              :disabled="store.isGenerating"
            />
            <span class="ml-2 text-sm text-gray-700">
              Use Enhanced Mode (Multi-Agent Processing)
            </span>
          </label>
        </div>

        <!-- Error Display -->
        <div 
          v-if="store.error" 
          class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
        >
          {{ store.error }}
        </div>

        <!-- Success Display -->
        <div 
          v-if="store.presentationData && store.status?.status === JobStatus.SUCCESS" 
          class="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div class="text-green-700 mb-4">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-2xl">🎉</span>
              <h4 class="text-lg font-medium">PRESENTATION CREATED SUCCESSFULLY!</h4>
              <span class="text-2xl">🎉</span>
            </div>
            
            <div class="mt-4 text-sm space-y-2 font-mono bg-white p-4 rounded border border-green-100">
              <h5 class="font-medium text-base mb-2">📊 Summary:</h5>
              <div v-if="store.presentationData">
                <p><span class="text-gray-600">•</span> Title: {{ store.presentationData.title }}</p>
                <p><span class="text-gray-600">•</span> Slides: {{ store.presentationData.slides }}</p>
                <p><span class="text-gray-600">•</span> AI Backgrounds: {{ store.presentationData.ai_backgrounds }}</p>
                <p class="truncate">
                  <span class="text-gray-600">•</span> PowerPoint File: 
                  <span class="text-blue-600">{{ store.presentationData.powerpoint_file }}</span>
                </p>
                <p><span class="text-gray-600">•</span> Bucket: {{ store.presentationData.bucket }}</p>
                <p>
                  <span class="text-gray-600">•</span> Models Used: 
                  <code class="text-xs bg-gray-100 px-1 py-0.5 rounded">
                    {{ JSON.stringify(store.presentationData.models_used || {}) }}
                  </code>
                </p>
              </div>
            </div>
          </div>

          <div class="flex space-x-4">
            <a 
              :href="store.presentationData?.powerpoint_file" 
              class="kt-btn-primary inline-flex items-center space-x-2"
              target="_blank"
              rel="noopener noreferrer"
              v-if="store.presentationData?.powerpoint_file"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>Download PowerPoint</span>
            </a>

            <a
              v-if="store.presentationData?.json_path"
              :href="store.presentationData.json_path"
              class="kt-btn-light inline-flex items-center space-x-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>View Metadata</span>
            </a>
          </div>
        </div>

        <!-- Processing Display -->
        <div 
          v-if="store.isGenerating" 
          class="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div class="space-y-4">
            <!-- Main Status -->
            <div class="flex items-center space-x-3">
              <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div>
                <p class="text-blue-700 font-medium">{{ store.statusMessage }}</p>
              </div>
            </div>

            <!-- Detailed Progress -->
            <div v-if="processingDetails" class="space-y-3 font-mono text-sm">
              <!-- Title Extraction -->
              <div v-if="processingDetails.title" class="text-blue-700">
                <p>📝 Title: "{{ processingDetails.title }}"</p>
              </div>

              <!-- Script Processing -->
              <div v-if="processingDetails.slides_count" class="text-blue-700">
                <p>✅ Generated structure for {{ processingDetails.slides_count }} slides</p>
              </div>

              <!-- Current Slide Progress -->
              <div v-if="processingDetails.current_slide" class="space-y-2">
                <p class="text-blue-700">
                  📄 Processing Slide {{ processingDetails.current_slide.number }}/{{ processingDetails.slides_count }}: 
                  {{ processingDetails.current_slide.title }}
                </p>
                <p class="text-blue-600 ml-3">Type: {{ processingDetails.current_slide.type }}</p>
                
                <!-- Background Generation Status -->
                <div v-if="processingDetails.current_slide.background_status" class="ml-3 text-blue-600">
                  <p>🎨 {{ processingDetails.current_slide.background_status }}</p>
                </div>

                <!-- Progress Bar -->
                <div v-if="processingDetails.progress != null" class="mt-2">
                  <div class="w-full bg-blue-100 rounded-full h-2.5">
                    <div 
                      class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      :style="{ width: `${processingDetails.progress}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-blue-600 mt-1 text-right">
                    {{ Math.round(processingDetails.progress) }}%
                  </p>
                </div>
              </div>

              <!-- Final Steps -->
              <div v-if="processingDetails.saving" class="text-blue-700">
                <p>💾 {{ processingDetails.saving }}</p>
              </div>
            </div>

            <!-- Simple Status Message (Fallback) -->
            <p 
              v-if="!processingDetails && store.status?.message" 
              class="text-sm text-blue-600 mt-1"
            >
              {{ store.status.message }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between pt-4 border-t border-gray-200">
          <button
            class="kt-btn-primary"
            @click="handleGenerate"
            :disabled="!canGenerate"
          >
            {{ generateButtonText }}
          </button>

          <button
            v-if="store.isProcessing || store.presentationData"
            class="kt-btn-light"
            @click="store.reset"
          >
            Start New
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePresentationStore } from '@/stores/presentationStore';
import { JobStatus } from '@/services/presentationService';

const store = usePresentationStore();
const enhancedMode = ref(false);

const canGenerate = computed(() => {
  return store.script.trim().length > 0 && !store.isGenerating;
});

const generateButtonText = computed(() => {
  if (store.isGenerating) return 'Generating...';
  return 'Generate Presentation';
});

const processingDetails = computed(() => {
  return store.status?.processing_details || null;
});

async function handleGenerate() {
  if (!canGenerate.value) return;
  
  await store.generatePresentation({
    enhanced_mode: enhancedMode.value
  });
}
</script>

<style scoped>
.kt-btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.kt-btn-light {
  @apply bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.kt-input {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}
</style> 
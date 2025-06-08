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
            <!-- Header -->
            <div class="text-center pb-3 border-b border-blue-200">
              <div class="flex items-center justify-center space-x-3 mb-2">
                <svg class="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 class="text-lg font-medium text-blue-700">Generating Presentation</h3>
              </div>
              <p class="text-blue-600 text-sm">Please wait while we create your presentation...</p>
            </div>

            <!-- Scrollable Progress Timeline -->
            <div class="max-h-96 overflow-y-auto bg-white rounded-lg border border-blue-100 p-4">
              <div v-if="processingDetails" class="space-y-4">
                <!-- Title Extraction -->
                <div v-if="processingDetails.title" class="kt-progress-item">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-kt-success rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-medium">✓</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-kt-success font-medium">Title Extracted</p>
                      <p class="text-gray-600 text-sm mt-1 break-words">"{{ processingDetails.title }}"</p>
                    </div>
                  </div>
                </div>

                <!-- Script Processing -->
                <div v-if="processingDetails.slides_count" class="kt-progress-item">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-kt-success rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-medium">✓</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-kt-success font-medium">Script Structure Generated</p>
                      <p class="text-gray-600 text-sm mt-1">
                        Created structure for {{ processingDetails.slides_count }} slides
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Current Slide Progress -->
                <div v-if="processingDetails.current_slide" class="kt-progress-item">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-kt-primary rounded-full flex items-center justify-center">
                      <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-kt-primary font-medium">
                        Processing Slide {{ processingDetails.current_slide.number }}/{{ processingDetails.slides_count }}
                      </p>
                      <p class="text-gray-800 font-medium mt-1 break-words">
                        {{ processingDetails.current_slide.title }}
                      </p>
                      <div class="mt-2 space-y-2">
                        <div class="text-sm">
                          <span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                            {{ processingDetails.current_slide.type }}
                          </span>
                        </div>
                        
                        <!-- Background Generation Status -->
                        <div v-if="processingDetails.current_slide.background_status" class="text-sm">
                          <div class="flex items-center space-x-2">
                            <span class="text-2xl">🎨</span>
                            <span class="text-kt-primary">{{ processingDetails.current_slide.background_status }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Progress Bar -->
                      <div v-if="processingDetails.progress != null" class="mt-3">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-gray-600">Progress</span>
                          <span class="text-xs text-kt-primary font-medium">
                            {{ Math.round(processingDetails.progress) }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            class="bg-kt-primary h-2 rounded-full transition-all duration-500 ease-out" 
                            :style="{ width: `${processingDetails.progress}%` }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Final Steps -->
                <div v-if="processingDetails.saving" class="kt-progress-item">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-kt-warning rounded-full flex items-center justify-center">
                      <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-kt-warning font-medium">Finalizing</p>
                      <p class="text-gray-600 text-sm mt-1 break-words">{{ processingDetails.saving }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Simple Status Message (Fallback) -->
              <div 
                v-if="!processingDetails" 
                class="kt-progress-item"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-kt-primary rounded-full flex items-center justify-center">
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-kt-primary font-medium">Initializing</p>
                    <p class="text-gray-600 text-sm mt-1">Setting up presentation generation...</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Processing Time Indicator -->
            <div class="text-center">
              <p class="text-xs text-blue-500">
                <span class="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
                This may take a few minutes to complete
              </p>
            </div>
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

.kt-progress-item {
  @apply relative;
}

.kt-progress-item:not(:last-child)::after {
  content: '';
  @apply absolute left-4 top-8 w-px h-full bg-gray-200;
}

/* Custom scrollbar for progress timeline */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-lg;
}

.max-h-96::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-lg;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style> 
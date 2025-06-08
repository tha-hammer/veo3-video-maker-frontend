<template>
  <div class="presentation-generator">
    <!-- Script Input -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Create Presentation</h3>
      </div>
      <div class="card-body">
        <div class="mb-5">
          <label class="form-label">Presentation Script</label>
          <textarea
            v-model="store.script"
            class="form-control"
            rows="6"
            placeholder="Enter your presentation script here..."
            :disabled="store.isGenerating"
          ></textarea>
        </div>

        <!-- Options -->
        <div class="mb-5">
          <div class="form-check form-switch">
            <input
              v-model="enhancedMode"
              class="form-check-input"
              type="checkbox"
              id="enhancedMode"
              :disabled="store.isGenerating"
            />
            <label class="form-check-label" for="enhancedMode">
              Use Enhanced Mode (Multi-Agent Processing)
            </label>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="store.error" class="alert alert-danger" role="alert">
          {{ store.error }}
        </div>

        <!-- Status Display -->
        <div v-if="store.isGenerating" class="alert alert-info" role="alert">
          <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            {{ store.statusMessage }}
          </div>
        </div>

        <!-- Success Display -->
        <div v-if="store.resultUrl" class="alert alert-success" role="alert">
          <div class="mb-2">Your presentation is ready!</div>
          <a :href="store.resultUrl" class="btn btn-sm btn-success" download>
            Download Presentation
          </a>
        </div>

        <!-- Actions -->
        <div class="d-flex justify-content-between">
          <button
            class="btn btn-primary"
            @click="handleGenerate"
            :disabled="!canGenerate"
          >
            {{ generateButtonText }}
          </button>

          <button
            v-if="store.isProcessing || store.resultUrl"
            class="btn btn-secondary"
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

const store = usePresentationStore();
const enhancedMode = ref(false);

const canGenerate = computed(() => {
  return store.script.trim().length > 0 && !store.isGenerating;
});

const generateButtonText = computed(() => {
  if (store.isGenerating) return 'Generating...';
  return 'Generate Presentation';
});

async function handleGenerate() {
  if (!canGenerate.value) return;
  
  await store.generatePresentation({
    enhanced_mode: enhancedMode.value
  });
}
</script>

<style scoped>
.presentation-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style> 
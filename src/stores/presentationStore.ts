import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  presentationService, 
  type StatusResponse,
  type PresentationData,
  type ProcessingDetails,
  type PresentationRequest,
  JobStatus
} from '@/services/presentationService';

export const usePresentationStore = defineStore('presentation', () => {
  // State
  const currentJobId = ref<string | null>(null);
  const script = ref('');
  const status = ref<StatusResponse | null>(null);
  const error = ref<string | null>(null);
  const isProcessing = ref(false);
  const presentationData = ref<PresentationData | null>(null);

  // Computed
  const isGenerating = computed(() => {
    return status.value?.status === JobStatus.PROCESSING;
  });

  const statusMessage = computed(() => {
    if (!status.value) return '';
    return status.value.message || 'Generating presentation...';
  });

  // Actions
  async function generatePresentation(options: { enhanced_mode: boolean } = { enhanced_mode: false }) {
    try {
      error.value = null;
      isProcessing.value = true;

      // Start the job
      const request: PresentationRequest = {
        script: script.value,
        enhanced_mode: options.enhanced_mode
      };
      const { job_id, status_url } = await presentationService.createPresentation(request);
      currentJobId.value = job_id;

      // Poll for status
      while (true) {
        const response = await presentationService.getPresentationStatus(job_id);
        status.value = response;

        if (response.presentation_data) {
          presentationData.value = response.presentation_data;
        }

        if (response.status === JobStatus.SUCCESS || response.status === JobStatus.FAILURE) {
          if (response.status === JobStatus.FAILURE) {
            error.value = response.message || 'An error occurred during presentation generation.';
          }
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred.';
    } finally {
      isProcessing.value = false;
    }
  }

  function reset() {
    currentJobId.value = null;
    script.value = '';
    status.value = null;
    error.value = null;
    isProcessing.value = false;
    presentationData.value = null;
  }

  return {
    // State
    script,
    status,
    error,
    isProcessing,
    presentationData,

    // Computed
    isGenerating,
    statusMessage,

    // Actions
    generatePresentation,
    reset
  };
}); 
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { presentationService, type StatusResponse, type PresentationRequest, JobStatus } from '@/services/presentationService';

export const usePresentationStore = defineStore('presentation', () => {
  // State
  const currentJobId = ref<string | null>(null);
  const script = ref('');
  const status = ref<StatusResponse | null>(null);
  const error = ref<string | null>(null);
  const isProcessing = ref(false);

  // Computed
  const isGenerating = computed(() => {
    return status.value?.status === JobStatus.PENDING || 
           status.value?.status === JobStatus.PROCESSING;
  });

  const resultUrl = computed(() => status.value?.result_url);

  const statusMessage = computed(() => {
    if (!status.value) return '';
    return status.value.message || getDefaultStatusMessage(status.value.status);
  });

  // Actions
  async function generatePresentation(options: { enhanced_mode: boolean } = { enhanced_mode: false }) {
    try {
      isProcessing.value = true;
      error.value = null;

      const request: PresentationRequest = {
        script: script.value,
        enhanced_mode: options.enhanced_mode
      };

      const { job_id } = await presentationService.createPresentation(request);
      currentJobId.value = job_id;

      // Start polling for status
      presentationService.startPolling(job_id, {
        onProgress: (newStatus) => {
          status.value = newStatus;
        },
        onSuccess: (finalStatus) => {
          status.value = finalStatus;
          isProcessing.value = false;
        },
        onError: (err) => {
          error.value = err.message;
          isProcessing.value = false;
        }
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate presentation';
      isProcessing.value = false;
    }
  }

  function reset() {
    if (currentJobId.value) {
      presentationService.stopPolling(currentJobId.value);
    }
    currentJobId.value = null;
    status.value = null;
    error.value = null;
    isProcessing.value = false;
  }

  // Helper function
  function getDefaultStatusMessage(jobStatus: JobStatus): string {
    switch (jobStatus) {
      case JobStatus.PENDING:
        return 'Preparing to generate presentation...';
      case JobStatus.PROCESSING:
        return 'Generating your presentation...';
      case JobStatus.SUCCESS:
        return 'Presentation generated successfully!';
      case JobStatus.FAILURE:
        return 'Failed to generate presentation';
      default:
        return '';
    }
  }

  return {
    // State
    script,
    status,
    error,
    isProcessing,
    
    // Computed
    isGenerating,
    resultUrl,
    statusMessage,
    
    // Actions
    generatePresentation,
    reset
  };
}); 
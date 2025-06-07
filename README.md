# Veo3 Video Maker - Frontend

Modern Vue.js frontend for the Veo3 Video Maker system, providing an intuitive interface for AI-powered presentation generation.

## Architecture Overview

### Technology Stack
- **Framework**: Vue.js with TypeScript
- **Styling**: Tailwind CSS + Metronic UI
- **Build Tool**: Vite
- **Infrastructure**: Google Cloud Storage + CDN
- **CI/CD**: Cloud Build

### Infrastructure
All infrastructure is managed through Terraform in the `/terraform` directory:
- Static website hosting
- CDN configuration
- SSL certificates
- Cloud Build CI/CD pipeline

## Development Setup

1. **Prerequisites**
   ```bash
   # Install dependencies
   npm install

   # Set up environment
   cp .env.example .env
   ```

2. **Environment Configuration**
   ```env
   VITE_API_URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net
   VITE_STORAGE_BUCKET=${PROJECT_ID}-presentation-assets
   ```

3. **Local Development**
   ```bash
   # Start development server
   npm run dev

   # Run tests
   npm test

   # Build for production
   npm run build
   ```

## Deployment

### Infrastructure Deployment
```bash
# Initialize Terraform
cd terraform
terraform init

# Plan changes
terraform plan -var-file=environments/dev/terraform.tfvars

# Apply changes
terraform apply -var-file=environments/dev/terraform.tfvars
```

### CI/CD Pipeline
The system uses Cloud Build for automated deployment:
- Triggers on pushes to main branch
- Runs tests
- Builds production assets
- Deploys to Cloud Storage
- Invalidates CDN cache

## Backend Integration (Future)

### API Integration
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const presentationService = {
  async processScript(script: string, options = {}) {
    const response = await api.post('/process-presentation', {
      script,
      options
    });
    return response.data;
  },

  async generateBackground(slideSpec: SlideSpec) {
    const response = await api.post('/generate-background', {
      slide_spec: slideSpec
    });
    return response.data;
  }
};
```

### Authentication (Planned)
```typescript
// src/services/auth.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  // Configuration will be provided
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const authService = {
  async signIn() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    return token;
  }
};
```

### Real-time Updates (Planned)
```typescript
// src/services/realtime.ts
import { presentationSocket } from '@/services/websocket';

export const realtimeService = {
  subscribeToUpdates(presentationId: string, callback: (update: any) => void) {
    presentationSocket.on(`presentation:${presentationId}`, callback);
    return () => presentationSocket.off(`presentation:${presentationId}`, callback);
  }
};
```

## Components

### Presentation Editor
```vue
<!-- src/components/presentation/Editor.vue -->
<template>
  <div class="presentation-editor">
    <ScriptEditor v-model="script" />
    <AgentFeedback :feedback="agentFeedback" />
    <ReviewPanel 
      :slides="slides"
      @approve="handleApprove"
      @revise="handleRevise"
    />
  </div>
</template>
```

### Script Editor
```vue
<!-- src/components/presentation/ScriptEditor.vue -->
<template>
  <div class="script-editor">
    <textarea
      v-model="script"
      class="form-control"
      placeholder="🎞️ Your Presentation Title..."
    ></textarea>
  </div>
</template>
```

## State Management

### Presentation Store
```typescript
// src/stores/presentation.ts
import { defineStore } from 'pinia';
import { presentationService } from '@/services/api';

export const usePresentationStore = defineStore('presentation', {
  state: () => ({
    script: '',
    processingStatus: null,
    slides: [],
    feedback: null
  }),

  actions: {
    async processScript(script: string) {
      this.processingStatus = 'processing';
      try {
        const result = await presentationService.processScript(script);
        this.slides = result.slides;
        this.feedback = result.feedback;
        this.processingStatus = 'completed';
      } catch (error) {
        this.processingStatus = 'error';
        throw error;
      }
    }
  }
});
```

## Error Handling

### API Error Handling
```typescript
// src/utils/error-handler.ts
import { AxiosError } from 'axios';
import { notify } from '@/utils/notifications';

export function handleApiError(error: AxiosError) {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        notify.error('Please sign in to continue');
        // Redirect to login
        break;
      case 429:
        notify.error('Too many requests. Please try again later');
        break;
      default:
        notify.error('An error occurred. Please try again');
    }
  }
}
```

## Future Enhancements

1. **Authentication & Authorization**
   - Implement Firebase Authentication
   - Add user profiles
   - Implement role-based access
   - Add team collaboration features

2. **Real-time Features**
   - Add WebSocket support
   - Implement live preview
   - Add collaborative editing
   - Real-time agent feedback

3. **Enhanced UI/UX**
   - Add drag-and-drop interface
   - Implement slide preview
   - Add presentation templates
   - Enhance mobile responsiveness

4. **Performance Optimization**
   - Implement lazy loading
   - Add service worker
   - Optimize asset loading
   - Enhance caching strategy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

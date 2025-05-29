import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'http://localhost:3000',
        // Add timeout
        actionTimeout: 10000,
    },
    // Add global timeout
    timeout: 30000,
    // Add retry
    retries: 1
});

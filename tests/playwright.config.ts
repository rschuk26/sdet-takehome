import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './',
    reporter: [
        ['list'],
        ['html', { open: 'always', outputFolder: 'playwright-report' }]
    ],
    outputDir: 'test-results/',
    use: {
        baseURL: 'http://localhost:3000',
        actionTimeout: 10000,
    },
    // Add global timeout
    timeout: 30000,
    // Add retry
    retries: 1
});
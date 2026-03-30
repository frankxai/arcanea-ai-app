import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3011';
const shouldSkipWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER === '1';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 960 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...(shouldSkipWebServer
    ? {}
    : {
        webServer: {
          command: 'pnpm exec tsx e2e/serve-playwright.ts',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          env: {
            PORT: '3011',
            HOSTNAME: '127.0.0.1',
            NEXT_TELEMETRY_DISABLED: '1',
            NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: 'playwright-anon-key',
            SUPABASE_URL: 'http://127.0.0.1:54321',
            SUPABASE_ANON_KEY: 'playwright-anon-key',
            PLAYWRIGHT_DEV_SERVER: process.env.PLAYWRIGHT_DEV_SERVER ?? '0',
          },
        },
      }),
  expect: {
    timeout: 5000,
  },
});

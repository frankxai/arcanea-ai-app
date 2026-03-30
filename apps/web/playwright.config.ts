import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'example-anon-key';
const shouldRunWebServer = !process.env.PLAYWRIGHT_NO_WEB_SERVER;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  ...(shouldRunWebServer
    ? {
        webServer: {
          command:
            process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ??
            (process.platform === 'win32' ? 'cmd.exe /c pnpm run dev' : 'pnpm run dev'),
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 300000,
          env: {
            NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
            NEXT_TELEMETRY_DISABLED: '1',
          },
        },
      }
    : {}),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

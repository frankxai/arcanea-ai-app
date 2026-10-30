import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "firstlight-02.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/firstlight-02-results.json" }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001",
    colorScheme: "dark",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: process.env.FIRSTLIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.FIRSTLIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: ["--single-process", "--no-zygote", "--disable-gpu"],
        }
      : {},
  },
  projects: [375, 768, 1440].map((width) => ({
    name: `width-${width}`,
    use: { viewport: { width, height: 1000 } },
  })),
});

import { loadSpec } from './index.js';

const spec = loadSpec();
const errors: string[] = [];

// Every task's primary + fallback must reference a declared model.
for (const [taskId, task] of Object.entries(spec.tasks)) {
  const all = [...task.primary, ...(task.fallback ?? [])];
  for (const modelId of all) {
    if (!spec.models[modelId]) {
      errors.push(`task[${taskId}] references undeclared model: ${modelId}`);
    }
  }
}

// Every surface taskOverride must reference a declared task.
for (const [surfaceId, surface] of Object.entries(spec.surfaces)) {
  for (const [taskId, models] of Object.entries(surface.taskOverrides ?? {})) {
    if (!spec.tasks[taskId]) {
      errors.push(`surface[${surfaceId}].taskOverrides references undeclared task: ${taskId}`);
    }
    for (const modelId of models) {
      if (!spec.models[modelId]) {
        errors.push(`surface[${surfaceId}].taskOverrides[${taskId}] references undeclared model: ${modelId}`);
      }
    }
  }
}

// Every delegation.useFor must reference a declared task OR be a meta-task.
const metaTasks = new Set(['multi-session-coordination']);
for (const [id, d] of Object.entries(spec.delegation)) {
  for (const taskId of d.useFor) {
    if (!spec.tasks[taskId] && !metaTasks.has(taskId)) {
      errors.push(`delegation[${id}].useFor references undeclared task: ${taskId}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Router spec validation failed:');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`Router spec valid: ${Object.keys(spec.models).length} models, ${Object.keys(spec.tasks).length} tasks, ${Object.keys(spec.surfaces).length} surfaces, ${Object.keys(spec.delegation).length} delegations.`);

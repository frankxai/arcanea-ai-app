/** Bind visual capture to GitHub's Vercel deployment record, never a PR comment. */
const shaPattern = /^[a-f0-9]{40}$/;
const previewHost =
  /^arcanea-ai(?:-app)?-[a-z0-9]{9}-starlight-intelligence\.vercel\.app$/;

function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

function repositoryUrl({ owner, repo }) {
  requireThat(
    owner === "frankxai" && repo === "arcanea-ai-app",
    "Unexpected visual QA repository",
  );
  return `https://api.github.com/repos/${owner}/${repo}`;
}

function latestRecord(records) {
  requireThat(
    Array.isArray(records) && records.length < 100,
    "Deployment history missing or exceeds bounded page",
  );
  for (const record of records) {
    requireThat(
      Number.isSafeInteger(record?.id) &&
        record.id > 0 &&
        Number.isFinite(Date.parse(record.created_at)),
      "Invalid deployment history record",
    );
  }
  return [...records].sort(
    (a, b) =>
      Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id,
  )[0];
}

export function previewUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Invalid preview URL");
  }
  requireThat(
    url.protocol === "https:" &&
      previewHost.test(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash,
    "Expected immutable Arcanea preview URL",
  );
  return url.origin;
}

export function validateDeployment(deployment, status, expected) {
  const repository = repositoryUrl(expected);
  requireThat(shaPattern.test(expected.sha), "Expected full source SHA");
  requireThat(
    Number.isSafeInteger(deployment?.id) &&
      deployment.id > 0 &&
      deployment.repository_url === repository &&
      deployment.sha === expected.sha &&
      deployment.environment === "Preview" &&
      deployment.production_environment === false &&
      deployment.creator?.login === "vercel[bot]",
    "Deployment does not match repository, source and preview environment",
  );
  requireThat(
    status?.state === "success" &&
      status.repository_url === repository &&
      status.deployment_url === `${repository}/deployments/${deployment.id}` &&
      status.environment === "Preview" &&
      status.creator?.login === "vercel[bot]",
    "Latest preview deployment status is not trusted success",
  );
  return {
    schema_version: 1,
    repository: `${expected.owner}/${expected.repo}`,
    source_sha: expected.sha,
    deployment_id: deployment.id,
    environment: deployment.environment,
    url: previewUrl(status.environment_url),
    authority: "GitHub deployment and latest Vercel bot status",
  };
}

export async function assertCurrentSource(github, expected) {
  repositoryUrl(expected);
  requireThat(shaPattern.test(expected.sha), "Expected full source SHA");
  if (!expected.prNumber) return;
  const { data: pr } = await github.rest.pulls.get({
    owner: expected.owner,
    repo: expected.repo,
    pull_number: expected.prNumber,
  });
  requireThat(
    pr.state === "open" &&
      pr.draft === false &&
      pr.head?.sha === expected.sha &&
      pr.head.repo?.full_name === `${expected.owner}/${expected.repo}`,
    "Pull request source changed or is not eligible for visual QA",
  );
}

export async function resolvePreview(
  github,
  expected,
  {
    requestedUrl = "",
    attempts = 20,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  } = {},
) {
  repositoryUrl(expected);
  requireThat(shaPattern.test(expected.sha), "Expected full source SHA");
  requireThat(
    Number.isInteger(attempts) && attempts > 0 && attempts <= 20,
    "Invalid preview wait budget",
  );
  const requested = requestedUrl.trim() ? previewUrl(requestedUrl.trim()) : "";
  for (let attempt = 0; attempt < attempts; attempt++) {
    await assertCurrentSource(github, expected);
    const { data: deployments } = await github.rest.repos.listDeployments({
      owner: expected.owner,
      repo: expected.repo,
      sha: expected.sha,
      environment: "Preview",
      per_page: 100,
    });
    // Choose by server creation time/id, without relying on response order.
    // A full page is ambiguous: do not choose from truncated history.
    const deployment = latestRecord(deployments);
    if (deployment) {
      requireThat(
        deployment.sha === expected.sha &&
          deployment.repository_url === repositoryUrl(expected) &&
          deployment.environment === "Preview",
        "Deployment lookup returned a different source",
      );
      const { data: statuses } = await github.rest.repos.listDeploymentStatuses(
        {
          owner: expected.owner,
          repo: expected.repo,
          deployment_id: deployment.id,
          per_page: 100,
        },
      );
      const status = latestRecord(statuses);
      if (
        status &&
        !["pending", "in_progress", "queued"].includes(status.state)
      ) {
        const binding = validateDeployment(deployment, status, expected);
        requireThat(
          !requested || requested === binding.url,
          "Requested preview differs from verified deployment",
        );
        await assertCurrentSource(github, expected);
        return binding;
      }
    }
    if (attempt + 1 < attempts) await sleep(15000);
  }
  throw new Error(
    "No successful preview deployment for this exact source within wait budget",
  );
}

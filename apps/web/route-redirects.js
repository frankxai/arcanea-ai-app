// Permanent redirects for routes removed in the 2026-09 route collapse
// (ARCANEA_STRATEGY_2026 §6). Consumed by next.config.js and scripts/check-internal-links.mjs.
const moved = (source, destination) => ({ source, destination, permanent: true });

const routeRedirects = [
  moved('/activity', '/dashboard'),
  moved('/arcanea-os', '/ecosystem'),
  moved('/arcanea-vault', '/starlight-intelligence'),
  moved('/chat-demo', '/chat'),
  moved('/cockpit', '/'),
  moved('/command/:path*', '/dashboard'),
  moved('/community-hub', '/community'),
  moved('/council/:path*', '/luminors'),
  moved('/creator-economy', '/'),
  moved('/design-lab', '/imagine'),
  moved('/intelligence', '/constellation'),
  moved('/luminor-standard', '/luminors'),
  moved('/mascot', '/about'),
  moved('/ops/:path*', '/developers'),
  moved('/orchestrator', '/developers'),
  moved('/products', '/ecosystem'),
  moved('/thefutureisforeveryone', '/imagination-charter'),
  moved('/v1', '/'),
  moved('/v3/:path*', '/'),
  moved('/v4', '/'),
  moved('/vault/:path*', '/starlight-intelligence'),
];

module.exports = { routeRedirects };

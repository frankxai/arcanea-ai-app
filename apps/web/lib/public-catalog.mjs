/** Read only the explicit public projection supplied by the owning page. */
export function createPublicCatalogTools(prefix, entries) {
  const records = JSON.parse(JSON.stringify(entries));
  const byId = new Map(records.map(record => [record.id, record]));
  if (byId.size !== records.length) throw new Error('Public catalog identifiers must be unique.');
  const object = input => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an object.');
    return input;
  };
  return [
    {
      name: prefix + '_search_public_catalog',
      title: 'Search the public catalog',
      description: 'Search the public catalog available on this page. Returns source-linked records only; does not grant access, qualify a learner or modify work.',
      inputSchema: { type: 'object', properties: {
        query: { type: 'string', minLength: 1, maxLength: 200 },
        limit: { type: 'integer', minimum: 1, maximum: 20, default: 8 },
      }, required: ['query'], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute(input) {
        const { query, limit = 8 } = object(input);
        if (Object.keys(input).some(key => !['query', 'limit'].includes(key)) ||
            typeof query !== 'string' || !query.trim() || query.length > 200 ||
            !Number.isInteger(limit) || limit < 1 || limit > 20) throw new Error('Use a query of 1–200 characters and a limit of 1–20.');
        const terms = query.toLowerCase().trim().split(/\s+/);
        const matches = records.filter(record => terms.every(term =>
          (record.title + ' ' + record.summary).toLowerCase().includes(term)));
        return { results: JSON.parse(JSON.stringify(matches.slice(0, limit))), total: matches.length };
      },
    },
    {
      name: prefix + '_get_public_record',
      title: 'Read a public catalog record',
      description: 'Read one public catalog record by the exact id returned by search. Includes its source page. No private records or account state are returned.',
      inputSchema: { type: 'object', properties: { id: { type: 'string', minLength: 1, maxLength: 200 } }, required: ['id'], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute(input) {
        const { id } = object(input);
        if (Object.keys(input).length !== 1 || typeof id !== 'string' || !id || id.length > 200) throw new Error('Use one catalog id.');
        const record = byId.get(id);
        return record ? { found: true, record: JSON.parse(JSON.stringify(record)) } : { found: false };
      },
    },
  ];
}


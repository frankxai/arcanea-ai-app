import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Arcanea Records: Label Sync Script
 * 
 * This script bridges the Supabase 'agent_production_ledger' with the 
 * 'arcanea-records' GitHub repository. It ensures every "Signed Record" 
 * is committed to the immutable git ledger.
 */

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncLabel() {
  console.log('--- Arcanea Records: Syncing Label to GitHub ---');

  // 1. Fetch "Signed" records that haven't been committed yet
  const { data: records, error } = await supabase
    .from('agent_production_ledger')
    .select('*')
    .eq('status', 'signed')
    .eq('metadata->committed', false);

  if (error) {
    console.error('Error fetching records:', error);
    return;
  }

  if (!records || records.length === 0) {
    console.log('No new signed records found.');
    return;
  }

  console.log(`Found ${records.length} new signed records.`);

  // 2. Process each record
  for (const record of records) {
    const recordDir = path.join(process.cwd(), 'records', record.track_id || record.id);
    
    if (!fs.existsSync(recordDir)) {
      fs.mkdirSync(recordDir, { recursive: true });
    }

    // Write manifest
    const manifestPath = path.join(recordDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(record, null, 2));

    console.log(`Manifest created for: ${record.project_name}`);

    // 3. Git Push to arcanea-records remote
    try {
      execSync('git add records/');
      execSync(`git commit -m "feat(label): sign record - ${record.project_name}"`);
      // Note: In production, we would push to the specific 'records' remote
      // execSync('git push records main'); 
      console.log(`[Success] Record ${record.project_name} committed to ledger.`);

      // 4. Mark as committed in Supabase
      await supabase
        .from('agent_production_ledger')
        .update({ metadata: { ...record.metadata, committed: true } })
        .eq('id', record.id);

    } catch (gitError) {
      console.error('Git sync failed:', gitError);
    }
  }
}

syncLabel();

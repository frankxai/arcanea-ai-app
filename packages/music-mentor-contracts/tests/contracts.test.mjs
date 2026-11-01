import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAssessment } from '../src/index.ts';
const base = () => ({ attemptId:'a1', exerciseVersion:'1', status:'completed', measurements:[{kind:'onset',observed:50,expected:0,unit:'milliseconds',confidence:0.95,startMs:0,endMs:100,algorithmVersion:'fixture-v1'}], feedback:[{id:'f1',message:'Practice slower',evidenceIndices:[0],priority:'focus'}], processingTraceId:'trace-1', evaluatedAt:'2026-11-01T00:00:00Z' });
test('valid evidence-linked assessment',()=>assert.deepEqual(validateAssessment(base()),[]));
test('reject ungrounded feedback',()=>{const x=base();x.feedback[0].evidenceIndices=[5];assert.ok(validateAssessment(x).includes('ungrounded feedback'));});
test('reject invalid confidence and time spans',()=>{const x=base();x.measurements[0].confidence=1.5;x.measurements[0].endMs=-1;assert.ok(validateAssessment(x).includes('invalid confidence'));assert.ok(validateAssessment(x).includes('invalid time span'));});
test('reject missing evidence',()=>{const x=base();x.measurements=[];assert.ok(validateAssessment(x).includes('completed without evidence'));});
test('reject missing trace',()=>{const x=base();x.processingTraceId='';assert.ok(validateAssessment(x).includes('missing identity or trace'));});

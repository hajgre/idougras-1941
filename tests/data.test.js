import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS, DIFFICULTIES } from '../data.js';

test('5 küldetés, küldetésenként pontosan 6 kérdés',()=>{
  assert.equal(MISSIONS.length,5);
  for(const m of MISSIONS)assert.equal(m.questions.length,6);
});
test('minden küldetésben öt feladattípus',()=>{
  const types=['choice','truefalse','order','match','multi'];
  for(const m of MISSIONS){
    const present=new Set(m.questions.map(q=>q.type));
    for(const type of types)assert.ok(present.has(type),`${m.id}: ${type}`);
  }
});
test('egyedi kérdésazonosítók, érvényes válaszkulcsok, hibátlan felépítés',()=>{
  const ids=[];
  for(const m of MISSIONS)for(const q of m.questions){
    ids.push(q.id);
    assert.ok(q.question && q.hint && q.explanation);
    if(q.type==='choice'){
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options.map(o=>o[0])).size,4);
      assert.ok(q.options.some(o=>o[0]===q.answer));
    }
    if(q.type==='multi'){
      assert.equal(q.options.length,4);
      assert.equal(q.answer.length,3);
      for(const id of q.answer)assert.ok(q.options.some(o=>o[0]===id));
    }
    if(q.type==='truefalse')assert.equal(typeof q.answer,'boolean');
    if(q.type==='order'){
      assert.equal(q.items.length,3);
      assert.deepEqual(q.items.map(x=>x[0]).sort(),[...q.answer].sort());
    }
    if(q.type==='match'){
      assert.equal(q.pairs.length,3);
      assert.equal(new Set(q.pairs.map(x=>x[1])).size,3);
    }
  }
  assert.equal(new Set(ids).size,ids.length);
  assert.equal(ids.length,30);
  assert.equal(DIFFICULTIES.length,3);
});

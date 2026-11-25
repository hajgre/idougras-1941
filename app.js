import { MISSIONS, DIFFICULTIES, GAME_VERSION } from './data.js';

// A két tanulási út külön helyi mentést használ; a v1.0.0 kulcsa változatlan.
const STORAGE_KEY = 'idougras-1941-v1-progress';
const NEW_STORAGE_KEY = 'idougras-1941-v1-new-progress';
const BEST_KEY = 'idougras-1941-v1-best';
const BEST_NEW_KEY = 'idougras-1941-v1-new-best';
const ACTIVE_MODE_KEY = 'idougras-1941-v1-active-mode';
const OLD_MISSIONS_COUNT = 5;
const QUESTIONS_PER_MISSION = 6;
const firstMissionIndex = mode => mode === 'new' ? OLD_MISSIONS_COUNT : 0;
const visibleMissions = () => state.mode === 'new' ? MISSIONS.slice(OLD_MISSIONS_COUNT) : MISSIONS;
const maxQuestions = () => visibleMissions().length * QUESTIONS_PER_MISSION;
const maxScore = () => maxQuestions() * 10;
const storageFor = mode => mode === 'new' ? NEW_STORAGE_KEY : STORAGE_KEY;
const bestKeyFor = mode => mode === 'new' ? BEST_NEW_KEY : BEST_KEY;
const app = document.getElementById('app');
const live = document.getElementById('announcer');
const supportsSpeech = typeof window.speechSynthesis !== 'undefined';
const F = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function freshState(mode='full') {
  return {version: GAME_VERSION, mode, screen:'welcome', difficulty:'felfedezo', largeText:false,
    stageIndex:firstMissionIndex(mode), questionIndex:0, completed:[], score:0, stagePoints:0, stageScores:{},
    answeredCount:0, lastAward:0, attempts:0, hintUsed:false,
    runSeed: Math.floor(Math.random() * 1000000000) };
}
function initialMode(){try{return localStorage.getItem(ACTIVE_MODE_KEY)==='new'?'new':'full';}catch{return 'full'}}
function loadState(mode='full'){
  try {
    const raw = localStorage.getItem(storageFor(mode));
    if(!raw) return freshState(mode);
    const s = JSON.parse(raw);
    const isLegacy = mode==='full' && s.version==='1.0.0';
    const modeMatches = (s.mode ?? 'full')===mode;
    const cap=(mode==='new'?MISSIONS.length-OLD_MISSIONS_COUNT:MISSIONS.length)*QUESTIONS_PER_MISSION;
    if((s.version!==GAME_VERSION&&!isLegacy) || !modeMatches || !DIFFICULTIES.some(d=>d.id===s.difficulty) ||
       !['welcome','intro','question','correct','stagecomplete','complete'].includes(s.screen) ||
       !Number.isInteger(s.stageIndex) || s.stageIndex<firstMissionIndex(mode) || s.stageIndex>=MISSIONS.length ||
       !Number.isInteger(s.questionIndex) || s.questionIndex<0 || s.questionIndex>QUESTIONS_PER_MISSION ||
       !Array.isArray(s.completed) || !Number.isFinite(s.score) || s.score<0 || s.score>cap*10 ||
       !Number.isFinite(s.stagePoints) || s.stagePoints<0 || !Number.isInteger(s.answeredCount) ||
       s.answeredCount<0 || s.answeredCount>cap || !Number.isInteger(s.runSeed)) return freshState(mode);
    const next={...freshState(mode),...s,mode,version:GAME_VERSION,
      completed:s.completed.filter(i=>Number.isInteger(i)&&i>=firstMissionIndex(mode)&&i<MISSIONS.length),
      stageScores:s.stageScores && typeof s.stageScores === 'object' ? s.stageScores : {}};
    // A korábban befejezett 1941-es időutazás nem vész el: az új állomásnál folytatható.
    if(isLegacy && next.screen==='complete' && next.completed.includes(OLD_MISSIONS_COUNT-1)){
      next.screen='intro'; next.stageIndex=OLD_MISSIONS_COUNT;next.questionIndex=0;
      next.stagePoints=0;next.attempts=0;next.hintUsed=false;next.lastAward=0;
    }
    return next;
  } catch {return freshState(mode)}
}
let state = loadState(initialMode());
let answer = null;
let answerFor = '';
let wrongMessage = '';
let visibleHint = false;
let modal = null;
let lastFocus = null;
function save(){try{localStorage.setItem(storageFor(state.mode),JSON.stringify(state));localStorage.setItem(ACTIVE_MODE_KEY,state.mode);}catch{/* A játék mentés nélkül is fut. */}}
function bestScore(){try{return Number(localStorage.getItem(bestKeyFor(state.mode)))||0;}catch{return 0;}}
function updateBest(){try{if(state.score>bestScore())localStorage.setItem(bestKeyFor(state.mode),String(state.score));}catch{/* optional */}}
function mission(){return MISSIONS[state.stageIndex]}
function currentQuestion(){return mission().questions[state.questionIndex]}
function hash(str){let n=2166136261;for(let i=0;i<str.length;i++){n^=str.charCodeAt(i);n=Math.imul(n,16777619)}return n>>>0}
function shuffled(arr,key){const a=[...arr];let x=hash(String(state.runSeed)+':'+key)||1;for(let i=a.length-1;i>0;i--){x^=x<<13;x^=x>>>17;x^=x<<5;const j=(x>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function choices(q){
  if(q.type==='truefalse')return [['true','Igaz'],['false','Hamis']];
  const original=q.options.map(([id,text])=>({id,text}));
  if(q.type==='choice'){
    if(state.difficulty==='felfedezo') {
      const incorrect=original.filter(o=>o.id!==q.answer);
      return shuffled([original.find(o=>o.id===q.answer),shuffled(incorrect,q.id+'distract')[0]],q.id+'choice').map(o=>[o.id,o.text]);
    }
    if(state.difficulty==='nyomozo')return shuffled([original.find(o=>o.id===q.answer),...shuffled(original.filter(o=>o.id!==q.answer),q.id+'distract').slice(0,2)],q.id+'choice').map(o=>[o.id,o.text]);
  }
  if(q.type==='multi' && state.difficulty==='felfedezo'){
    const correct=original.filter(o=>q.answer.includes(o.id)).slice(0,2);
    const incorrect=original.filter(o=>!q.answer.includes(o.id)).slice(0,1);
    return shuffled([...correct,...incorrect],q.id+'multi').map(o=>[o.id,o.text]);
  }
  return shuffled(original,q.id+'choice').map(o=>[o.id,o.text]);
}
function expectedMulti(q){return choices(q).map(([id])=>id).filter(id=>q.answer.includes(id))}
function prepareAnswer(){
  if(state.screen!=='question')return;
  const q=currentQuestion();if(!q)return;
  const key=`${q.id}:${state.difficulty}:${state.runSeed}`;
  if(answerFor===key)return;
  answerFor=key;wrongMessage='';visibleHint=false;
  if(q.type==='order'){
    let ids=shuffled(q.items.map(([id])=>id),q.id+'order');
    if(ids.join(',')===q.answer.join(','))ids=[...ids.slice(1),ids[0]];
    answer={order:ids};
  }else if(q.type==='match') {
    answer={matches:{}};
    if(state.difficulty==='felfedezo')answer.matches['0']='0';
  }else if(q.type==='multi')answer={selected:[]};
  else answer={selected:null};
}
function countDone(){return state.completed.length * QUESTIONS_PER_MISSION + (state.screen==='stagecomplete' ? 0 : Math.min(state.questionIndex,QUESTIONS_PER_MISSION))}
function progress(){return Math.min(100,Math.round(state.answeredCount/maxQuestions()*100))}
function announce(message){live.textContent='';requestAnimationFrame(()=>live.textContent=message)}
function clockArt(){return `<div class="hero-art" aria-hidden="true"><div class="clock-orbit"><div class="clock-dot"></div><div class="clock-needle"></div><div class="clock-needle small"></div><div class="clock-center"></div><div class="clock-year">1943</div></div><div class="floating-pill top">◉ IDŐKAPU AKTÍV</div><div class="floating-pill bottom">✧ 1939 → 1943</div></div>`}
function header(){return `<header class="header"><div class="brand"><div class="brand-mark" aria-hidden="true"><svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="13" stroke="#83e7df" stroke-width="2.4"/><path d="M18 9v10l6 4" stroke="#ffd27a" stroke-width="2.8" stroke-linecap="round"/><circle cx="18" cy="18" r="2" fill="white"/></svg></div><div><div class="brand-title">IDŐUGRÁS</div><div class="brand-sub">1939–1943</div></div></div><div class="header-actions"><button class="btn btn-ghost btn-small" type="button" data-action="switch-picker" title="Váltás a teljes játék és az új anyag között">📚 Anyagválasztás</button><button class="btn btn-ghost btn-small" type="button" data-action="font" aria-pressed="${state.largeText}">${state.largeText?'A− Kisebb':'A+ Nagyobb'}</button><button class="btn btn-ghost btn-small" type="button" data-action="reset-confirm" title="Teljes játék újrakezdése">↺ Újrakezdés</button></div></header>`}
function hero(){
  const done=state.screen==='complete';
  if(state.screen!=='welcome' && !done){
    const m=mission();
    return `<section class="hero hero-compact"><div class="hero-copy"><div class="kicker">✦ IDŐUGRÁS · 1939–1943</div><h1><em>${F(m.year)}</em> · ${F(m.name)}</h1><p class="hero-description">${F(m.place)} · ${state.stageIndex-firstMissionIndex(state.mode)+1}. / ${visibleMissions().length} időkapu</p></div><div class="compact-clock" aria-hidden="true">◷</div></section>`;
  }
  return `<section class="hero"><div class="hero-copy"><div class="kicker">✦ Interaktív történelemkaland · TANAK 8.</div><h1>${done?'Küldetés <em>teljesítve!</em>':'Utazás az <em>időben.</em>'}</h1><p class="hero-description">${state.mode==='new'?'1942–1943: négy új időkapu, könnyű ismerkedő feladatokkal.':'1939-től 1943-ig: a háború kezdete, a fordulatok és a civil lakosság története.'} ${visibleMissions().length} időkapu és ${maxQuestions()} változatos történelmi feladat.</p><div class="hero-actions"><span class="capsule">🕰️ ${visibleMissions().length} időkapu</span><span class="capsule gold">✨ ${maxScore()} elérhető pont</span></div></div>${clockArt()}</section>`;
}
function statusStrip(){return `<div class="status-strip" aria-label="A játék állapota"><div class="stat"><span class="stat-ico" aria-hidden="true">⚡</span><div><strong>${state.score} / ${maxScore()}</strong><small>Időenergia-pont</small></div></div><div class="stat"><span class="stat-ico" aria-hidden="true">🪪</span><div><strong>${state.completed.length} / ${visibleMissions().length}</strong><small>Megszerzett pecsét</small></div></div><div class="stat"><span class="stat-ico" aria-hidden="true">🧠</span><div><strong>${state.answeredCount} / ${maxQuestions()}</strong><small>Megoldott feladat</small></div></div></div>`}
function stageNav(){return `<section class="panel side-card" aria-label="Időkapuk"><h2 class="side-title">Időkapuk</h2><div class="stage-list">${visibleMissions().map((m,offset)=>{
 const i=offset+firstMissionIndex(state.mode);const done=state.completed.includes(i);const active=state.stageIndex===i && !done;const unlocked=done||i===state.stageIndex;
 return `<button type="button" class="stage-btn ${done?'done':''} ${active?'active':''}" data-action="stage" data-index="${i}" ${!unlocked?'disabled':''} ${active?'aria-current="step"':''} aria-label="${F(m.year)}: ${F(m.name)} – ${done?'teljesítve':unlocked?'aktuális':'lezárva'}"><span class="stage-num">${done?'✓':i+1}</span><span><span class="stage-label">${F(m.name)}</span><span class="stage-year">${F(m.year)}</span></span></button>`}).join('')}</div><p class="side-note" style="margin-top:14px">${state.screen==='welcome'?'Válaszd ki a nehézséget, és indulhat az időutazás!':'A zöld jelölés az elvégzett korszakot mutatja. A pecsétekre kattintva újraolvashatod az összefoglalót.'}</p></section>`}
function sideProgress(){return `<section class="panel side-card"><h2 class="side-title">Küldetésnapló</h2><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><strong>${state.answeredCount} / ${maxQuestions()} feladat</strong><span class="capsule">${progress()}%</span></div><div class="progress-rail" role="progressbar" aria-label="Teljes játék előrehaladása" aria-valuemin="0" aria-valuemax="${maxQuestions()}" aria-valuenow="${state.answeredCount}"><div class="progress-fill" style="width:${progress()}%"></div></div><p class="progress-mini">Legjobb pontszám ezen az eszközön: <strong>${bestScore()}</strong></p><div class="hr"></div><h3 style="font-size:.9rem;margin-bottom:7px">🧩 Segítség a tanuláshoz</h3><p class="side-note">A feladatok többször próbálhatók. A segítségkérés megengedett. Nincs időkorlát vagy végleges kiesés.</p><div style="margin-top:13px"><a class="btn btn-ghost btn-small btn-full" href="./tanari-utmutato.html">📘 Tanári útmutató</a></div></section>`}
function footer(){return `<footer class="page-footer"><span>IDŐUGRÁS · ${GAME_VERSION} · Böngészőben, regisztráció nélkül</span><span class="dot" aria-hidden="true">✦</span><a href="https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates" target="_blank" rel="noopener noreferrer">Történelmi források</a><span class="dot" aria-hidden="true">✦</span><a href="./tanari-utmutato.html">Tanári útmutató</a></footer>`}
function difficultyPicker(){return `<div class="eyebrow" style="margin-top:18px">Válassz segítségi szintet</div><div class="setting-block" role="group" aria-label="Nehézségi szint">${DIFFICULTIES.map(d=>`<button type="button" class="difficulty-option ${state.difficulty===d.id?'chosen':''}" data-action="difficulty" data-id="${d.id}" aria-pressed="${state.difficulty===d.id}"><strong>${d.icon} ${F(d.name)}</strong><small>${F(d.description)}</small></button>`).join('')}</div>`}
function welcome(){return `<div class="section-head"><span class="capsule">🎮 A kaland kezdete</span><span class="eyebrow">TANAK 8. · II. világháború</span></div><h2>Üdv az időgép fedélzetén!</h2><p class="mission-copy">${visibleMissions().length} történelmi korszak vár rád. Minden megoldott feladat időenergiát ad az időgépnek. Ismerd fel az eseményeket, rakd őket sorrendbe, és juttasd vissza a történelmi idővonalat a helyére!</p><div class="briefing-card"><span class="briefing-icon" aria-hidden="true">✨</span><p><strong>Hogyan működik?</strong> A feladatokra többször válaszolhatsz. Minden teljesített korszakért pecsét jár. A haladásodat ez a böngésző helyben menti.</p></div><div class="mode-tip"><strong>Mit szeretnél gyakorolni?</strong><div class="hero-actions"><button type="button" class="btn ${state.mode==='full'?'btn-primary':'btn-secondary'}" data-action="switch-mode" data-id="full">🕰️ Teljes időutazás (1939–1943)</button><button type="button" class="btn ${state.mode==='new'?'btn-primary':'btn-secondary'}" data-action="switch-mode" data-id="new">🌱 Csak az új anyag (1942–1943)</button></div><p class="small-note">A két változat haladása külön mentődik ezen az eszközön.</p></div>${difficultyPicker()}<div class="hero-actions"><button class="btn btn-primary" type="button" data-action="begin">🚀 ${state.answeredCount>0?'Küldetés folytatása':'Induljon az időutazás!'}</button></div>`}
function introduction(){const m=mission();return `<div class="section-head"><span class="capsule">🕰️ ${F(m.year)} · ${F(m.subtitle)}</span><span class="eyebrow">${state.stageIndex-firstMissionIndex(state.mode)+1}. / ${visibleMissions().length} időkapu</span></div><div class="mission-heading"><div class="mission-emoji" aria-hidden="true">${m.icon}</div><div><h2>${F(m.name)}</h2><div class="small-note">📍 ${F(m.place)}</div></div></div><div class="briefing-card"><span class="briefing-icon" aria-hidden="true">📖</span><p>${F(m.briefing)}</p></div><div class="mission-fact">📌 Jegyezd meg: ${F(m.fact)}</div><p class="info-banner">${m.isNew?'Az új anyaghoz tartozó':'A már tanult anyagra épülő'} <strong>6 könnyen követhető feladat</strong> következik. Előbb olvasd el az ismertetőt; kérhetsz segítséget, és újra próbálkozhatsz.</p>${difficultyPicker()}<div class="mission-actions" style="margin-top:22px"><button class="btn btn-primary" type="button" data-action="start-stage">⚡ ${state.questionIndex>0?'Folytatom a feladatokat':'Kezdjük a küldetést!'}</button>${supportsSpeech?`<button class="btn btn-secondary" type="button" data-action="read-briefing">🔊 Felolvasás</button>`:''}</div>`}
function optionButtons(q){const opts=choices(q);const multi=q.type==='multi';return `<div class="answer-grid" role="group" aria-label="${multi?'Jelöld az összes megfelelő választ':'Válassz egy választ'}">${opts.map(([id,label],idx)=>{
 const checked=multi?answer.selected.includes(id):answer.selected===id;
 return `<button type="button" class="answer-option ${checked?'selected':''}" data-action="select" data-id="${F(id)}" aria-pressed="${checked}"><span class="answer-letter" aria-hidden="true">${multi?(checked?'✓':'□'):String.fromCharCode(65+idx)}</span><span>${F(label)}</span>${checked?'<span class="check-mark" aria-hidden="true">✓</span>':''}</button>`}).join('')}</div>${multi?'<p class="form-help">Több jó válasz is lehet. Jelöld meg az összes helyesnek gondolt állítást!</p>':''}`}
function orderControl(q){const items=new Map(q.items);return `<div class="order-list" role="list" aria-label="Események sorrendje">${answer.order.map((id,idx)=>`<div class="order-item" role="listitem"><span class="position-chip">${idx+1}.</span><div class="order-label">${F(items.get(id))}</div><div class="order-buttons"><button type="button" class="tiny-move" data-action="move" data-index="${idx}" data-dir="-1" ${idx===0?'disabled':''} aria-label="${idx+1}. esemény feljebb">↑</button><button type="button" class="tiny-move" data-action="move" data-index="${idx}" data-dir="1" ${idx===answer.order.length-1?'disabled':''} aria-label="${idx+1}. esemény lejjebb">↓</button></div></div>`).join('')}</div><p class="form-help">A nyilakkal állíthatod sorrendbe a kártyákat.</p>`}
function matchControl(q){const rights=shuffled(q.pairs.map(([,r],i)=>({i,r})),q.id+'match');const firstEasy=state.difficulty==='felfedezo';return `<div class="pair-list">${q.pairs.map(([left,right],i)=>`<div class="pair-row"><span class="pair-left">${F(left)}</span>${firstEasy&&i===0?`<div class="pair-fixed">✓ ${F(right)}</div>`:`<select class="pair-select" data-match="${i}" aria-label="${F(left)} párjának kiválasztása"><option value="">Válassz párt…</option>${rights.map(o=>`<option value="${o.i}" ${answer.matches[i]===String(o.i)?'selected':''}>${F(o.r)}</option>`).join('')}</select>`}</div>`).join('')}</div><p class="form-help">Minden jobb oldali választ csak egyszer használj fel!</p>`}
function taskBody(q){if(q.type==='order')return orderControl(q);if(q.type==='match')return matchControl(q);return optionButtons(q)}
function question(){prepareAnswer();const m=mission(),q=currentQuestion();if(!q)return `<p>Ez a feladat nem található.</p>`;
 const showAutoHint=state.difficulty==='felfedezo';const hint=visibleHint||showAutoHint;
 return `<div class="question-meta"><span class="capsule">${m.icon} ${F(m.year)} · ${F(m.name)}</span><span class="eyebrow">${state.questionIndex+1}. / ${QUESTIONS_PER_MISSION} feladat</span></div><div class="step-indicator" aria-label="${state.questionIndex} feladat teljesítve a hatból">${Array.from({length:QUESTIONS_PER_MISSION},(_,i)=>`<span class="step-dot ${i<state.questionIndex?'done':i===state.questionIndex?'current':''}"></span>`).join('')}</div><div style="margin-top:23px"><span class="eyebrow">${F(q.tag)}</span><h2 class="question-headline">${F(q.question)}</h2></div>${taskBody(q)}${hint?`<div class="task-hint" id="hint-panel"><span aria-hidden="true">💡</span><span><strong>Segítség:</strong> ${F(q.hint)}</span></div>`:''}${wrongMessage?`<div class="feedback" role="status">🔎 ${F(wrongMessage)} <p>Próbáld újra! A feladatot biztosan meg tudod oldani.</p></div>`:''}<div class="help-row"><button type="button" class="btn btn-primary" data-action="check">✓ Ellenőrzöm</button>${!hint?'<button type="button" class="btn btn-secondary" data-action="hint">💡 Kérek segítséget</button>':''}${supportsSpeech?'<button type="button" class="btn btn-ghost" data-action="read-question">🔊 Felolvasás</button>':''}</div>`}
function correct(){const q=currentQuestion();const isLast=state.questionIndex===QUESTIONS_PER_MISSION-1;return `<div class="done-view"><div class="done-orb" aria-hidden="true">${state.lastAward===10?'🌟':'✨'}</div><span class="capsule">Helyes megoldás!</span><h2 style="margin-top:13px">Szépen haladsz az időben!</h2><div class="done-points">+${state.lastAward} időenergia</div><div class="briefing-card" style="text-align:left"><span class="briefing-icon" aria-hidden="true">📚</span><p>${F(q.explanation)}</p></div><p>${isLast?'Az időkapu minden feladata teljesítve.':'Újabb lépéssel haladtál előre az időutazásban.'}</p><button class="btn btn-primary" type="button" data-action="next-question">${isLast?'✨ Korszak lezárása':'→ Következő feladat'}</button></div>`}
function stageComplete(){const m=mission();const last=state.stageIndex===MISSIONS.length-1;const pts=state.stageScores[m.id]??state.stagePoints;return `<div class="done-view"><div class="done-orb" aria-hidden="true">🏅</div><span class="capsule gold">${state.stageIndex+1}. időkapu teljesítve</span><h2 style="margin-top:14px">${F(m.name)}</h2><p>Megszerezted a <strong>${F(m.year)}-es történelmi pecsétet</strong>! A korszak eseményei helyükre kerültek az idővonalon.</p><div class="done-points">${pts} / 60 pont</div><div class="mission-fact" style="text-align:left">📌 ${F(m.fact)}</div><div class="done-buttons"><button class="btn btn-primary" type="button" data-action="next-stage">${last?'🌟 Az idővonal helyreállítása':'🚀 Ugrás a következő korszakba'}</button></div></div>`}
function medals(){return `<div class="medal-grid">${visibleMissions().map((m,offset)=>{const i=offset+firstMissionIndex(state.mode);return `<div class="medal ${!state.completed.includes(i)?'locked':''}"><span class="medal-emoji" aria-hidden="true">${state.completed.includes(i)?m.icon:'🔒'}</span><small>${F(m.year)}</small><small>${F(m.name)}</small></div>`}).join('')}</div>`}
function historyTimeline(){return `<div class="timeline-full">${visibleMissions().map(m=>`<div class="timeline-row"><span class="timeline-year">${F(m.year)}</span><div><strong>${F(m.name)}</strong><span>${F(m.fact)}</span></div></div>`).join('')}</div>`}
function completion(){return `<div class="print-only"><h1>IDŐUGRÁS – 1939–1943</h1><p>Teljesített történelmi időutazás · TANAK 8. osztály</p></div><div class="done-view"><div class="done-orb" aria-hidden="true">🕰️</div><span class="capsule">A teljes idővonal helyreállt</span><h2 style="margin-top:15px">Gratulálunk, időutazó!</h2><p>Végigjártad a kiválasztott történelmi állomásokat. ${visibleMissions().length} időkapu feladatait teljesítetted.</p><div class="done-points">${state.score} / ${maxScore()} pont</div></div>${medals()}<h3>📖 Az időutazásod történelmi állomásai</h3>${historyTimeline()}<p class="small-note">Az összefoglaló a tanult eseményekre épül. A történelmi események valódi emberek életét érintették; a pontok kizárólag a tanulási feladatok megoldását jelzik.</p><div class="hero-actions no-print"><button class="btn btn-primary" type="button" data-action="print">🖨️ Emléklap nyomtatása</button><button class="btn btn-secondary" type="button" data-action="reset-confirm">↻ Új időutazás</button></div>`}
function body(){switch(state.screen){case 'welcome':return welcome();case 'intro':return introduction();case 'question':return question();case 'correct':return correct();case 'stagecomplete':return stageComplete();case 'complete':return completion();default:return welcome()}}
function renderModal(){if(!modal)return '';
 if(modal.type==='switch')return `<div class="modal-backdrop" data-backdrop="true"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">Melyik időutazást folytatod?</h2><p>Mindkét tanulási út külön mentődik.</p><div class="modal-actions"><button type="button" class="btn btn-primary" data-action="switch-mode" data-id="full">Teljes időutazás</button><button type="button" class="btn btn-secondary" data-action="switch-mode" data-id="new">Csak új anyag</button><button type="button" class="btn btn-ghost" data-action="close-modal">Mégsem</button></div></div></div>`;
 if(modal.type==='reset')return `<div class="modal-backdrop" data-backdrop="true"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">Újrakezdjük az időutazást?</h2><p>A jelenlegi küldetés és a megszerzett pontok elölről indulnak. Az eddigi legjobb pontszám megmarad ezen az eszközön.</p><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Mégsem</button><button class="btn btn-danger" type="button" data-action="reset-confirmed">Igen, újrakezdem</button></div></div></div>`;
 if(modal.type==='recap'){
 const m=MISSIONS[modal.index];return `<div class="modal-backdrop" data-backdrop="true"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="capsule">${m.year} · Teljesített korszak</span><h2 id="modal-title" style="margin-top:12px">${F(m.icon)} ${F(m.name)}</h2><p>${F(m.briefing)}</p><div class="mission-fact">📌 ${F(m.fact)}</div><p>Pontszám: <strong>${state.stageScores[m.id]??0} / 60</strong></p><div class="modal-actions"><button class="btn btn-primary" type="button" data-action="close-modal">Vissza a játékhoz</button></div></div></div>`;
 }return '';
}
function render(){
 if(state.screen==='question')prepareAnswer();
 document.body.classList.toggle('text-xl-mode',state.largeText);
 app.innerHTML=`<div class="app-shell">${header()}<main id="main">${hero()}${statusStrip()}<div class="layout"><section class="panel main-panel" aria-label="Játékfelület">${body()}</section><aside class="sidebar">${stageNav()}${sideProgress()}</aside></div></main>${footer()}</div>${renderModal()}`;
 if(modal){const focusTarget=app.querySelector('[role=dialog] button');focusTarget?.focus()}
}
function resetAnswer(){answerFor='';answer=null;wrongMessage='';visibleHint=false}
function tryCheck(){const q=currentQuestion();if(!q)return;let right=false;
 if(q.type==='choice'||q.type==='truefalse'){
   if(answer.selected===null){wrongMessage='Először jelölj meg egy választ!';render();return}
   right=answer.selected===(q.type==='truefalse'?String(q.answer):q.answer);
 }else if(q.type==='multi'){
   if(!answer.selected.length){wrongMessage='Jelölj meg legalább egy állítást!';render();return}
   const expected=expectedMulti(q);right=answer.selected.length===expected.length&&expected.every(id=>answer.selected.includes(id));
 }else if(q.type==='order')right=answer.order.every((id,i)=>id===q.answer[i]);
 else if(q.type==='match'){
   if(q.pairs.some((_,i)=>!Object.prototype.hasOwnProperty.call(answer.matches,String(i)))){wrongMessage='Még nem választottál párt minden sorhoz!';render();return}
   const values=Object.values(answer.matches);if(new Set(values).size!==values.length){wrongMessage='Egy választ csak egyszer használhatsz!';render();return}
   right=q.pairs.every((_,i)=>answer.matches[i]===String(i));
 }
 if(right){
   const earned=state.attempts===0&&!state.hintUsed?10:state.attempts>=2?5:7;
   state.score+=earned;state.stagePoints+=earned;state.answeredCount++;state.lastAward=earned;state.screen='correct';
   updateBest();save();render();announce('Helyes válasz. '+earned+' időenergia-pontot szereztél.');
 }else{
   state.attempts++;wrongMessage='Ez még nem egészen jó. Nézd meg újra a lehetőségeket!';
   save();render();announce('Ez még nem jó, próbáld újra.');
 }
}
function nextQuestion(){if(state.screen!=='correct')return;
 if(state.questionIndex<QUESTIONS_PER_MISSION-1){state.questionIndex++;state.attempts=0;state.hintUsed=false;state.screen='question';resetAnswer();}
 else {const m=mission();if(!state.completed.includes(state.stageIndex))state.completed.push(state.stageIndex);
   state.stageScores[m.id]=state.stagePoints;state.screen='stagecomplete';state.questionIndex=QUESTIONS_PER_MISSION;
 }
 save();render();announce(state.screen==='stagecomplete'?'Korszak teljesítve.':'Következő feladat.');app.querySelector('.main-panel')?.scrollIntoView({block:'start',behavior:'auto'});
}
function nextStage(){if(state.screen!=='stagecomplete')return;
 if(state.stageIndex>=MISSIONS.length-1){state.screen='complete';updateBest();}
 else {state.stageIndex++;state.questionIndex=0;state.stagePoints=0;state.attempts=0;state.hintUsed=false;state.screen='intro';}
 resetAnswer();save();render();announce('Új történelmi korszak.');window.scrollTo({top:0,behavior:'instant'});
}
function say(text){if(!supportsSpeech)return;window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(text);utter.lang='hu-HU';utter.rate=0.87;window.speechSynthesis.speak(utter)}
function onAction(e){const button=e.target.closest('button[data-action]');if(!button)return;
 const action=button.dataset.action,id=button.dataset.id;
 if(action==='switch-mode'){if(id!=='full'&&id!=='new')return;if(id!==state.mode){save();state=loadState(id);resetAnswer();}modal=null;save();render();return}
 if(action==='switch-picker'){lastFocus=button;modal={type:'switch'};render();return}
 if(action==='close-modal'){modal=null;render();lastFocus?.focus({preventScroll:true});return}
 if(action==='reset-confirm'){lastFocus=button;modal={type:'reset'};render();return}
 if(action==='reset-confirmed'){const difficulty=state.difficulty,largeText=state.largeText;state=freshState(state.mode);state.difficulty=difficulty;state.largeText=largeText;modal=null;resetAnswer();save();render();announce('Új játék indult.');return}
 if(modal)return;
 if(action==='font'){state.largeText=!state.largeText;save();render();return}
 if(action==='difficulty'){state.difficulty=id;state.hintUsed=false;state.attempts=0;resetAnswer();save();render();return}
 if(action==='begin'){state.screen='intro';save();render();announce('Az időkapu megnyílt.');return}
 if(action==='start-stage'){state.screen='question';resetAnswer();save();render();announce('Elkezdődött az első feladat.');return}
 if(action==='stage'){const i=Number(button.dataset.index);if(state.completed.includes(i)){lastFocus=button;modal={type:'recap',index:i};render();return}
 if(i===state.stageIndex){if(state.screen==='welcome')state.screen='intro';save();render();return}return}
 if(action==='read-briefing'){say(mission().briefing);return}
 if(action==='read-question'&&state.screen==='question'){
   const q=currentQuestion();const extra=q.type==='order'?q.items.map(x=>x[1]).join('. '):q.type==='match'?q.pairs.map(x=>x[0]).join('. '):choices(q).map(x=>x[1]).join('. ');
   say(q.question+' '+extra);return}
 if(state.screen==='question'){
   if(action==='select'){const q=currentQuestion();if(q.type==='multi'){
     if(answer.selected.includes(id))answer.selected=answer.selected.filter(x=>x!==id);else answer.selected.push(id);
   }else answer.selected=id;wrongMessage='';render();app.querySelector(`[data-action="select"][data-id="${id}"]`)?.focus({preventScroll:true});return}
   if(action==='move'){const i=Number(button.dataset.index),j=i+Number(button.dataset.dir);if(j<0||j>=answer.order.length)return;
     [answer.order[i],answer.order[j]]=[answer.order[j],answer.order[i]];wrongMessage='';render();app.querySelector(`[data-action="move"][data-index="${j}"][data-dir="${-Number(button.dataset.dir)}"]`)?.focus({preventScroll:true});return}
   if(action==='hint'){visibleHint=true;state.hintUsed=true;save();render();return}
   if(action==='check'){tryCheck();return}
 }
 if(action==='next-question'){nextQuestion();return}
 if(action==='next-stage'){nextStage();return}
 if(action==='print'){window.print();return}
}
app.addEventListener('click',onAction);
app.addEventListener('change',e=>{
 const el=e.target.closest('select[data-match]');if(!el||state.screen!=='question')return;
 if(el.value==='')delete answer.matches[el.dataset.match];else answer.matches[el.dataset.match]=el.value;
 wrongMessage='';const index=el.dataset.match;render();app.querySelector(`select[data-match="${index}"]`)?.focus({preventScroll:true});
});
app.addEventListener('click',e=>{if(e.target.matches('[data-backdrop]')){modal=null;render();lastFocus?.focus();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal){modal=null;render();lastFocus?.focus();}});
render();

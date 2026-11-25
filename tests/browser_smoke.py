"""Offline DOM smoke test: python tests/browser_smoke.py. No real network allowed."""
import json
import os
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
MISSIONS=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import { MISSIONS } from './data.js'; process.stdout.write(JSON.stringify(MISSIONS));"],cwd=ROOT,text=True))
HTML=ROOT.joinpath('index.html').read_text()
for tag in ['<script type="module" src="./app.js"></script>',
            '<link rel="stylesheet" href="./styles.css">',
            '<link rel="icon" href="./favicon.svg" type="image/svg+xml">']:
    HTML=HTML.replace(tag,'')
CSS=ROOT.joinpath('styles.css').read_text()
DATA={'MISSIONS':MISSIONS,'DIFFICULTIES':[
    {'id':'felfedezo','name':'Felfedező','icon':'🌱','description':'Rövidebb válaszlista, induló segítség, három egyszerű párosítás.'},
    {'id':'nyomozo','name':'Nyomozó','icon':'🔎','description':'Önálló megoldás, kérhető segítség, teljes válaszlista.'},
    {'id':'tortenesz','name':'Történész','icon':'⭐','description':'Minden válaszlehetőség, segítség külön kérésre.'}],
      'GAME_VERSION':'1.1.0'}
JS=ROOT.joinpath('app.js').read_text().replace(
    "import { MISSIONS, DIFFICULTIES, GAME_VERSION } from './data.js';",
    'const { MISSIONS, DIFFICULTIES, GAME_VERSION } = '+json.dumps(DATA,ensure_ascii=False)+';')

SHIM="""(initial)=>{const memory={...initial};Object.defineProperty(window,'localStorage',{
 configurable:true,value:{getItem:(k)=>memory[k]??null,setItem:(k,v)=>{memory[k]=String(v)},
 removeItem:(k)=>{delete memory[k]},clear:()=>{for(const k in memory)delete memory[k]},dump:()=>memory}
});}"""

def mount_game(page,stored=None):
    page.set_content(HTML)
    page.add_style_tag(content=CSS)
    page.evaluate(SHIM,stored or {})
    page.add_script_tag(content=JS)

def solve_question(page,q):
    ty=q['type']
    if ty=='choice': page.locator(f'[data-action="select"][data-id="{q["answer"]}"]').click()
    elif ty=='truefalse': page.locator(f'[data-action="select"][data-id="{str(q["answer"]).lower()}"]').click()
    elif ty=='multi':
        for id in q['answer']:
            if page.locator(f'[data-action="select"][data-id="{id}"]').count():
                page.locator(f'[data-action="select"][data-id="{id}"]').click()
    elif ty=='match':
        for i, _ in enumerate(q['pairs']):
            el=page.locator(f'select[data-match="{i}"]')
            if el.count(): el.select_option(str(i))
    elif ty=='order':
        correct=[next(label for id,label in q['items'] if id==key) for key in q['answer']]
        for i,wanted in enumerate(correct):
            for _ in range(5):
                labels=page.locator('.order-label').all_text_contents()
                if labels[i]==wanted: break
                j=labels.index(wanted)
                page.locator(f'[data-action="move"][data-index="{j}"][data-dir="-1"]').click()
            else: raise AssertionError('order failed to reorder')
    else: raise ValueError(ty)
    page.locator('[data-action="check"]').click()
    assert page.get_by_text('Helyes megoldás!').is_visible(), f'Question {q["id"]} failed: {page.locator(".feedback").all_text_contents()}'
    page.locator('[data-action="next-question"]').click()

with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  errors=[]
  for level in ['felfedezo','nyomozo','tortenesz']:
    if os.environ.get('SKIP_FULL')=='1': continue
    if os.environ.get('TEST_LEVEL') and os.environ['TEST_LEVEL']!=level: continue
    page=browser.new_page(viewport={'width':1280,'height':850})
    page.on('pageerror',lambda err:errors.append(str(err)))
    mount_game(page)
    assert page.get_by_text('Üdv az időgép fedélzetén!').is_visible()
    page.locator(f'[data-action="difficulty"][data-id="{level}"]').click()
    page.locator('[data-action="begin"]').click()
    for s,m in enumerate(MISSIONS):
      assert page.get_by_text('Kezdjük a küldetést!').is_visible()
      page.locator('[data-action="start-stage"]').click()
      for idx,q in enumerate(m['questions']):
        assert page.get_by_text(q['question']).is_visible(),(level,q['id'])
        if s==0 and idx==0:
          stored=page.evaluate('localStorage.dump()')
          resumed=browser.new_page(viewport={'width':1280,'height':850})
          resumed.on('pageerror',lambda err:errors.append(str(err)))
          mount_game(resumed,stored)
          assert resumed.get_by_text(q['question']).is_visible(),'recovery failed'
          page.close()
          page=resumed
        solve_question(page,q)
      assert page.get_by_text('időkapu teljesítve',exact=False).first.is_visible()
      page.locator('[data-action="next-stage"]').click()
    assert page.get_by_text('Gratulálunk, időutazó!').is_visible()
    assert page.get_by_text('540 / 540 pont').count()>0, f'Score {level}'
    page.evaluate('window.print=()=>{window.__printWasCalled=true}')
    page.locator('[data-action="print"]').click()
    assert page.evaluate('window.__printWasCalled===true'), 'print did not activate'
    page.screenshot(path=f'/tmp/idougras-finish-{level}.png',full_page=True)
    page.close()
    print(f'PASS all 54 tasks, scoring and simulated save/reload: {level}')

  # Negative answers, support and partial-credit behavior
  errors_page=browser.new_page(viewport={'width':1024,'height':768})
  errors_page.on('pageerror',lambda err:errors.append(str(err)))
  mount_game(errors_page)
  errors_page.locator('[data-action="difficulty"][data-id="tortenesz"]').click()
  errors_page.locator('[data-action="begin"]').click()
  errors_page.locator('[data-action="start-stage"]').click()
  first=MISSIONS[0]['questions'][0]
  wrong=next(id for id,text in first['options'] if id!=first['answer'])
  errors_page.locator(f'[data-action="select"][data-id="{wrong}"]').click()
  errors_page.locator('[data-action="check"]').click()
  assert errors_page.get_by_text('Ez még nem egészen jó.',exact=False).count()>0
  errors_page.locator(f'[data-action="select"][data-id="{first["answer"]}"]').click()
  errors_page.locator('[data-action="check"]').click()
  assert errors_page.get_by_text('+7 időenergia').is_visible()
  errors_page.locator('[data-action="next-question"]').click()
  errors_page.locator('[data-action="hint"]').click()
  assert errors_page.get_by_text('Segítség:',exact=False).count()>0
  q2=MISSIONS[0]['questions'][1]
  errors_page.locator(f'[data-action="select"][data-id="{q2["answer"]}"]').click()
  errors_page.locator('[data-action="check"]').click()
  assert errors_page.get_by_text('+7 időenergia').is_visible()
  assert errors_page.get_by_text('14 / 540').count()>0
  errors_page.close()
  print('PASS incorrect answer, retry, optional hint and partial points')


  # Korábbi v1.0.0 mentés: az öt állomás teljesítve -> az új hatodik időkapunál folytatódik.
  legacy={"idougras-1941-v1-progress":json.dumps({
    'version':'1.0.0','screen':'complete','difficulty':'felfedezo','largeText':False,
    'stageIndex':4,'questionIndex':6,'completed':[0,1,2,3,4],
    'score':300,'stagePoints':60,'stageScores':{'poland':60,'france':60,'britain':60,'east':60,'pearl':60},
    'answeredCount':30,'lastAward':10,'attempts':0,'hintUsed':False,'runSeed':7
  },ensure_ascii=False)}
  old=browser.new_page(viewport={'width':900,'height':750})
  mount_game(old,legacy)
  assert old.get_by_text('Midway – fordulat a tengeren').first.is_visible()
  assert old.locator('.stat').first.inner_text().find('300 / 540')!=-1
  old.locator('[data-action="start-stage"]').click()
  assert old.get_by_text(MISSIONS[5]['questions'][0]['question']).is_visible()
  old.close()
  print('PASS v1.0.0 completed save migrates into the sixth stage')

  # Csak új anyag mód: 4 küldetés, 24 feladat, és a régi mentés érintetlen marad.
  new=browser.new_page(viewport={'width':900,'height':750})
  mount_game(new)
  new.locator('[data-action="switch-mode"][data-id="new"]').click()
  assert new.get_by_text('24 feladat').count()>0
  new.locator('[data-action="begin"]').click()
  assert new.get_by_text('Midway – fordulat a tengeren').first.is_visible()
  new.locator('[data-action="start-stage"]').click()
  solve_question(new,MISSIONS[5]['questions'][0])
  mem=new.evaluate('localStorage.dump()')
  assert 'idougras-1941-v1-new-progress' in mem
  assert json.loads(mem['idougras-1941-v1-progress'])['answeredCount']==0
  assert json.loads(mem['idougras-1941-v1-new-progress'])['answeredCount']==1
  new.reload() if False else None
  resumed=browser.new_page(viewport={'width':900,'height':750})
  mount_game(resumed,mem)
  assert resumed.get_by_text(MISSIONS[5]['questions'][1]['question']).is_visible()
  resumed.locator('[data-action="switch-picker"]').click()
  resumed.locator('[data-action="switch-mode"][data-id="full"]').click()
  assert resumed.get_by_text('Üdv az időgép fedélzetén!').is_visible()
  assert 'idougras-1941-v1-new-progress' in resumed.evaluate('localStorage.dump()')
  resumed.close()
  new.close()
  print('PASS standalone new-content mode, saving, resuming, mode switching')

  # Teljes csak-új-anyag útvonal: mind a 24 könnyű feladat és a külön zárólap.
  quick=browser.new_page(viewport={'width':950,'height':800})
  quick.on('pageerror',lambda err:errors.append(str(err)))
  mount_game(quick)
  quick.locator('[data-action="switch-mode"][data-id="new"]').click()
  quick.locator('[data-action="begin"]').click()
  for stage in MISSIONS[5:]:
    quick.locator('[data-action="start-stage"]').click()
    for q in stage['questions']: solve_question(quick,q)
    quick.locator('[data-action="next-stage"]').click()
  assert quick.get_by_text('Gratulálunk, időutazó!').is_visible()
  assert quick.get_by_text('240 / 240 pont').count()>0
  assert quick.locator('.medal').count()==4
  quick.close()
  print('PASS complete 24-question new-material track, points, medals, final screen')

  mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
  mobile.on('pageerror',lambda err:errors.append(str(err)))
  mount_game(mobile)
  mobile.screenshot(path='/tmp/idougras-mobile.png',full_page=True)
  mobile.locator('[data-action="switch-mode"][data-id="new"]').click()
  assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),'mobile new mode horizontal overflow'
  mobile.locator('[data-action="switch-mode"][data-id="full"]').click()
  mobile.locator('[data-action="font"]').click()
  mobile.locator('[data-action="begin"]').click()
  mobile.locator('[data-action="start-stage"]').click()
  mobile.screenshot(path='/tmp/idougras-question-mobile.png',full_page=True)
  assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),'mobile horizontal overflow'
  mobile.locator('[data-action="reset-confirm"]').click()
  assert mobile.get_by_text('Újrakezdjük az időutazást?').is_visible()
  mobile.locator('[data-action="close-modal"]').click()
  mobile.locator('[data-action="reset-confirm"]').click()
  mobile.locator('[data-action="reset-confirmed"]').click()
  assert mobile.get_by_text('Üdv az időgép fedélzetén!').is_visible()
  mobile.set_content(ROOT.joinpath('tanari-utmutato.html').read_text())
  mobile.add_style_tag(content=CSS)
  assert mobile.get_by_text('Tanári segédlet').count()>0
  assert not errors,errors
  mobile.close()
  browser.close()
  print('PASS mobile, text enlargement, reset, teacher guide, no uncaught JS errors')

/* IDŐUGRÁS – Küldetés: 1941 | Ellenőrzött, szerkeszthető feladatbank.
 * A történelmi szövegek forrásait lásd a README.md-ben.
 * Nincs személyes adat, szerver, analitika vagy külső függőség.
 */
export const GAME_VERSION = '1.0.0';
export const MISSIONS = [
  {
    id: 'poland', year: '1939', name: 'A háború kezdete', place: 'Lengyelország', icon: '🧭',
    subtitle: 'Az időgép első állomása', tone: 'mint',
    briefing: '1939. szeptember 1-jén Németország megtámadta Lengyelországot. Szeptember 3-án Nagy-Britannia és Franciaország hadat üzent Németországnak. Szeptember 17-én a Szovjetunió keletről megtámadta Lengyelországot.',
    fact: '1939. szeptember 1. – a második világháború kezdete Európában.',
    questions: [
      { id:'p1',type:'choice',tag:'Történelmi döntés',question:'Melyik eseménnyel kezdődött a második világháború Európában?',options:[['a','Németország megtámadta Lengyelországot.'],['b','Japán megtámadta Pearl Harbort.'],['c','Németország megtámadta a Szovjetuniót.'],['d','Németország megtámadta Franciaországot.']],answer:'a',hint:'Gondolj az 1939. szeptember 1-jei eseményre!',explanation:'1939. szeptember 1-jén a német hadsereg megtámadta Lengyelországot. Ezt tekintjük a világháború kezdetének Európában.' },
      { id:'p2',type:'choice',tag:'Országok és döntések',question:'Mi történt 1939. szeptember 3-án?',options:[['a','Nagy-Britannia és Franciaország hadat üzent Németországnak.'],['b','Az Egyesült Államok hadat üzent Japánnak.'],['c','Németország fegyverszünetet kötött Franciaországgal.'],['d','Németország megtámadta a Szovjetuniót.']],answer:'a',hint:'Két nyugat-európai ország reagált Lengyelország megtámadására.',explanation:'Nagy-Britannia és Franciaország 1939. szeptember 3-án hadat üzent Németországnak.'},
      { id:'p3',type:'truefalse',tag:'Igaz vagy hamis?',question:'1939. szeptember 17-én a Szovjetunió keletről megtámadta Lengyelországot.',answer:true,hint:'Lengyelországot 1939 szeptemberében két irányból érte támadás.',explanation:'Igaz. A Szovjetunió 1939. szeptember 17-én keletről vonult be Lengyelországba.'},
      { id:'p4',type:'order',tag:'Időrendi nyomozás',question:'Tedd időrendbe az 1939. szeptemberi eseményeket! A legkorábbi kerüljön felülre.',items:[['a','Szept. 1. – Német támadás Lengyelország ellen'],['b','Szept. 3. – Brit és francia hadüzenet'],['c','Szept. 17. – Szovjet támadás keletről']],answer:['a','b','c'],hint:'Figyeld a dátumokat: 1., 3. és 17.!',explanation:'A helyes sorrend: szeptember 1., 3., 17. Az események gyors egymásutánban történtek.'},
      { id:'p5',type:'match',tag:'Párosító labor',question:'Párosítsd az országokat és az 1939-es eseményeket!',pairs:[['Németország','Szept. 1-jén megtámadta Lengyelországot'],['Nagy-Britannia és Franciaország','Szept. 3-án hadat üzent Németországnak'],['Szovjetunió','Szept. 17-én keletről támadott']],hint:'Keresd a dátumokat a küldetés elején olvasott összefoglalóban!',explanation:'A három országcsoport különböző szerepet játszott Lengyelország 1939. szeptemberi eseményeiben.'},
      { id:'p6',type:'multi',tag:'Több jó válasz',question:'Mely állítások igazak 1939-re? Jelöld meg az összes helyes választ!',options:[['a','Elkezdődött a világháború Európában.'],['b','Németország megtámadta Lengyelországot.'],['c','Az Egyesült Államok Pearl Harbor után belépett a háborúba.'],['d','Nagy-Britannia hadat üzent Németországnak.']],answer:['a','b','d'],hint:'A Pearl Harbor elleni támadás később történt, nem 1939-ben.',explanation:'1939-ben kezdődött a háború Európában, Németország megtámadta Lengyelországot, Nagy-Britannia pedig hadat üzent Németországnak.'}
    ]
  },
  {
    id:'france', year:'1940', name:'A villámháború', place:'Nyugat-Európa', icon:'🗺️',
    subtitle:'A második időkapu', tone:'amber',
    briefing:'1940 tavaszán Németország megtámadta Dániát és Norvégiát, majd több nyugat-európai országot. Gyors, összehangolt támadásokat alkalmazott, ezt gyakran villámháborúnak nevezik. A német csapatok 1940 júniusában bevonultak Párizsba, Franciaország pedig fegyverszünetet kötött.',
    fact:'1940. június – Párizs német megszállása és francia fegyverszünet.',
    questions:[
      {id:'f1',type:'choice',tag:'Történelmi kifejezés',question:'Mit jelent a „villámháború” ebben a történelmi összefüggésben?',options:[['a','Gyors, összehangolt katonai támadásokat'],['b','Csak éjszaka folytatott harcot'],['c','Évekig tartó, változatlan állásharcot'],['d','Csak tengeri hadműveleteket']],answer:'a',hint:'A szó gyorsaságra utal.',explanation:'A villámháború gyors, összehangolt támadásokra épülő hadviselési módszer volt.'},
      {id:'f2',type:'choice',tag:'Városkereső',question:'Melyik fővárosba vonultak be a német csapatok 1940 júniusában?',options:[['a','Párizs'],['b','London'],['c','Moszkva'],['d','Washington']],answer:'a',hint:'A keresett város Franciaország fővárosa.',explanation:'1940 júniusában a német csapatok bevonultak Párizsba, Franciaország fővárosába.'},
      {id:'f3',type:'truefalse',tag:'Igaz vagy hamis?',question:'Franciaország 1940 júniusában fegyverszünetet kötött Németországgal.',answer:true,hint:'Gondolj arra, mi történt Párizs elfoglalása után!',explanation:'Igaz. A francia–német fegyverszünetet 1940. június 22-én írták alá.'},
      {id:'f4',type:'order',tag:'Időrendi nyomozás',question:'Rendezd időrendbe az 1940-es nyugat-európai eseményeket!',items:[['a','Április – Dánia és Norvégia megtámadása'],['b','Május – Német támadás Nyugat-Európában'],['c','Június – Párizs elfoglalása']],answer:['a','b','c'],hint:'A hónapok sorrendje: április, május, június.',explanation:'1940-ben áprilisban északon, májusban nyugaton kezdődtek nagy német támadások; júniusban elfoglalták Párizst.'},
      {id:'f5',type:'match',tag:'Fogalommagyarázó',question:'Keresd meg a történelmi fogalmak jelentését!',pairs:[['Villámháború','Gyors, összehangolt támadás'],['Fegyverszünet','Megállapodás a harcok beszüntetéséről'],['Megszállás','Idegen hadsereg ellenőrzése alá kerülés']],hint:'Először azokat a párokat keresd, amelyeknek ismered a jelentését!',explanation:'A villámháború hadviselési módszer, a fegyverszünet megállapodás, a megszállás pedig katonai ellenőrzést jelent.'},
      {id:'f6',type:'multi',tag:'Országkereső',question:'Mely országokat támadta meg Németország 1940 tavaszán? Jelöld az összes helyes választ!',options:[['a','Dánia'],['b','Norvégia'],['c','Franciaország'],['d','Svájc']],answer:['a','b','c'],hint:'A támadások Észak- és Nyugat-Európára is kiterjedtek.',explanation:'Németország 1940 tavaszán megtámadta Dániát, Norvégiát és Franciaországot; Svájcot nem szállta meg.'}
    ]
  },
  {
    id:'britain',year:'1940',name:'A csata az égbolton',place:'Nagy-Britannia',icon:'📡',
    subtitle:'A harmadik időkapu',tone:'sky',
    briefing:'1940-ben a német Luftwaffe légi támadásokat indított Nagy-Britannia ellen. A brit királyi légierő, a RAF ellenállt. A radar segített a közeledő repülőgépek észlelésében. A tervezett német partraszállás végül nem valósult meg.',
    fact:'1940 – angliai csata: Nagy-Britannia ellenáll a német légitámadásoknak.',
    questions:[
      {id:'b1',type:'choice',tag:'Kik küzdöttek?',question:'Melyik két légierő harcolt egymás ellen az angliai csatában?',options:[['a','A brit RAF és a német Luftwaffe'],['b','Az amerikai és a japán légierő'],['c','A francia és az olasz légierő'],['d','A szovjet és a japán légierő']],answer:'a',hint:'A csata Nagy-Britannia és Németország között zajlott.',explanation:'Az angliai csatában a brit RAF és a német Luftwaffe repülőgépei küzdöttek.'},
      {id:'b2',type:'choice',tag:'Technikatörténet',question:'Miben segített a radar a brit védelemnek?',options:[['a','A közeledő repülőgépek észlelésében'],['b','A tankok gyorsabb mozgatásában'],['c','A tengeralattjárók gyártásában'],['d','A katonák élelmezésében']],answer:'a',hint:'A radar segítségével a távolabbi mozgás is észlelhető.',explanation:'A radar segített időben észlelni a közeledő repülőgépeket, így a brit védelem felkészülhetett.'},
      {id:'b3',type:'truefalse',tag:'Igaz vagy hamis?',question:'Az angliai csata után a német hadsereg sikeresen megszállta Nagy-Britanniát.',answer:false,hint:'A tervezett német partraszállás megvalósult, vagy elmaradt?',explanation:'Hamis. Nagy-Britanniát a német hadsereg nem szállta meg; a tervezett partraszállás elmaradt.'},
      {id:'b4',type:'order',tag:'Ok és következmény',question:'Tedd logikus sorrendbe az angliai csata eseményeit!',items:[['a','Német légi támadások Nagy-Britannia ellen'],['b','A brit légierő és légvédelem ellenáll'],['c','A tervezett német partraszállás elmarad']],answer:['a','b','c'],hint:'Mi indította el a küzdelmet, és mi lett a következménye?',explanation:'A német légitámadásokat brit ellenállás követte. A német partraszállási terv nem valósult meg.'},
      {id:'b5',type:'match',tag:'A rádiószoba',question:'Párosítsd a kifejezéseket a jelentésükkel!',pairs:[['RAF','Brit királyi légierő'],['Luftwaffe','Német légierő'],['Radar','Közeledő repülőgépek észlelését segítő eszköz']],hint:'Két kifejezés légierőt, egy pedig műszaki eszközt jelent.',explanation:'RAF = brit légierő, Luftwaffe = német légierő, radar = észlelést segítő technika.'},
      {id:'b6',type:'multi',tag:'Három történelmi tény',question:'Mely állítások igazak az angliai csatára?',options:[['a','1940-ben zajlott.'],['b','A légierőknek fontos szerepük volt.'],['c','Nagy-Britanniát a németek nem szállták meg.'],['d','Pearl Harbor megtámadása után zajlott.']],answer:['a','b','c'],hint:'Az angliai csata Pearl Harbor előtt történt.',explanation:'Az angliai csata 1940-ben zajlott; jelentős légiháború volt, és a német megszállás elmaradt.'}
    ]
  },
  {
    id:'east',year:'1941',name:'A keleti hadjárat',place:'Kelet-Európa',icon:'🧩',
    subtitle:'A negyedik időkapu',tone:'rose',
    briefing:'1941 áprilisában Németország megtámadta Jugoszláviát, és Magyarország is részt vett a Jugoszlávia elleni hadműveletben. Június 22-én Németország megtámadta a Szovjetuniót (Barbarossa-hadművelet). Magyarország 1941. június 27-én lépett hadba a Szovjetunió ellen.',
    fact:'1941. június 22. – a Szovjetunió elleni német támadás kezdete.',
    questions:[
      {id:'e1',type:'choice',tag:'Térképes emlékezet',question:'Melyik országot támadta meg Németország 1941. június 22-én?',options:[['a','A Szovjetuniót'],['b','Nagy-Britanniát'],['c','Lengyelországot'],['d','Az Egyesült Államokat']],answer:'a',hint:'A támadás a keleti front hatalmas kiterjedéséhez vezetett.',explanation:'1941. június 22-én Németország és szövetségesei megtámadták a Szovjetuniót.'},
      {id:'e2',type:'choice',tag:'Magyarország története',question:'Melyik ország elleni háborúba lépett Magyarország 1941. június 27-én?',options:[['a','A Szovjetunió ellen'],['b','Az Egyesült Államok ellen'],['c','Franciaország ellen'],['d','Nagy-Britannia ellen']],answer:'a',hint:'Ugyanaz az ország, amely ellen Németország június 22-én támadást indított.',explanation:'Magyarország 1941. június 27-én lépett hadba a Szovjetunió ellen.'},
      {id:'e3',type:'truefalse',tag:'Igaz vagy hamis?',question:'1941 tavaszán Jugoszlávia ellen is indult német hadjárat.',answer:true,hint:'A balkáni hadjárat a Szovjetunió elleni támadás előtt zajlott.',explanation:'Igaz. Németország 1941 áprilisában támadta meg Jugoszláviát.'},
      {id:'e4',type:'order',tag:'Három fontos dátum',question:'Állítsd időrendbe az 1941-es eseményeket!',items:[['a','Április – Jugoszlávia elleni hadjárat'],['b','Június 22. – Német támadás a Szovjetunió ellen'],['c','Június 27. – Magyarország hadba lép a Szovjetunió ellen']],answer:['a','b','c'],hint:'Április megelőzi júniust; júniusban a 22-e a korábbi.',explanation:'1941 áprilisában volt a balkáni hadjárat, június 22-én a Szovjetunió elleni német támadás, majd június 27-én Magyarország hadba lépése.'},
      {id:'e5',type:'match',tag:'Események naptára',question:'Párosítsd az 1941-es dátumokat az eseményekkel!',pairs:[['1941. április','Jugoszlávia elleni hadjárat'],['1941. június 22.','Német támadás a Szovjetunió ellen'],['1941. június 27.','Magyarország hadba lép a Szovjetunió ellen']],hint:'A június 22-i esemény Németországhoz kapcsolódik.',explanation:'Az 1941-es balkáni hadjárat áprilisban, a Szovjetunió elleni támadás június 22-én, Magyarország hadba lépése június 27-én történt.'},
      {id:'e6',type:'multi',tag:'Mi történt 1941-ben?',question:'Mely események történtek 1941-ben?',options:[['a','Jugoszlávia megtámadása'],['b','A Szovjetunió elleni német támadás'],['c','Magyarország hadba lépése a Szovjetunió ellen'],['d','Párizs német elfoglalása']],answer:['a','b','c'],hint:'Párizs elfoglalása a korábbi, 1940-es állomáshoz kapcsolódott.',explanation:'Az első három esemény 1941-ben történt. Párizsba 1940 júniusában vonultak be a német csapatok.'}
    ]
  },
  {
    id:'pearl',year:'1941',name:'Pearl Harbor',place:'Hawaii, Csendes-óceán',icon:'🌊',
    subtitle:'Az utolsó időkapu',tone:'violet',
    briefing:'1941. december 7-én Japán meglepetésszerű támadást indított az Egyesült Államok Pearl Harbor-i haditengerészeti támaszpontja ellen, Hawaiin. Az Egyesült Államok december 8-án hadat üzent Japánnak, majd december 11-én Németország és Olaszország hadat üzent az Egyesült Államoknak.',
    fact:'1941. december 7. – japán támadás Pearl Harbor ellen.',
    questions:[
      {id:'h1',type:'choice',tag:'Azonosítsd a támadót',question:'Melyik ország támadta meg Pearl Harbort 1941. december 7-én?',options:[['a','Japán'],['b','Németország'],['c','Olaszország'],['d','A Szovjetunió']],answer:'a',hint:'A támadás a csendes-óceáni térségben történt.',explanation:'Pearl Harbort a japán hadsereg támadta meg 1941. december 7-én.'},
      {id:'h2',type:'choice',tag:'Helyszínkereső',question:'Hol található Pearl Harbor?',options:[['a','Hawaiin'],['b','Franciaországban'],['c','Lengyelországban'],['d','Nagy-Britanniában']],answer:'a',hint:'Pearl Harbor a Csendes-óceán térségében található.',explanation:'Pearl Harbor az Egyesült Államok egyik haditengerészeti támaszpontja Hawaii szigetvilágában.'},
      {id:'h3',type:'truefalse',tag:'Igaz vagy hamis?',question:'Az Egyesült Államok 1941. december 8-án hadat üzent Japánnak.',answer:true,hint:'Gondolj arra, milyen döntés születhetett a támadást követő napon!',explanation:'Igaz. Az Egyesült Államok 1941. december 8-án hadat üzent Japánnak.'},
      {id:'h4',type:'order',tag:'Az utolsó időrend',question:'Rendezd időrendbe az 1941. decemberi eseményeket!',items:[['a','Dec. 7. – Pearl Harbor megtámadása'],['b','Dec. 8. – Az USA hadat üzen Japánnak'],['c','Dec. 11. – Németország és Olaszország hadat üzen az USA-nak']],answer:['a','b','c'],hint:'A dátumok segítenek: 7., 8., 11.',explanation:'Pearl Harbor megtámadása december 7-én történt, az amerikai hadüzenet 8-án, a német és olasz hadüzenet 11-én.'},
      {id:'h5',type:'match',tag:'Három fontos szereplő',question:'Párosítsd a neveket a Pearl Harbor-i eseményekben betöltött szerepükkel!',pairs:[['Japán','Végrehajtotta a támadást'],['Pearl Harbor','Amerikai haditengerészeti támaszpont'],['Egyesült Államok','A támadást követően hadba lépett']],hint:'Egy ország támadott, egy támaszpontot megtámadtak, egy ország erre reagált.',explanation:'Japán megtámadta a Pearl Harbor-i amerikai támaszpontot; az Egyesült Államok ezt követően lépett be a világháborúba.'},
      {id:'h6',type:'multi',tag:'Utolsó tudáspróba',question:'Mely állítások igazak Pearl Harbor megtámadására?',options:[['a','1941. december 7-én történt.'],['b','Japán hajtotta végre.'],['c','Az Egyesült Államok ezután belépett a világháborúba.'],['d','1940. december 7-én történt.']],answer:['a','b','c'],hint:'Figyelj az évszámra: a küldetés 1941-ben ér véget.',explanation:'Pearl Harbort Japán támadta meg 1941. december 7-én. Az Egyesült Államok ezután belépett a háborúba.'}
    ]
  }
];

export const DIFFICULTIES = [
  {id:'felfedezo',name:'Felfedező',icon:'🌱',description:'Rövidebb válaszlista, induló segítség, három egyszerű párosítás.'},
  {id:'nyomozo',name:'Nyomozó',icon:'🔎',description:'Önálló megoldás, kérhető segítség, teljes válaszlista.'},
  {id:'tortenesz',name:'Történész',icon:'⭐',description:'Minden válaszlehetőség, segítség külön kérésre.'}
];

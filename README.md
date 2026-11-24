# IDŐUGRÁS – Küldetés: 1941

**Verzió:** 1.0.0  
**Tantárgy:** Történelem, TANAK 8.  
**Téma:** Második világháború 1939-től Pearl Harborig (1941. december 7.)

Önálló, reszponzív és ingyenesen használható oktatójáték. Nincs külső JavaScript-könyvtár, regisztráció, API-kulcs, adatbázis vagy előfizetés.

## Mit tartalmaz?

- 5 történelmi időkapu: 1939 Lengyelország, 1940 nyugati hadjárat, 1940 angliai csata, 1941 keleti front, 1941 Pearl Harbor.
- 30 ellenőrzött, változatos feladat: egyválaszos és többválaszos kérdés, igaz–hamis, sorrendezés, párosítás.
- 3 támogatási szint: **Felfedező**, **Nyomozó**, **Történész**.
- Változó válaszsorrend új játék indításakor, kérhető segítség, magyar szövegfelolvasás, nagyítható betűk, pontgyűjtés és történelmi pecsétek.
- Helyben mentett haladás, idővonalas összefoglaló, nyomtatható zárólap.
- Részletes tanári útmutató: `tanari-utmutato.html`.

## GitHub Pages – telepítés

1. A ZIP-et **csomagold ki**. Hozz létre egy új, nyilvános GitHub repositoryt, például `idougras-1941` néven.
2. A **kicsomagolt fájlokat és mappákat** (nem a ZIP-et) töltsd fel a repository gyökerébe. Az `index.html` közvetlenül a gyökérben legyen.
3. GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
4. A közzétett cím tipikusan: `https://FELHASZNALONEV.github.io/idougras-1941/`. A GitHub-felhasználónév és a repository neve eltérhet.
5. Nyisd meg a weboldalt mobilon és asztali böngészőben; ellenőrizd az első feladatot és a mentést.

**Fontos:** a projektet nem kell a már működő matekjáték-repositoryba tenni, és nem szükséges meglévő fájlokat felülírni. A jelen csomag *önálló új játék*.

## Helyi futtatás

Az ES module-ok miatt érdemes helyi kiszolgálóval megnyitni (nem egyszerű `file://` kattintással):

```bash
cd idougras-1941
python -m http.server 8000
```

Majd: `http://localhost:8000/`. Ha nincs Python, használható bármilyen statikus fájlkiszolgáló.

## Adatkezelés és mentés

A játék nem továbbít tanulói adatokat, nem kér nevet, nem használ külső elemzőkódot. Csak a helyi böngésző `localStorage` tárolóját próbálja használni; ha nem érhető el, a játék ettől még fut, de újratöltéskor nem őrzi meg a haladást. A mentés eszköz- és böngészőfüggő. Az „Újrakezdés” nem törli a külön tárolt helyi rekordot.

## Módosítás

- `data.js`: az 5 küldetés és a történelmi feladatok.
- `app.js`: kérdésellenőrzés, pontozás, állapot és képernyők.
- `styles.css`: megjelenés, reszponzivitás, nyomtatás.
- `tanari-utmutato.html`: óravezetési javaslatok és szakmai keretek.
- `tests/`: futtatható automatizált ellenőrzések.

**Frissítésnél:** töltsd le a jelenlegi repositoryt biztonsági mentésként, majd csak a kívánt fájlokat módosítsd. A `localStorage` mentés azonos webhelyen, azonos verzió alatt marad meg. Új adatmodell-verziónál külön migráció lehet szükséges.

## Források a történelmi állításokhoz

- [United States Holocaust Memorial Museum – World War II Key Dates](https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates)
- [United States Holocaust Memorial Museum – The Holocaust and World War II: Key Dates](https://encyclopedia.ushmm.org/content/en/article/the-holocaust-and-world-war-ii-key-dates)
- [Royal Air Force – Battle of Britain](https://www.raf.mod.uk/what-we-do/our-history/anniversaries/battle-of-britain/)
- [United States Holocaust Memorial Museum – 1941: Key Dates](https://encyclopedia.ushmm.org/content/en/article/1941-key-dates)
- [National WWII Museum – Pearl Harbor](https://www.nationalww2museum.org/war/topics/pearl-harbor-december-7-1941)

## Változásnapló

### v1.0.0 – 2026-11-24
- Önálló első kiadás, 5 időkapu és 30 feladat.
- Három szint, pontozás, helyi mentés, nagy betűk, felolvasás.
- Tanári útmutató, reszponzív felület, nyomtatás és tesztek.

## Ismert korlátok

- Nincs felhőmentés, osztályszintű tanári statisztika vagy tanulói fiók.
- A magyar gépi felolvasás a böngészőben elérhető hangoktól függ.
- Az offline használathoz az oldal megnyitásához statikus helyi kiszolgáló szükséges; nem tartalmaz telepíthető PWA-funkciót.

## Fejlesztői tesztek

Az adatmodell automatizált, külső csomagot nem igénylő ellenőrzése (Node.js szükséges):

```bash
npm test
```

Opcionális böngészős regressziós teszt (Python, Playwright és telepített Chromium szükséges):

```bash
python tests/browser_smoke.py
```

A mellékelt böngészőteszt a helyi fájlok CSS-ét, HTML-jét és JS-ét hálózat nélkül tölti be egy Chromium lapba, hogy a játéklogika akkor is ellenőrizhető legyen, ha a tesztkörnyezet tiltja a helyi szerverhez történő böngészős hozzáférést. Ez **nem helyettesíti** a GitHub Pages éles telepítési próbáját.

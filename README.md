# IDŐUGRÁS – 1939–1943

**Verzió:** 1.1.0 (2026-11-25)  
**Célcsoport:** Történelem, TANAK 8.  
**Repo / élő weboldal:** https://hajgre.github.io/idougras-1941/

Egyszerű, ingyenes böngészős történelemjáték. Regisztráció, személyes adatok, külső JS-könyvtárak, API-kulcsok és adatbázis nélkül működik.

## Választható tanulási utak

- **Teljes időutazás (1939–1943):** 9 időkapu, 54 feladat. Az első 5 időkapu mind a 30 eredeti feladatával változatlanul megmaradt.
- **Csak az új anyag (1942–1943):** 4 időkapu, 24 könnyű, bemutató szöveggel kezdődő feladat.
- Az új időkapuk: **Midway, El-Alamein, Sztálingrád, Civilek és üldöztetés**.
- Megmaradt az 5 feladattípus (egyválaszos, igaz–hamis, időrend, párosítás, többválaszos), három segítségi szint, véletlen sorrendű válaszlehetőség, felolvasás (böngészőfüggő), betűnagyítás, pontok, pecsétek és nyomtatás.
- Az új feladatok rövidek, és a megfelelő időkapuk elején az új tananyagot összefoglaló ismertető olvasható.

## Frissítés a meglévő GitHub-repositoryban

**Ne hozz létre új repositoryt.** A már működő `hajgre/idougras-1941` repositoryt használd.

1. Biztonsági mentés: a GitHub repository **Code → Download ZIP** menüjében töltsd le a jelenlegi állapotot. Ezt külön őrizd meg.
2. Az új kiadási ZIP-et csomagold ki a számítógépen, és a benne lévő **fájlokat/mappákat**, ne magát a ZIP-et, töltsd fel a meglévő repository gyökerébe a **Code → Add file → Upload files** menüben. Az azonos nevű fájlokat cseréld le; az `index.html` a gyökérben maradjon.
3. Commit üzenet: `feat: IDŐUGRÁS v1.1.0 – 1942–1943 új időkapuk`
4. GitHub Pages beállítás maradjon **main / (root)**. Ne töröld a régi repositoryt, ne változtasd meg a közzétételi címet.
5. Nyisd meg: https://hajgre.github.io/idougras-1941/ . Ha a régi változat látszik, frissítsd a böngészőt (Ctrl+F5), majd nézd meg az anyagválasztót.

**Visszaállítás:** a mentett előző ZIP-ből töltsd vissza a korábbi fájlokat. Így a régi játékfájlok visszaállnak. A böngészőben tárolt új eredmények kompatibilitása visszalépéskor nem garantált; a v1.0.0 mentés kulcsa változatlan maradt.

## Mentés és kompatibilitás

- A v1.0.0 teljes játékának mentési kulcsa változatlan: `idougras-1941-v1-progress`. A v1.1.0 a korábbi mentésből folytatja a munkát.
- Ha a tanuló a régi 5 időkaput már befejezte, az új kiadásból a 6. állomásnál (Midway) folytathatja.
- A külön **„Csak az új anyag”** tanulási út saját helyi mentést és saját legjobb eredményt használ, ezért nem írja felül a teljes játék haladását.
- A tárolás böngészőhöz és eszközhöz kötött. Nincs felhőmentés vagy név szerinti tanulói adatgyűjtés.
- Az új és a régi szint pontszáma nem osztályzat; a segítség, az újrapróbálkozás és a tévedés megengedett.

## Helyi indítás, tesztek

```bash
# a projekt mappájában
python -m http.server 8000
# megnyitás: http://localhost:8000

npm test
python tests/browser_smoke.py
```

A böngészős teszthez Python Playwright és helyben telepített Chromium kell (a játék működéséhez nem). A futtatás a `TEST_LEVEL=tortenesz` vagy `SKIP_FULL=1` környezeti változóval szűkíthető. A tényleges méréseket a `TESZTEREDMENYEK.md` rögzíti.

## Történelmi források

- [USHMM – World War II Key Dates](https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates)
- [National WWII Museum – Battle of Midway](https://www.nationalww2museum.org/war/topics/battle-of-midway)
- [Imperial War Museums – El-Alamein](https://www.iwm.org.uk/sites/default/files/files/2024-07/churchill_and_the_middle_east_large_print_guide.pdf)
- [Encyclopaedia Britannica – Battle of Stalingrad](https://www.britannica.com/event/Battle-of-Stalingrad)
- [USHMM – Introduction to the Holocaust](https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust)
- [USHMM – Ghettos](https://encyclopedia.ushmm.org/content/en/article/ghettos)

## Változásnapló

### v1.1.0 – 2026-11-25

- 4 új időkapu, 24 könnyű feladat: Midway, El-Alamein, Sztálingrád, Civilek és üldöztetés.
- Teljes és csak új anyagos játékmód; elkülönített mentések, dinamikus pont- és feladatszám.
- Régi v1.0.0 mentések migrálása: a befejezett 1941-es időutazás a 6. kapunál folytatható.
- Új tanári segítség és bővített automatizált tesztek.

### v1.0.0 – 2026-11-24

- 5 időkapu, 30 feladat, három támogatási szint, helyi mentés, pontozás és tanári útmutató.

## Ismert korlátok

- Nincs osztályszintű statisztika, központi adatbázis vagy tanulói fiók.
- A gépi felolvasás magyar hangja a böngésző és az eszköz telepített hangjaitól függ.
- A GitHub Pages-re feltöltött frissítés megjelenését és a tényleges tanórai használatot a feltöltés után még ellenőrizni kell.
- A holokauszt fogalmainak játékbeli gyakorlását tanári beszélgetés és reflexió egészítse ki; a történelmi üldözés folyamata helyszínenként eltérhetett, és 1943 után is folytatódott.

# IDŐUGRÁS v1.0.0 – Teszteredmények

**Dátum:** 2026. november 24.  
**Környezet:** Node.js 22, Python Playwright, headless Chromium, 1280 × 850 asztali és 390 × 844 mobil nézet.

## Sikeresen ellenőrzött

- **3 automatizált strukturális ellenőrzés** (Node.js, `npm test`): 5 küldetés × 6 feladat, minden küldetésben 5 típus, egyedi feladatazonosítók, validált válaszkulcsok.
- **Mindhárom szinten 30/30 feladat sikeres végigjátszása** (összesen 90 automatikusan megoldott feladat); mindhárom esetben 300/300 pont és záróképernyő.
- Kérdésállapot visszaállítása szimulált újratöltéssel, mentett haladás.
- Helytelen válasz → újrapróbálkozás; segítség megjelenése; részpontszámok (7 pont, 7 pont).
- Időrend átrendezése, párok kiválasztása, több válasz jelölése, igaz–hamis és feleletválasztás.
- Emléklap nyomtatási gomb eseménye, újrakezdési jóváhagyás és megszakítás.
- Mobil nézetben horizontális kilógás ellenőrzése, szövegnagyítás, tanári útmutató megjelenése, futásidejű JS-hibák hiánya az ellenőrzött útvonalakon.

## Korlátok, nem ellenőrzött részek

- A tesztkörnyezet a böngésző hálózati/localhost navigációját blokkolta. Ezért a böngészős teszt **közvetlen HTML/CSS/JS-injektálással** futott; a valódi GitHub Pages deploy, HTTPS-betöltés és az ES module-ok hálózati importja **nem volt élesben tesztelhető**.
- Fizikai iPad, Android-telefon és interaktív tábla nem állt rendelkezésre; a mobilteszt böngészőben megadott képernyőmérettel készült.
- A magyar szövegfelolvasás minősége és a nyomtató tényleges papírkimenete nem tesztelhető itt (a nyomtatási gomb meghívását teszteltük).
- A történelmi feladatok szakmai áttekintése megadott hiteles források alapján történt; az adott osztály tananyagával való egyeztetés tanári feladat.

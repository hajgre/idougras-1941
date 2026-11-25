# IDŐUGRÁS v1.1.0 – tényleges teszteredmények

**Dátum:** 2026-11-25  
**Tesztelt változat:** 1.1.0, helyi fájlokból, Playwright + Chromium (automatizált DOM-teszt), Node.js beépített tesztfuttató.

## Sikeres ellenőrzések

| Teszt | Eredmény |
|---|---|
| `node --check app.js`, `node --check data.js` | Sikeres szintaxisellenőrzés |
| `npm test` (4 adatmodellteszt) | 4/4 sikeres |
| 9 időkapu, összesen 54 kérdés, 5 feladattípus ellenőrzése | Sikeres |
| Teljes 54 feladatos végigjátszás – Felfedező | Sikeres (540/540 pont) |
| Teljes 54 feladatos végigjátszás – Nyomozó | Sikeres (540/540 pont) |
| Teljes 54 feladatos végigjátszás – Történész | Sikeres (540/540 pont) |
| Csak új anyag: 24 kérdés, 4 új időkapu, lezárás | Sikeres (240/240 pont) |
| Hibás válasz, javítás, segítségkérés, részpontszám | Sikeres (7 pontos részpontozás) |
| Korábbi v1.0.0 befejezett mentés átvétele | Sikeres: a 6. állomásnál (Midway) folytatja, 300 pont megmarad |
| Külön mentés és folytatás a csak-új-anyag játékmódban | Sikeres |
| Váltás a két tanulási út között | Sikeres; mentések külön tárolódnak |
| Mobilos 390 px nézet: vízszintes túlcsordulás, nagy betű, újrakezdés | Sikeres |
| Tanári útmutató megnyitása és újrakezdő párbeszédpanel | Sikeres |
| Hibakezelés: fel nem dolgozott JS-hibák a fenti böngészőtesztekben | 0 észlelt |

A böngészőteszt a kódban szereplő megoldókulcsokkal halad végig a feladatokon. Az adatmodellteszt emellett minden feladat szerkezetét és válaszazonosítóit ellenőrzi. Ezek nem helyettesítik a minden kérdésre kiterjedő független történeti szakértői lektorálást vagy a tanulókkal végzett kipróbálást.

## Megmaradt, illetve nem ellenőrzött területek

- Az éles GitHub Pages frissítése még nincs feltöltve; az éles URL-en történő futtatást **a feltöltés után** kell ellenőrizni.
- A valódi tanulók számára szükséges olvasási támogatás és érzelmi biztonság tanórai megfigyelést igényel.
- A gépi magyar felolvasást nem ellenőriztük minden operációs rendszeren és böngészőn.
- Nem volt külön iOS Safari- és Android-eszközön végzett manuális teszt; a mobilteszt Chromium 390 px-es nézetben zajlott.
- A tesztek lokális, hálózat nélküli fájlfuttatást szimulálnak; az éles GitHub Pages HTTPS, gyorsítótár és telepítés külön ellenőrzendő.

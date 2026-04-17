# HibaVonal Frontend

Ez a projekt a **HibaVonal** rendszer React alapú frontendje. A felület a meglévő **.NET backend API** használatára épül, és a jelenlegi állapotban elsősorban a **Maintainer** és a **Lead Maintainer** szerepkörökhöz tartozó képernyőket dolgozza ki részletesen.

A frontend célja, hogy a karbantartási folyamatokhoz gyors, jól átlátható, szerepkör-alapú kezelőfelületet biztosítson:
- hibajegyek megtekintése
- hibajegyek státuszának módosítása
- hibajegyek kiosztása karbantartókhoz
- eszközrendelések létrehozása és kezelése
- részletes hibajegy nézet
- stabilabb hibakezelés és munkamenet-kezelés

---

## 1. Jelenlegi állapot röviden

A frontend a projekt több refaktorálási és hibajavítási köre után az alábbi főbb jellemzőkkel rendelkezik:

- **React + Vite** alapú alkalmazás
- **Bootstrap** alapú reszponzív UI
- **React Router** alapú route-kezelés
- **Axios** alapú API kommunikáció
- **React Toastify** alapú felhasználói visszajelzések
- route guardokkal védett szerepkör-specifikus oldalak
- külön komponensekre bontott dashboard felépítés
- külön **custom hookokba szervezett state-kezelés**
- induláskori API-betöltési hibák mérséklése
- deduplikált GET kérések és toast hibakezelés
- részletek panel javítva: már nem követi lefelé a görgetést

---

## 2. Technológiai stack

### Fő technológiák
- **React 19**
- **Vite 8**
- **React Router DOM 7**
- **Axios**
- **Bootstrap 5**
- **React Toastify**

### Csomagok
A projekt `package.json` alapján:

```json
{
  "dependencies": {
    "axios": "^1.13.6",
    "bootstrap": "^5.3.8",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.2",
    "react-toastify": "^11.0.5"
  }
}
```

---

## 3. Futtatás

### 3.1. Előfeltételek
A következők legyenek telepítve:
- **Node.js** 18+ vagy újabb
- **npm**
- futó **backend API**

### 3.2. Telepítés
A projekt gyökerében:

```bash
npm install
```

### 3.3. Fejlesztői futtatás

```bash
npm run dev
```

### 3.4. Build készítés

```bash
npm run build
```

### 3.5. Preview

```bash
npm run preview
```

---

## 4. Környezeti változók

A frontend az API alap URL-jét a következő környezeti változóból olvassa:

```env
VITE_API_BASE_URL=https://localhost:7218
```

Ha ez nincs megadva, akkor az alapértelmezett érték:

```js
https://localhost:7218
```

Ajánlott létrehozni egy `.env` fájlt a projekt gyökerében:

```env
VITE_API_BASE_URL=https://localhost:7218
```

---

## 5. Bejelentkezés és jogosultságkezelés

A frontend JWT alapú hitelesítési folyamattal működik.

### Tárolt adatok
A sikeres login után a következők kerülnek a `localStorage`-ba:
- `token`
- `user`

### AuthContext feladata
A `src/context/AuthContext.jsx` kezeli:
- az aktuális felhasználót
- a JWT tokent
- a `login()` függvényt
- a `logout()` függvényt
- az `isAuthenticated` állapotot

### Fontos működés
- sérült vagy hibás `user` JSON esetén a frontend kitakarítja a tárolt adatot
- lejárt vagy érvénytelen token esetén a válasz interceptor törli a munkamenetet
- 401 esetén a rendszer visszairányít a `/login` oldalra

---

## 6. Útvonalak

A route-ok a `src/constants/routes.js` fájlban vannak definiálva.

### Publikus route-ok
- `/login`
- `/register`
- `/forbidden`

### Védett route-ok
- `/maintainer`
- `/lead-maintainer`

### Root route
- `/` → szerepkör alapján átirányít

### Route guardok

#### `ProtectedRoute`
Csak hitelesített, megfelelő szerepkörű felhasználó férhet hozzá.

#### `PublicOnlyRoute`
Ha a felhasználó már be van jelentkezve, akkor nem maradhat a login/register oldalon, hanem a saját dashboardjára kerül.

#### `RoleHomeRedirect`
A `/` gyökérútvonalról a felhasználó szerepköre alapján a megfelelő kezdőoldalra navigál.

---

## 7. Támogatott szerepkörök a jelenlegi frontendben

### Maintainer
Elérhető funkciók:
- hozzárendelt hibajegyek listázása
- hibajegy részleteinek megnyitása
- hibajegy státusz módosítása
- eszközrendelési igény létrehozása
- saját rendelések megtekintése

### Lead Maintainer
Elérhető funkciók:
- teljes hibajegylista megtekintése
- csak kiosztatlan hibák szűrése
- karbantartók lekérése a backendből
- hibajegy karbantartóhoz rendelése
- hibajegy státusz módosítása
- rendelések létrehozása
- rendelések státuszfrissítése
- részletek panel frissítése

### Jelenleg nincs kidolgozva
- teljes kollégista/user felület
- admin felület

Ha ilyen bővítésre lesz szükség, a mostani architektúra már alkalmas rá.

---

## 8. Projektstruktúra

```text
src/
├── api/
│   ├── authApi.js
│   ├── axiosConfig.js
│   └── maintenanceApi.js
├── components/
│   ├── auth/
│   ├── common/
│   ├── dashboard/
│   ├── issue/
│   ├── order/
│   └── sidebar/
├── constants/
├── context/
├── hooks/
├── layout/
├── pages/
│   ├── auth/
│   ├── leadMaintainer/
│   └── maintainer/
├── routes/
└── utils/
```

---

## 9. Architektúra áttekintés

A jelenlegi frontend három fő rétegre bontható:

### 9.1. API réteg
A `src/api` mappa felel az összes backend kommunikációért.

- `authApi.js` → login és regisztráció
- `maintenanceApi.js` → hibajegyek, rendelések, karbantartók
- `axiosConfig.js` → közös axios kliens, base URL, token, interceptorok

### 9.2. State és üzleti logika
A `src/hooks` mappában található a dashboardok és részfolyamatok állapotkezelése.

### 9.3. Megjelenítési réteg
A `components` és `pages` mappák felelnek az UI-ért.

A fontosabb elv itt az, hogy:
- a **page** komponensek inkább összeállítják az oldalt
- a **hookok** tartalmazzák a viselkedési logikát
- a **komponensek** minél inkább megjelenítés-központúak maradnak

---

## 10. API réteg részletesen

### 10.1. `axiosConfig.js`
Feladata:
- közös axios instance létrehozása
- timeout beállítása
- JWT automatikus hozzáadása minden kéréshez
- 401 hibák központi kezelése

Jelenlegi timeout:
- **15000 ms**

### 10.2. `authApi.js`
Elérhető műveletek:
- `registerUser(data)`
- `loginUser(data)`

### 10.3. `maintenanceApi.js`
Elérhető műveletek:

#### Maintainer
- `getMaintainerIssues()`
- `getMaintainerIssueById(id)`
- `updateMaintainerIssueStatus(id, status)`
- `getMaintainerOrders()`
- `createMaintainerOrder(payload)`

#### Lead Maintainer
- `getLeadMaintainerIssues()`
- `getLeadMaintainerIssueById(id)`
- `getMaintainers()`
- `assignIssueToMaintainer(id, maintainerId)`
- `updateLeadMaintainerIssueStatus(id, status)`
- `getLeadMaintainerOrders()`
- `createLeadMaintainerOrder(payload)`
- `updateLeadMaintainerOrderStatus(id, status)`

### 10.4. GET kérés deduplikáció
A frontend már tartalmaz **in-flight GET request deduplikációt**.

Ez azt jelenti, hogy ha ugyanaz a GET kérés egyszerre többször indulna el, akkor:
- nem indul el minden példány külön
- a rendszer egy közös Promise-t használ
- csökken a felesleges API-terhelés
- csökken az induláskori hibák és többszörös lekérések esélye

---

## 11. Státuszok és enum mapping

A backend a státuszokat nem stringként, hanem számszerű enum értékként várja.

### Hibajegy státuszok
- `Open` → `0`
- `InProgress` → `1`
- `Resolved` → `2`
- `Closed` → `3`

### Rendelés státuszok
- `Pending` → `0`
- `InProgress` → `1`
- `Completed` → `2`
- `Cancelled` → `3`

A mapping a `src/constants/statuses.js` fájlban található.

Ez azért fontos, mert korábban a státuszfrissítés azért hibázott, mert a frontend stringet küldött, miközben a backend enum indexet várt.

---

## 12. Custom hookok

A mostani frontend egyik legfontosabb fejlesztése, hogy a state-kezelés külön hookokba lett kiszervezve.

### `useMaintainerDashboard()`
A maintainer dashboard teljes üzleti logikáját kezeli:
- hibajegyek betöltése
- rendelések betöltése
- szűrők és keresések
- hibajegy kiválasztás
- státuszfrissítés
- rendelési igény létrehozása
- metrikák és szűrt listák előállítása

### `useLeadMaintainerDashboard()`
A vezető karbantartó dashboard logikája:
- hibajegyek betöltése
- karbantartók betöltése
- rendelések betöltése
- szűrés és keresés
- hibajegy kiosztása
- hibajegy státusz frissítése
- rendelés létrehozása
- rendelés státuszának frissítése
- összes adat frissítése

### `useIssueSelection()`
A kiválasztott hibajegy állapotát kezeli:
- `selectedIssueId`
- `selectedIssue`
- részletlekérés
- kiválasztás szinkronban tartása a listával
- frissítés

Ez a hook különösen fontos volt a korábbi „villogó részletek panel / folyamatos API-hívás” hiba javításához.

### `useOrderRequestForm()`
A rendelési űrlap mezőit kezeli.

### `useMountedRef()`
Segédhook arra, hogy aszinkron művelet után csak akkor történjen state update, ha a komponens még tényleg mounted állapotban van.

---

## 13. Fő oldalak

### 13.1. Login oldal
Fájlok:
- `pages/auth/LoginPage.jsx`
- `components/auth/LoginForm.jsx`

Jellemzők:
- backendes login
- demo belépési adatok gyors kitöltése
- sikeres login toast
- szerepkörnek megfelelő, biztonságos átirányítás

Demo adatok a képernyő szerint:
- `maintainer1 / jelszo123`
- `leadmaintainer1 / jelszo123`

### 13.2. Register oldal
Fájlok:
- `pages/auth/RegisterPage.jsx`
- `components/auth/RegisterForm.jsx`

Jellemzők:
- Neptun-kód alapú regisztráció
- jelszó megerősítés ellenőrzése
- opcionális szobaszám
- backend whitelist logikához igazított kommunikáció

### 13.3. Maintainer dashboard
Fájl:
- `pages/maintainer/MaintainerDashboardPage.jsx`

Fő részei:
- metrikák
- hibajegy szekció
- részletek panel
- rendelési igény űrlap
- rendelési lista

### 13.4. Lead maintainer dashboard
Fájl:
- `pages/leadMaintainer/LeadMaintainerDashboardPage.jsx`

Fő részei:
- metrikák
- teljes hibajegylista
- kiosztási műveletek
- részletek panel
- új rendelés űrlap
- rendelési lista és státuszkezelés

### 13.5. Forbidden oldal
Fájl:
- `pages/auth/ForbiddenPage.jsx`

Akkor jelenik meg, ha a bejelentkezett felhasználónak nincs joga az adott oldalhoz.

---

## 14. UI komponensek

### 14.1. Common komponensek
- `EmptyState.jsx`
- `InfoMetric.jsx`
- `LoadingCard.jsx`
- `StatusBadge.jsx`

### 14.2. Dashboard komponens
- `DashboardMetricsRow.jsx`

### 14.3. Issue komponensek
- `IssueCard.jsx`
- `IssueDetailPanel.jsx`
- `IssueFilterToolbar.jsx`
- `IssueListContent.jsx`
- `MaintainerIssueActions.jsx`
- `LeadIssueActions.jsx`
- `MaintainerIssueSection.jsx`
- `LeadIssueSection.jsx`

### 14.4. Order komponensek
- `OrderCard.jsx`
- `OrderFilterToolbar.jsx`
- `OrderListContent.jsx`
- `OrderRequestForm.jsx`
- `MaintainerOrdersSection.jsx`
- `LeadOrdersSection.jsx`
- `LeadOrderActions.jsx`

### 14.5. Sidebar komponensek
- `MaintainerSidebar.jsx`
- `LeadMaintainerSidebar.jsx`

---

## 15. Részletek panel

A `IssueDetailPanel.jsx` jelenleg a jobb oldali sávban jelenik meg.

Korábbi probléma:
- a panel `sticky` viselkedése miatt görgetés közben együtt mozgott az oldallal

Jelenlegi állapot:
- a panel már **nem követi a teljes oldal görgetését**
- stabilabb, fixebb vizuális élményt ad
- nagyobb tartalomnál belső görgetésre is alkalmas kialakításban van használva

---

## 16. Hibakezelés

A hibakezelés a `src/utils/errors.js` és `src/utils/toast.js` fájlokban van központosítva.

### `createApiErrorMessage()`
Feladata:
- 401 hibák értelmes kezelése
- 403 hibák kezelése
- timeout detektálása
- hálózati hiba detektálása
- backend validációs hibák összefűzése
- értelmes fallback üzenet biztosítása

### Toast deduplikáció
A frontend nem engedi, hogy ugyanaz a hibaüzenet rövid időn belül többször egymás után jelenjen meg.

Ez különösen fontos volt az induláskori ismétlődő adatbetöltési hibák miatt.

---

## 17. Keresés és szűrés

A dashboardokban kliensoldali szűrés és keresés működik.

Ez a `src/utils/search.js` fájl segédfüggvényeire épül.

Tipikus felhasználások:
- hibajegy státusz szerinti szűrés
- hibajegy keresés
- rendelés státusz szerinti szűrés
- rendelés keresés
- metrika-számlálók generálása

---

## 18. Korábban javított hibák

A jelenlegi állapot már tartalmazza az alábbi fontosabb javításokat:

### 18.1. Login utáni hibás jogosultsági átmenet
Korábban előfordult, hogy a felhasználó belépés után röviden hibás jogosultsági oldalra került.

Javítás:
- biztonságos post-login route kiválasztás
- csak olyan oldalra lép vissza a felhasználó, amihez tényleg van joga

### 18.2. Hibajegy részletek villogása és folyamatos API-hívása
Korábban a részletek gombra kattintva a panel villoghatott, és a frontend újra meg újra kérhette ugyanazt az adatot.

Javítás:
- kiválasztott hibajegy logika szétválasztása
- célzottabb részletlekérés
- szinkronizáció a listával
- stale request védelem

### 18.3. Státuszfrissítés hibája
Korábban a státuszmódosítás hibát adhatott.

Javítás:
- enum index küldése a backendnek string helyett

### 18.4. Induláskori többszörös adatbetöltési hibák
Korábban több induló kérés egyszerre többször lefuthatott, ami zajos hibajelenségeket okozott.

Javítás:
- `StrictMode` eltávolítása a fejlesztői duplafuttatás mérséklésére
- GET kérés deduplikáció
- toast deduplikáció
- jobb 401 és hálózati hiba kezelés

---

## 19. Jelenlegi backend függőségek és korlátok

### 19.1. ToolList lookup hiánya
A backend jelenlegi állapotában nincs külön tool lookup endpoint a rendelési űrlaphoz.

Ezért a frontend ideiglenesen a következő seedelt eszközlistát használja:
- Bosch GSR 120-LI
- Makita DHP453
- DeWalt DCD771C2

A lista a `src/constants/toolOptions.js` fájlban található.

### 19.2. Feltételezett backend végpontok
A frontend feltételezi, hogy a backend az alábbi útvonalakon érhető el:
- `/api/auth/login`
- `/api/auth/register`
- `/api/maintainer/issues`
- `/api/maintainer/issues/{id}`
- `/api/maintainer/issues/{id}/status`
- `/api/maintainer/orders`
- `/api/lead-maintainer/issues`
- `/api/lead-maintainer/issues/{id}`
- `/api/lead-maintainer/issues/{id}/assign`
- `/api/lead-maintainer/issues/{id}/status`
- `/api/lead-maintainer/orders`
- `/api/lead-maintainer/orders/{id}/status`
- `/api/lead-maintainer/maintainers`

---

## 20. Fejlesztési javaslatok a következő lépésekhez

### Rövid távon
- user/kollégista dashboard megírása
- admin dashboard megírása
- részletek panel modal nézetté alakítása opcionálisan
- közös loading skeleton komponensek további finomítása

### Középtávon
- TypeScriptre migrálás
- React Query / TanStack Query bevezetése
- egységtesztek és komponens tesztek
- form validációs réteg bővítése
- API típusok és DTO-k egységesítése

### Hosszú távon
- szerepkörönként teljes UI lefedettség
- valós idejű frissítés
- audit log felület
- többnyelvűség

---

## 21. Hibaelhárítás

### A backend nem érhető el
Tünet:
- login nem működik
- listák nem töltődnek be
- hálózati hibás toast jelenik meg

Ellenőrizd:
- fut-e a backend
- helyes-e a `VITE_API_BASE_URL`
- a backend engedi-e a CORS-t a frontend felől

### 401 / lejárt munkamenet
Tünet:
- hirtelen visszadob loginra

Ok:
- lejárt vagy érvénytelen token

Megoldás:
- újra bejelentkezés

### Build hiba helyi környezetben
Futtasd újra:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 22. Fontosabb fájlok gyors áttekintése

| Fájl | Szerep |
|---|---|
| `src/App.jsx` | route-ok és alkalmazás belépési struktúrája |
| `src/main.jsx` | React belépési pont |
| `src/context/AuthContext.jsx` | auth állapot és localStorage kezelés |
| `src/api/axiosConfig.js` | axios kliens, token és 401 kezelés |
| `src/api/maintenanceApi.js` | hibajegy és rendelés API hívások |
| `src/hooks/useMaintainerDashboard.js` | maintainer dashboard logika |
| `src/hooks/useLeadMaintainerDashboard.js` | lead maintainer dashboard logika |
| `src/hooks/useIssueSelection.js` | kiválasztott hibajegy kezelése |
| `src/components/issue/IssueDetailPanel.jsx` | jobb oldali részletek panel |
| `src/constants/statuses.js` | státuszok és enum mapping |

---

## 23. Összegzés

A jelenlegi frontend állapot egy már jól használható, átlátható, továbbfejleszthető alap a HibaVonal rendszerhez. A fő erősségei:

- tisztább komponensstruktúra
- hookokra szervezett state-kezelés
- javított szerepkör alapú navigáció
- stabilabb API-hívási viselkedés
- átgondoltabb hibakezelés
- jól elkülönített maintainer és lead maintainer felület

A mostani verzió különösen jó alap arra, hogy erre épüljön rá a későbbi user/admin oldal, illetve egy még teljesebb frontend architektúra.

---

## 24. Ajánlott induló lépések új fejlesztőnek

1. `npm install`
2. `.env` létrehozása a helyes backend URL-lel
3. backend elindítása
4. `npm run dev`
5. bejelentkezés demo maintainer vagy lead maintainer felhasználóval
6. hibajegyek, státuszok és rendelési folyamatok kipróbálása

---

## 25. Demo belépési adatok

A login oldalon megjelenített minta alapján:

- **Maintainer:** `maintainer1 / jelszo123`
- **Lead Maintainer:** `leadmaintainer1 / jelszo123`

Ezek csak akkor működnek, ha a backend seed adatbázisa ténylegesen tartalmazza ezeket a fiókokat.

# HibaVonal Frontend


Ez a projekt a HibaVonal rendszer React alapú frontendje. 
A felület a meglévő .NET backend API használatára épül.


A jelenlegi állapotban a frontend teljes körűen kiszolgálja a Kollégista (User), Maintainer, Lead Maintainer és Admin szerepkörökhöz tartozó képernyőket és funkciókat.


A frontend célja, hogy a karbantartási folyamatokhoz gyors, jól átlátható, szerepkör-alapú kezelőfelületet biztosítson:


- hibajegyek megtekintése és létrehozása


- hibajegyek státuszának módosítása


- hibajegyek kiosztása karbantartókhoz


- eszközrendelések létrehozása és kezelése


- felhasználók, szerepkörök, eszközök és regisztrációs fehérlista (whitelist) menedzselése


- részletes hibajegy nézet stabil munkamenet-kezeléssel



---



## 1. Jelenlegi állapot röviden


A frontend a projekt több refaktorálási és hibajavítási köre után az alábbi főbb jellemzőkkel rendelkezik:


- React + Vite alapú alkalmazás


- Bootstrap alapú reszponzív UI


- React Router alapú route-kezelés és navigáció


- Axios alapú API kommunikáció központi interceptorokkal


- React Toastify alapú, deduplikált felhasználói visszajelzések


- route guardokkal védett szerepkör-specifikus oldalak


- külön komponensekre bontott dashboard felépítés


- külön custom hookokba szervezett state-kezelés


- induláskori API-betöltési hibák mérséklése


- deduplikált GET kérések és toast hibakezelés


- részletek panel javítva: már nem követi lefelé a görgetést



---



## 2. Technológiai stack


### Fő technológiák


- React 19


- Vite 8


- React Router DOM 7


- Axios


- Bootstrap 5


- React Toastify


### Csomagok


A legfontosabb függőségek a package.json alapján: 

axios, 
bootstrap, 
react, react-dom, 
react-router-dom, 
react-toastify.



---



## 3. Futtatás


### 3.1. Előfeltételek


A következők legyenek telepítve: Node.js 18+ vagy újabb, npm, valamint egy futó backend API.


### 3.2. Telepítés


A projekt gyökerében add ki a következő parancsot:

npm install


### 3.3. Fejlesztői futtatás


Indítás a következő paranccsal:

npm run dev


### 3.4. Build készítés


Build generálása a következő paranccsal:

npm run build


### 3.5. Preview


Előnézet megtekintése a következő paranccsal:

npm run preview



---



## 4. Környezeti változók


A frontend az API alap URL-jét a VITE_API_BASE_URL környezeti változóból olvassa.


Ha ez nincs megadva, akkor a rendszer a https://localhost:7218 alapértelmezett értéket használja.


Ajánlott létrehozni egy .env fájlt a projekt gyökerében a pontos beállításokhoz:
VITE_API_BASE_URL=https://localhost:7218



---



## 5. Bejelentkezés és jogosultságkezelés


A frontend JWT alapú hitelesítési folyamattal működik.


### Tárolt adatok


A sikeres bejelentkezés után a localStorage-ba kerül a token és a user objektum.


### AuthContext feladata


A src/context/AuthContext.jsx végzi a központi állapotkezelést: eltárolja és szolgáltatja az aktuális felhasználót és a tokent, biztosítja a login és logout metódusokat, valamint kiszámítja az isAuthenticated állapotot.


### Fontos működés


Sérült vagy hibás user JSON esetén a frontend kitakarítja a tárolt adatot. Lejárt vagy érvénytelen token esetén a válasz interceptor törli a munkamenetet, és visszairányít a login oldalra.



---



## 6. Útvonalak


A navigációs szabályok a src/constants/routes.js és az App.jsx fájlokban vannak definiálva.


### Publikus route-ok (PublicOnlyRoute védelemmel)


Ezeket az oldalakat csak kijelentkezett felhasználók érhetik el: 
/login, 

/register, 

/forbidden.


### Védett route-ok (ProtectedRoute védelemmel)


Ezek az oldalak szigorúan ellenőrzik a szerepkört: 

/collegiate (Kollégista), 

/maintainer (Karbantartó), 

/lead-maintainer (Vezető karbantartó), 

/admin (Adminisztrátor).


### Root route


A / útvonalról a RoleHomeRedirect komponens automatikusan a felhasználó szerepkörének megfelelő dashboardra irányít.



---



## 7. Támogatott szerepkörök a jelenlegi frontendben


### Maintainer


Elérhető funkciók: 

hozzárendelt hibajegyek listázása, 
szűrése és keresése; 
hibajegy részleteinek megnyitása; 
hibajegy státusz módosítása; 
eszközrendelési igény létrehozása a seedelt eszközökből;
saját rendelések megtekintése.


### Lead Maintainer


Elérhető funkciók: 

teljes hibajegylista kezelése; 
csak kiosztatlan hibák szűrése; 
karbantartók lekérése a backendből; 
hibajegy karbantartóhoz rendelése; 
hibajegy státusz módosítása; 
rendelések létrehozása és státuszfrissítése; 
részletek panel frissítése.


### Adminisztrátor (Admin)


Elérhető funkciók: 

felhasználók listázása,
adatlapi részleteik megtekintése; 
felhasználói szerepkör módosítása legördülő menüből; 
leltári eszközök lekérdezése, 
új eszközök felvitele és törlése; 
regisztrációs fehérlista (whitelist) kezelése.


### Kollégista (User)


Elérhető funkciók: 

saját bejelentések listázása és szűrése;
új hibajegy létrehozása a szobához tartozó berendezések automatikus betöltésével; 
saját nyitott hibajegyek szerkesztése; 
már megoldott hibákra visszajelzés (Feedback) beküldése.



---



## 8. Projektstruktúra


A src mappa felépítése:


api/ (backend hívások)


assets/ (statikus fájlok)


components/ (admin, auth, common, dashboard, issue, order, sidebar alkategóriákkal)


constants/ (állandók)


context/ (AuthContext)


hooks/ (custom hookok)


layout/ (AppShell)


pages/ (admin, auth, collegiate, leadMaintainer, maintainer)


routes/ (route guardok)


utils/ (segédfüggvények)



---



## 9. Architektúra áttekintés


A jelenlegi frontend három fő rétegre bontható:


### 9.1. API réteg


A src/api mappa felel az összes backend kommunikációért (authApi, maintenanceApi, adminApi, issueApi, feedbackApi, axiosConfig).


### 9.2. State és üzleti logika


A src/hooks mappában található a dashboardok és részfolyamatok állapotkezelése (pl. useAdminDashboard, useLeadMaintainerDashboard).


### 9.3. Megjelenítési réteg


A components és pages mappák felelnek az UI-ért. A page komponensek meghívják a hookokat, majd a kapott adatokat továbbítják a kisebb, újrahasznosítható kártyáknak.



---



## 10. API réteg részletesen


### 10.1. axiosConfig.js


Feladata a közös axios instance létrehozása, 15000 ms timeout beállítása, JWT automatikus hozzáadása minden kéréshez és a 401 hibák központi kezelése.


### 10.2. authApi.js


Elérhető műveletek: registerUser, loginUser.


### 10.3. Speciális API Szolgáltatások


Minden szerepkörhöz tartozik egy külön API fájl, ami tartalmazza a szükséges hívásokat, pontosan illeszkedve a backend végpontokhoz.


### 10.4. GET kérés deduplikáció


A frontend már tartalmaz in-flight GET request deduplikációt. 
Ha ugyanaz a GET kérés egyszerre többször indulna el, a rendszer egy közös Promise-t használ, csökkentve az API-terhelést.



---



## 11. Státuszok és enum mapping


A backend a státuszokat számszerű enum értékként várja.


### Hibajegy státuszok


Open: 0, 

InProgress: 1,

Resolved: 2, 

Closed: 3.


### Rendelés státuszok


Pending: 0, 

InProgress: 1,

Completed: 2, 

Cancelled: 3.


A mapping a src/constants/statuses.js fájlban és a StatusBadge komponensben található, ez alapján színeződik a UI.



---



## 12. Custom hookok


A state-kezelés külön hookokba lett kiszervezve a tisztább kód érdekében.


### Dashboard hookok


Kezelik a különböző dashboardok teljes üzleti logikáját: 

useMaintainerDashboard,

useLeadMaintainerDashboard,

useAdminDashboard.


### Funkcionális hookok


useIssueSelection: A kiválasztott hibajegy állapotát kezeli, védve az elavult hálózati válaszok ellen.


useOrderRequestForm és useMountedRef: Segédhookok a rendelési űrlaphoz és a memóriaszivárgások elkerüléséhez.



---



## 13. Fő oldalak


### 13.1. Login oldal


Fájlok: 
pages/auth/LoginPage.jsx, components/auth/LoginForm.jsx. 

Jellemzők: 
backendes login, 4 darab demo belépési gomb a gyors teszteléshez.


### 13.2. Register oldal


Fájlok:
pages/auth/RegisterPage.jsx, components/auth/RegisterForm.jsx. 

Jellemzők: 
Neptun-kód alapú (fehérlistás) regisztráció, jelszó megerősítés.


### 13.3. Dashboardok (Maintainer, Lead, Admin)


Ezek az oldalak összefogják a metrikákat, a listákat és a részletek paneleket az adott szerepkörhöz igazítva.


### 13.4. Kollégista (User) Dashboard


Fájl: 

CollegiateDashboard.jsx. 

Füles navigációt biztosít a saját hibák és a visszajelzések kezeléséhez.


### 13.5. Forbidden oldal


Akkor jelenik meg, ha a bejelentkezett felhasználónak nincs joga az adott oldalhoz.



---



## 14. UI komponensek


### 14.1. Common és Dashboard komponensek


EmptyState, 

InfoMetric, 

LoadingCard, 

StatusBadge, 

DashboardMetricsRow.


### 14.2. Admin komponensek


EquipmentManagerCard, 

UserManagerCard, 

WhitelistManagerCard.


### 14.3. Issue komponensek


IssueCard, 

IssueDetailPanel, 

IssueFilterToolbar, 

IssueListContent és a szerepkör-specifikus Action komponensek.


### 14.4. Order komponensek


OrderCard,

OrderFilterToolbar,

OrderListContent,

OrderRequestForm és a LeadOrderActions.


### 14.5. Sidebar és Layout komponensek


AppShell (globális elrendezés),

MaintainerSidebar, 

LeadMaintainerSidebar.



---



## 15. Részletek panel


A IssueDetailPanel jelenleg a jobb oldali sávban jelenik meg.


Jelenlegi állapot: a panel már nem követi a teljes oldal görgetését, stabilabb vizuális élményt ad, és nagyon hosszú tartalom esetén önmagán belül válik mozgathatóvá.



---



## 16. Hibakezelés


A hibakezelés a src/utils/errors.js és src/utils/toast.js fájlokban van központosítva.


### createApiErrorMessage


Feladata: 401 és 403 hibák értelmes kezelése, timeout és hálózati hiba detektálása, backend validációs hibák összefűzése.


### Toast deduplikáció


A frontend nem engedi, hogy ugyanaz a hibaüzenet rövid időn belül többször egymás után jelenjen meg.



---



## 17. Keresés és szűrés


A dashboardokban kliensoldali szűrés és keresés működik, amely a src/utils/search.js segédfüggvényeire épül.


Tipikus felhasználások: hibajegy státusz szerinti szűrés, szabadszöveges keresés az adminisztrátori listákban, metrika-számlálók generálása.



---



## 18. Korábban javított hibák


A jelenlegi állapot tartalmazza a korábbi fontos javításokat:


### Navigáció és Állapot


Login utáni hibás jogosultsági átmenet javítva a biztonságos post-login route kiválasztással.


Hibajegy részletek villogása és folyamatos API-hívása javítva a stale request védelemmel.


### API kommunikáció


Státuszfrissítés hibája javítva: enum indexet küld a frontend string helyett.


Induláskori többszörös adatbetöltési hibák javítva GET és toast deduplikációval.



---



## 19. Jelenlegi backend függőségek és korlátok


### 19.1. ToolList lookup hiánya


A backend jelenlegi állapotában nincs külön tool lookup endpoint a rendelési űrlaphoz, ezért a frontend ideiglenesen seedelt eszközlistát használ.


### 19.2. Feltételezett backend végpontok


A frontend szorosan együttműködik az alábbi végpontcsoportokkal: auth, maintainer, lead-maintainer, Admin, collegiate.



---



## 20. Fejlesztési javaslatok a következő lépésekhez


### Rövid távon


User/kollégista és admin dashboardok további finomítása, részletek panel opcionális modal nézetté alakítása, loading skeleton komponensek bevezetése.


### Középtávon


TypeScriptre migrálás a típusbiztonságért, React Query bevezetése a cache-eléshez, API típusok és DTO-k egységesítése.


### Hosszú távon


Szerepkörönként teljes UI lefedettség, valós idejű frissítések, audit log felület és többnyelvűség támogatása.



---



## 21. Hibaelhárítás


### A backend nem érhető el


Tünet: a login nem működik, hálózati hibás toast jelenik meg. Ellenőrizd: fut-e a backend, helyes-e a VITE_API_BASE_URL környezeti változó.


### 401 / lejárt munkamenet


Tünet: hirtelen visszadob a login oldalra. Megoldás: jelentkezz be újra.


### Build hiba helyi környezetben


Futtasd újra a környezet tisztítását:

rm -rf node_modules package-lock.json

npm install

npm run dev



---



## 22. Fontosabb fájlok gyors áttekintése


Fő belépési pontok: 

src/App.jsx (route-ok),

src/layout/AppShell.jsx (elrendezés).


Állapotkezelés: 

src/context/AuthContext.jsx (auth állapot), 

src/hooks/ (dashboard logikák).


Kommunikáció és segédek: 

src/api/axiosConfig.js (axios kliens), 

src/utils/errors.js (hibakezelés).



---



## 23. Összegzés


A jelenlegi frontend állapot egy már jól használható, átlátható, továbbfejleszthető alap a HibaVonal rendszerhez. Fő erősségei a tiszta komponensstruktúra, hookokra szervezett state-kezelés, javított navigáció és átgondoltabb hibakezelés mind a négy fő szerepkörben.



---



## 24. Ajánlott induló lépések új fejlesztőnek


1. npm install


2. .env létrehozása a helyes backend URL-lel


3. backend elindítása (DbSeeder lefutásával)


4. npm run dev


5. bejelentkezés valamelyik demo felhasználóval (pl. leadmaintainer1)


6. hibajegyek és folyamatok végigkattintása a rendszerben



---



## 25. Demo belépési adatok


A login oldalon gombnyomásra kitölthető minta profilok (jelszó mindenhol: jelszo123):


- Kollégista (User): user1


- Karbantartó: maintainer1


- Vezető karbantartó: leadmaintainer1


- Adminisztrátor: admin1


Ezek a fiókok csak akkor működnek, ha a backend seed folyamata sikeresen lefutott.
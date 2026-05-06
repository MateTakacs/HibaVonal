# HibaVonal - Teljes Rendszer (Full-Stack)


Ez a projekt a HibaVonal kollégiumi karbantartási rendszer fő repozitóriuma.


A rendszer két fő részből áll: egy .NET alapú Backend API-ból és egy React + Vite alapú Frontend kliensből.


A cél a kollégiumi hibabejelentések, karbantartási folyamatok, eszközrendelések és felhasználók teljes körű, modern és biztonságos, szerepkör-alapú (Admin, User, Maintainer, Lead Maintainer) kezelése.



---



## 1. Jelenlegi állapot röviden


A rendszer teljes, kliens-szerver architektúrában működik:


A Backend (C# .NET) felel az üzleti logikáért, a JWT hitelesítésért, az adatbázis-kapcsolatért (Entity Framework Core) és az adatbázis kezdőadatokkal való feltöltéséért (DbSeeder).


A Frontend (React) felel a reszponzív UI-ért, a kliensoldali állapotkezelésért (custom hookok), a deduplikált API hívásokért és a vizuális hibakezelésért.



---



## 2. Technológiai stack


### Backend


- .NET 8 (C#) REST API


- Entity Framework Core (Adatelérés és Migrációk)


- JWT Authentication (Bearer tokenek)


- Swagger / OpenAPI (Dokumentáció)


### Frontend


- React 19 és Vite 8


- React Router DOM 7


- Axios (HTTP kliens interceptorokkal)


- Bootstrap 5 és React Toastify



---



## 3. Futtatás


### 3.1. Előfeltételek


Node.js (18+), npm, valamint a .NET 8 SDK telepítése szükséges. Egy adatbázis-kiszolgáló (pl. SQL Server vagy SQLite, konfigurációtól függően) is kell.


### 3.2. Backend elindítása


Navigálj a backend mappába, futtasd az adatbázis migrációkat (dotnet ef database update), majd indítsd el a szervert a `dotnet run` paranccsal.


### 3.3. Frontend elindítása


Navigálj a frontend mappába, telepítsd a függőségeket az `npm install` paranccsal, majd indítsd a klienst az `npm run dev` paranccsal.



---



## 4. Környezeti változók


### Backend (appsettings.json)


Itt kell megadni a ConnectionStringet az adatbázishoz, a JWT titkosítási kulcsokat és az engedélyezett CORS beállításokat.


### Frontend (.env)


A frontend a VITE_API_BASE_URL környezeti változót használja (alapértelmezés: https://localhost:7218), hogy tudja, hova küldje a kéréseket.



---



## 5. Bejelentkezés és jogosultságkezelés


A rendszer JWT (JSON Web Token) alapú hitelesítést használ.


### Backend oldal


A bejelentkezési végpont ellenőrzi a hitelesítő adatokat, majd legenerálja a tokent, belesütve a felhasználó adatait és szerepkörét (Role). Az útvonalakat az `[Authorize(Roles = "...")]` attribútumok védik.


### Frontend oldal


A sikeres bejelentkezés után a token a localStorage-ba kerül. Az AuthContext kezeli a bejelentkezett állapotot, és az Axios interceptorok minden további kéréshez automatikusan hozzácsatolják a tokent.



---



## 6. Útvonalak és Végpontok


### Backend API Végpontok


Az API jól szegmentált kontrollerekből áll: AuthController, AdminController, MaintainerController, LeadMaintainerController, CollegiateController.


### Frontend Route-ok


Szigorúan védett navigációs útvonalak: /login (publikus), /collegiate, /maintainer, /lead-maintainer, /admin (védett, szerepkörhöz kötött dashboardok).



---



## 7. Támogatott szerepkörök a rendszerben


### Adminisztrátor (Admin)


Teljes hozzáférés a felhasználókhoz, az eszközleltárhoz és a regisztrációs fehérlistához (whitelist).


### Kollégista (User)


Saját hibák bejelentése a szobához tartozó eszközökre szűrve, valamint visszajelzések (feedback) küldése.


### Karbantartó (Maintainer)


Saját, kiosztott feladatok státuszának módosítása és eszközrendelési igények feladása.


### Vezető karbantartó (Lead Maintainer)


Az összes hibajegy kezelése, karbantartókhoz való kiosztása, és a rendelések véglegesítése.



---



## 8. Projektstruktúra


A fő repozitórium két fő mappára oszlik:


/backend: A .NET Web API projekt, a Modellek, a DTO-k, a DbContext és a Szervizek (Services).


/frontend: A Vite + React alkalmazás, az axios hívások (api), a UI komponensek (components) és a logikai hookok (hooks).



---



## 9. Architektúra áttekintés


A HibaVonal egy klasszikus Single Page Application (SPA) + REST API architektúra.


A frontend egy statikus fájlhalmazként is kiszolgálható, amely aszinkron JSON kommunikációt folytat a skálázható, állapotmentes (stateless) .NET backenddel.



---



## 10. API és Kommunikációs réteg


### Backend


RESTful elvek alapján épül fel, megfelelő HTTP státuszkódokkal (200, 400, 401, 403, 404) és DTO (Data Transfer Object) validációval válaszol.


### Frontend


A frontend Axios-t használ a kommunikációra, beépített GET kérés deduplikációval a párhuzamos lekérések minimalizálására.



---



## 11. Státuszok és enum mapping


A rendszer adatbázisa és a backend API memóriahatékony Integer (szám) alapú Enumokat használ.


Hibajegyek: 0 = Open, 1 = InProgress, 2 = Resolved, 3 = Closed.


Rendelések: 0 = Pending, 1 = InProgress, 2 = Completed, 3 = Cancelled.


A frontend ezeket a számokat fordítja le színes (Bootstrap) szöveges jelvényekké a felhasználói felületen.



---



## 12. Üzleti Logika (Szervizek és Hookok)


### Backend (Services)


A kontrollerek nem tartalmaznak üzleti logikát, azt a Dependency Injectionnel injektált szervizosztályok végzik (pl. IssueService, OrderService).


### Frontend (Custom Hooks)


A komponensek állapotát és az API hívások szervezését egyedi React Hookok végzik (pl. useLeadMaintainerDashboard, useIssueSelection).



---



## 13. Fő képernyők és funkciók


### Autentikáció


Regisztráció (csak backend által jóváhagyott, fehérlistás Neptun-kóddal) és Bejelentkezés.


### Dashboardok


Minden szerepkörhöz dedikált nézet tartozik, ahol a felhasználó a rá vonatkozó metrikákat (nyitott jegyek, elköltött összeg, stb.) és listákat látja.



---



## 14. Felhasználói Felület (UI) komponensek


A frontend moduláris, újrahasznosítható komponensekből épül fel.


Közös elemek: StatusBadge, InfoMetric, LoadingCard.


Specifikus elemek: IssueCard a hibajegyekhez, OrderRequestForm a rendelésekhez, és a különböző Manager kártyák az adminisztrációnak.



---



## 15. Részletes nézetek és adatbetöltés


A rendszer támogatja a master-detail nézetet. A bal oldali listából (Master) kiválasztott elem a jobb oldali panelen (Detail - IssueDetailPanel) jelenik meg teljes részletességében.


A panel belső görgetéssel rendelkezik, így hosszú szövegeknél sem törik szét az oldal elrendezése.



---



## 16. Hibakezelés (Full-Stack)


### Backend


A .NET alkalmazás központi Exception Handling middleware-rel kapja el a szerverhibákat, és egységes JSON hibaüzenetet ad vissza.


### Frontend


A `errors.js` értelmezi a backend válaszait, a `toast.js` pedig gondoskodik róla, hogy a vizuális értesítések (Toastify) ne halmozódjanak fel feleslegesen (deduplikáció).



---



## 17. Keresés és szűrés


A rendszer jelenleg hibrid szűrést alkalmaz.


Egyes lekérdezéseknél (pl. "Csak kiosztatlan hibák") a backend végzi el a LINQ alapú szűrést az adatbázisban.


Más esetekben (pl. szabadszöveges keresés a leírásban) a frontend szűri az in-memory letöltött adatokat a gyorsabb válaszidő érdekében.



---



## 18. Korábbi integrációs javítások


A két rendszer összehangolása során javítva lettek az alábbiak:


- CORS (Cross-Origin Resource Sharing) házirendek pontos beállítása a backend oldalon.


- Enumok helyes JSON szerializációja a .NET és a React között.


- 401 Unauthorized hibák elegáns lekezelése kliens oldali automatikus kiléptetéssel.



---



## 19. Jelenlegi függőségek és korlátok


### Adatbázis Seeding (DbSeeder)


Az induláshoz a backend egy DbSeeder osztályt futtat, amely feltölti az adatbázist a tesztfelhasználókkal, teszteszközökkel és a whitelisttel.


### Végpont hiányosságok


Bizonyos dinamikus lookup-ok (pl. rendelhető szerszámok listája) esetén a frontend jelenleg a beégetett (seedelt) adatokat használja, amíg a dedikált backend végpont el nem készül hozzá.



---



## 20. Fejlesztési javaslatok a jövőre


### Backend


- SignalR bevezetése a valós idejű WebSocket alapú frissítésekhez (pl. értesítés, ha egy karbantartó új feladatot kap).


- EF Core Query optimalizációk és lapozás (Pagination) megvalósítása a listáknál.


### Frontend


- TypeScript integráció az API DTO-k pontos leképezéséhez kliens oldalon.


- React Query használata a még intelligensebb adatszinkronizációhoz.



---



## 21. Hibaelhárítás


### CORS hiba a konzolban


Ellenőrizd, hogy a backend `Program.cs` fájljában a CORS policy engedélyezi-e a frontend futási URL-jét (általában localhost:5173).


### Adatbázis csatlakozási hiba


Ellenőrizd a backend `appsettings.json` fájljában a ConnectionStringet, és futtasd le a `dotnet ef database update` parancsot.


### Kliens nem tölt be


Töröld a frontend `node_modules` mappáját és futtass `npm install` parancsot.



---



## 22. Fontosabb fájlok gyors áttekintése


### Backend


- `Program.cs`: Szervizek, JWT és Middleware konfigurációk.


- `DbContext`: Entity Framework adatbázis kapcsolat.


### Frontend


- `App.jsx`: Központi React útvonalválasztó.


- `axiosConfig.js`: Az API hívások alapbeállításai és interceptorai.



---



## 23. Összegzés


A HibaVonal Full-Stack rendszere egy jól strukturált, modern technológiákra épülő megoldás.


A .NET Backend biztosítja az adatbiztonságot, az integritást és a teljesítményt, míg a React Frontend felel a sima, megszakítások nélküli és reszponzív felhasználói élményért mind a négy jogosultsági szinten.



---



## 24. Ajánlott induló lépések


1. Húzd le a kódot és ellenőrizd az előfeltételeket (Node.js, .NET SDK).


2. Lépj a backend könyvtárba, futtasd a migrációkat és indítsd el a szervert.


3. Győződj meg róla, hogy a konzol kiírta a "DbSeeder lefutott" üzenetet.


4. Lépj a frontend könyvtárba, telepíts npm-mel és indítsd el a fejlesztői szervert.


5. A böngészőben próbáld ki a teljes folyamatot a regisztrációtól a hibajegy kiosztásáig.



---



## 25. Demo belépési adatok


A DbSeeder által generált és a frontend login oldalán egy gombnyomással is elérhető profilok (az alapértelmezett jelszó mindenhol: jelszo123):


- Kollégista (User): user1


- Karbantartó: maintainer1


- Vezető karbantartó: leadmaintainer1


- Adminisztrátor: admin1

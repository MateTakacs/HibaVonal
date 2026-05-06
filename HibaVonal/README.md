# HibaVonal – Teljes Backend Dokumentáció és Fejlesztői Kézikönyv


A **HibaVonal** rendszer célja a kollégiumban felmerülő hibajelentések és 
karbantartási folyamatok teljes körű digitális kezelése. A projekt Entity 
Framework Core használatával működik, robusztus, N-rétegű architektúrára 
építve, amely garantálja a skálázhatóságot, a biztonságot és a könnyű 
továbbfejleszthetőséget.

---

## 1. Architektúra és Tervezési Minták


A backend nem egy monolitikus, "minden egy helyen" spagettikód, hanem a modern 
.NET fejlesztési elveknek megfelelő, rétegekre bontott (N-Tier) alkalmazás.

*   **Dependency Injection (Függőség-befecskendezés):** A rendszer magja. 
    A `Program.cs`-ben minden szolgáltatás (Service) beregisztrálásra kerül 
    (pl. `AddScoped<IIssueService, IssueService>()`), így a memóriakezelés és 
    a tesztelhetőség optimális.

*   **Repository minta helyett EF Core:** Mivel az Entity Framework Core 
    önmagában is megvalósítja a Repository és Unit of Work mintákat (a 
    `DbContext` és a `DbSet` révén), az architektúra nem vezet be felesleges 
    absztrakciós rétegeket, hanem a Service-ek közvetlenül a Context-et hívják.

*   **Aszinkron programozás:** Minden adatbázis-művelet és I/O kérés 
    `async/await` mintára épül. Ez megakadályozza a szálak blokkolását 
    (Thread Starvation), így az API nagy terhelés alatt is válaszképes marad.

*   **AsNoTracking optimalizáció:** A lekérdezéseknél (ahol nem történik 
    adatmódosítás), a Service-ek az `.AsNoTracking()` metódust használják. 
    Ez jelentősen csökkenti a memóriaigényt, mivel az EF Core nem követi 
    nyomon az objektumok állapotát.

---

## 2. Új service réteg


A teljes üzleti logika nem közvetlenül a controller-ekben lett megvalósítva, 
hanem külön, jól tesztelhető service rétegben. Ez biztosítja a 
"Vékony Controller - Kövér Service" (Thin Controller - Fat Service) elvet.

**Új interface-ek:**

*   `IAuthService`

*   `IAdminService`

*   `IIssueService`

*   `IFeedbackService`

*   `IMaintainerService`

*   `ILeadMaintainerService`

**Új implementációk:**

*   **AuthService:** a bejelentkezésért, regisztrációért és a JWT tokenek 
    generálásáért.

*   **AdminService:** a hardverek, felhasználói szerepkörök és a regisztrációs 
    whitelist kezeléséért.

*   **IssueService & FeedbackService:** a kollégisták hibabejelentéseiért és 
    visszajelzéseiért.

*   **MaintainerService & LeadMaintainerService:** a hibajegyek karbantartóhoz 
    rendeléséért, a státuszok módosításáért és az anyagrendelések kezeléséért.

---

## 3. Hibakezelési Stratégia


A rendszer a hagyományos (és erőforrás-igényes) Exception-dobálás helyett 
egy elegáns **Tuple visszatérési mintát** alkalmaz a Service rétegben.

*   **Működés:** Minden Service metódus egy strukturált válasszal tér vissza, 
    például: `Task<(bool Success, string Message, IssueResponse? Issue)>`.

*   **Előny:** A Controller egyszerűen megvizsgálja a `Success` flag-et. Ha 
    hamis, egy `BadRequest(Message)` HTTP 400-as választ ad vissza, így a 
    frontend mindig tiszta, felhasználóbarát hibaüzenetet kap a nyers 
    szerverhibák (HTTP 500) helyett.

---

## 4. Új controller-ek


*   **AuthController:** A publikus végpontok (login, regisztráció). Semmilyen 
    hitelesítést nem igényel.

*   **AdminController:** Az adminisztrátorhoz tartozó végpontok. Kizárólag 
    `Admin` szerepkörrel érhető el.

*   **IssueController & FeedbackController:** A kollégistákhoz (User) tartozó 
    végpontok. Csak a saját szobájuk adatait és a saját hibáikat érhetik el.

*   **MaintainerController:** A karbantartóhoz tartozó végpontok. Szigorúan 
    validálja, hogy a karbantartó csak a saját maga által felvett vagy 
    hozzárendelt jegyeket láthassa.

*   **LeadMaintainerController:** A karbantartási vezetőhöz tartozó végpontok. 
    Teljes rálátás az üzemeltetésre.

*   **AuthorizedControllerBase:** Közös absztrakt alaposztály az autentikált 
    controllerekhez. Tartalmazza a `GetCurrentUserId()` metódust, amely 
    biztonságosan és hamisíthatatlanul nyeri ki a tokenből a bejelentkezett 
    felhasználó ID-ját.

---

## 5. DTO-k (Data Transfer Objects)


A tisztább API, az adatszivárgás elkerülése és a jobb szeparáció érdekében 
a rendszer DTO-kat használ a kommunikációra. Az adatbázis entitások 
(pl. a jelszóhasheket is tartalmazó `User` tábla) SOHA nem hagyják el a szervert.

*   **Kérés DTO-k (Requests):** Immutable (megváltoztathatatlan) `record` 
    típusok, pl. `LoginRequest`, `CreateIssueRequest`. A `record` használata 
    memóriahatékony és szálbiztos.

*   **Válasz DTO-k (Responses):** A kliens számára szükséges, formázott adatokat 
    tartalmazzák, pl. `IssueResponse`, `OrderResponse`.

*   **Leképezés (Mapping):** A konverzió az entitások és a DTO-k között az 
    `Extensions` mappában lévő kiterjesztő metódusokkal történik 
    (pl. `ToManagementResponse()`), így a Service réteg kódja tiszta marad.

---

## 6. Adatbázis Séma és Kapcsolatok


A `HibaVonalDBContext` a következő kulcsfontosságú relációkat definiálja 
a háttérben:

*   **User (1) ➔ Issue (N):** Egy felhasználó több hibát jelenthet be 
    (`ReporterId`), és egy karbantartóhoz több hiba lehet hozzárendelve 
    (`AssignedMaintainerId`).

*   **Room (1) ➔ Issue (N):** Egy szobához több hibajegy is tartozhat.

*   **Room (N) ↔ Equipment (M):** Több-a-többhöz kapcsolat a `RoomEquip` 
    kapcsolótáblán keresztül. Egy szobában több eszköz van, egy eszköztípus 
    több szobában is megtalálható.

*   **Issue (1) ➔ Feedback (1):** Minden megoldott hibajegyhez egy szöveges 
    visszajelzés csatolható a bejelentő által.

*   **ToolList (1) ➔ Order (N):** A raktárból elérhető alkatrészekből 
    (ToolList) több megrendelés (Order) is leadható.

---

## 7. Seed rendszer


A fejlesztés és tesztelés felgyorsításához egy automatikus adatbázis seed 
(feltöltő) mechanizmus került kialakításra.

*   **Külön seed fájl:** `HibaVonal.DataContext/Seed/DbSeeder.cs`

*   **Külön inicializáló extension:** 
    `HibaVonal/Extensions/DatabaseInitializationExtensions.cs`

**Program indulásakor lefutó folyamat:**

*   Az alkalmazás létrehoz egy egyedi Service Scope-ot.

*   Ellenőrzi az adatbázis meglétét, és lefutnak az EF Core migrációk 
    (`MigrateAsync`).

*   Ha a `Users` tábla üres, lefut a seed, és feltölti a rendszert 
    tesztadatokkal.

**Generált tesztadatok:**

*   **Szobák:** 101, 102, 201

*   **Eszközök:** Csap, Lámpa, Radiátor (hozzárendelve a szobákhoz)

*   **Felhasználók:** `leadmaintainer1`, `maintainer1`, `maintainer2`, 
    `user1`, `user2`, `admin1` (alapértelmezett jelszó a kódból)

*   **ToolList elemek:** Bosch, Makita, DeWalt

*   **Hibajegyek & Rendelések:** Különböző státuszú entitások a UI teszteléséhez 
    (Open, InProgress, Resolved stb.).

---

## 8. Implementált szerepkörök és jogosultságok


### Admin


Az adminisztrátor a rendszer technikai felügyelője:

*   Lekérheti a felhasználókat, és dinamikusan módosíthatja a szerepkörüket 
    (`PUT /role`).

*   Bővítheti vagy szűkítheti a leltári hardverparkot (`Equipment`).

*   A regisztrációs kapuőre: csak az általa a `RegAllow` táblába felvett 
    Neptun-kódok regisztrálhatnak a felületen.

### User / Kollégista


A kollégium lakója, aki a hibákat tapasztalja:

*   Új hibajegyet rögzíthet, szigorúan csak a saját szobájához kapcsolódóan 
    (ezt a backend a profilja alapján ellenőrzi).

*   Megtekintheti a szobájában található leltári tárgyakat.

*   Szöveges visszajelzést (Feedback) küldhet a `Resolved` (Megoldott) 
    státuszú hibákról.

### Maintainer


A helyszíni karbantartó, aki a munkát végzi:

*   Csak a kifejezetten hozzá rendelt (`Assigned`) hibákat láthatja.

*   Státuszt léptethet (pl. Folyamatban lévőre, vagy Megoldottra).

*   Ha munka közben hiányzik egy alkatrész, a rendszerből közvetlen anyagigényt 
    / megrendelést (`OrderRequest`) rögzíthet a vezető felé.

### Lead Maintainer


A karbantartási vezető (Diszpécser):

*   Teljes helikopter-nézettel rendelkezik: az összes hibajegyet látja.

*   Szűrheti a még "kiosztatlan" (Unassigned) jegyeket.

*   Delegálja a feladatokat az elérhető karbantartóknak (`Assign`).

*   Felülbírálhatja a státuszokat.

*   Jóváhagyja, vagy elutasítja a karbantartók által leadott 
    alkatrész-rendeléseket.

---

## 9. JWT + SWAGGER (Hitelesítés tesztelése)


A Swagger UI be van kötve a JWT (JSON Web Token) hitelesítéshez, így a 
védett végpontok is könnyen tesztelhetők.

*   Hívd meg a `POST /api/auth/login` végpontot a tesztadatokkal.

*   Másold ki a válaszban kapott `token` string-et.

*   Kattints a Swagger felület tetején lévő **Authorize** gombra.

*   A mezőbe a következő formátumban illeszd be a tokent: 
    `Bearer IDE_A_TOKEN_SZÖVEGE`

*   **Kritikus pont:** A `Bearer` szó és az utána lévő egy darab szóköz 
    kötelező, anélkül a .NET visszautasítja a kérést (401 Unauthorized)!

---

## 10. Főbb végpontok referenciája


### Auth végpontok (Publikus)


*   `POST /api/auth/register` - Új fiók létrehozása (csak whitelist-es 
    Neptun-kóddal).

*   `POST /api/auth/login` - Bejelentkezés és JWT token igénylése.

### Admin végpontok


*   `GET /api/admin/users` - Rendszerben lévő összes felhasználó listázása.

*   `PUT /api/admin/users/{userId}/role` - Jogosultsági szint módosítása.

*   `POST /api/admin/equipment` - Új eszköz bevezetése a leltárba.

*   `POST /api/admin/whitelist` - Új diák/dolgozó Neptun-kódjának engedélyezése.

### User / Kollégista végpontok (Collegiate)


*   `GET /api/collegiate/issues` - A bejelentkező diák saját hibajegyei.

*   `POST /api/collegiate/issue` - Hibajegy leadása (szobaszám validálással).

*   `GET /api/collegiate/rooms/{roomNum}/equipments` - A szobában lévő berendezések.

*   `POST /api/collegiate/feedback` - Értékelés beküldése a javításról.

### Maintainer végpontok


*   `GET /api/maintainer/issues` - Napi feladatlista (saját jegyek).

*   `PATCH /api/maintainer/issues/{id}/status` - Munkafolyamat állapotának 
    frissítése.

*   `POST /api/maintainer/orders` - Anyagbeszerzési igény leadása.

### Lead Maintainer végpontok


*   `GET /api/lead-maintainer/issues?onlyUnassigned=true` - A kiosztásra váró 
    feladatok listája.

*   `PATCH /api/lead-maintainer/issues/{id}/assign` - Munka delegálása egy 
    karbantartónak.

*   `PATCH /api/lead-maintainer/orders/{id}/status` - Anyagrendelés jóváhagyása 
    (`Completed`) vagy elutasítása (`Cancelled`).

---

## 11. Bővítési és Fejlesztési Útmutató (Contributor Guide)


Ha egy új funkciót vagy modult szeretnél a backendhez adni, az alábbi 
szigorú sorrendet kövesd az architektúra tisztaságának megőrzése érdekében:

*   **1. Adatbázis (Entity):** Hozd létre az új entitás osztályt a 
    `DataContext/Entities` mappában. Add hozzá a `DbSet`-et a 
    `HibaVonalDBContext`-hez. Futtass egy migrációt.

*   **2. DTO-k:** Hozd létre a kommunikációs objektumokat (Request és 
    Response `record`-ok) a `Services/DTOs` mappában.

*   **3. Interface:** Definiáld a szerződést (függvényfejléceket) a 
    `Services/Interfaces` mappában.

*   **4. Service:** Készítsd el az üzleti logikát a `Services/Implementations` 
    mappában. Ne felejtsd el a metódusokat tuple visszatérési értékkel 
    ellátni az elegáns hibakezeléshez.

*   **5. Dependency Injection:** Regisztráld be az új Service-t a 
    `Program.cs`-ben (pl. `builder.Services.AddScoped<IUjService, UjService>();`).

*   **6. Controller:** Végül hozd létre a Controllert, injektáld be a 
    Service-t a konstruktorban, és definiáld a HTTP végpontokat megfelelő 
    `[Authorize]` annotációkkal.

---

## 12. Gyakori hibák és hibaelhárítás (Troubleshooting)


*   **Hiba:** `A network-related or instance-specific error occurred...` 
    (SQL hiba).
    **Megoldás:** A backend nem éri el az adatbázist. Ellenőrizd, hogy fut-e 
    az SQL Server, és helyes-e a jelszó/szervernév az `appsettings.json` 
    fájlban.

*   **Hiba:** HTTP 401 Unauthorized minden végponton.
    **Megoldás:** Lejárt a JWT token (alapértelmezetten 120 percig érvényes), 
    vagy elfelejtetted a Swaggerben a `Bearer ` szót a token elé írni.

*   **Hiba:** `CORS policy blocked the request` (Frontendről hívva).
    **Megoldás:** A `Program.cs`-ben a CORS policy jelenleg a 
    `http://localhost:5173` címről enged be kéréseket. Módosítsd szükség szerint.

*   **Hiba:** A migráció elakad vagy összeomlik.
    **Megoldás:** Töröld az adatbázist (`dotnet ef database drop`), töröld 
    a `Migrations` mappát, majd indíts egy tiszta lappal: 
    `dotnet ef migrations add InitialCreate` és `dotnet ef database update`.

---

## 13. Roadmap / Továbbfejlesztési lehetőségek


A rendszer jövőbeni bővítésére az alábbi pontok vannak betervezve:

*   **Global Exception Handling:** Egy egyedi Middleware írása a nem kezelt 
    (HTTP 500) kivételek elkapására és egységes JSON hibaüzenetté formázására.

*   **Fájlfeltöltés:** A `CreateIssueRequest` kibővítése IFormFile támogatással, 
    hogy a diákok képeket csatolhassanak a törött berendezésekről.

*   **Korszerű naplózás:** Serilog integrálása a konzolos naplózás helyett, 
    a hibák strukturált fájlba vagy adatbázisba írása céljából.

*   **Valós idejű értesítések:** SignalR (WebSockets) bevezetése a feladatok 
    azonnali, böngészőfrissítés nélküli kijelzéséhez.

---

## 14. Javasolt tesztelési sorrend


A rendszer logikájának megértéséhez az alábbi tesztelési útvonal 
javasolt a Swagger felületén:

**Maintainer teszt**

1.  Login `maintainer1` userrel.

2.  Token bemásolása Swagger Authorize mezőbe (Bearer + token).

3.  `GET /api/maintainer/issues` (Lekéri a mai feladatait).

4.  `GET /api/maintainer/issues?status=0` (Szűrés újakra).

5.  `PATCH /api/maintainer/issues/{id}/status` (Átállítja InProgress-re 
    a munkát).

6.  `POST /api/maintainer/orders` (Kiderül, hogy kell egy alkatrész, 
    megrendeli).

**Lead Maintainer teszt**

1.  Login `leadmaintainer1` userrel.

2.  Token bemásolása Swagger Authorize mezőbe.

3.  `GET /api/lead-maintainer/issues?onlyUnassigned=true` (Megnézi, van-e 
    gazdátlan hiba).

4.  `GET /api/lead-maintainer/maintainers` (Lekéri, ki ér rá).

5.  `PATCH /api/lead-maintainer/issues/{id}/assign` (Kiostja a hibát a 
    karbantartónak).

6.  `GET /api/lead-maintainer/orders` (Meglátja a karbantartó igényét).

7.  `PATCH /api/lead-maintainer/orders/{id}/status` (Jóváhagyja a rendelést).

---

## 15. Futtatás lépésről lépésre a nulláról


Az alkalmazás indítása és tesztelése a nulláról az alábbi lépésekben történik:

**1. Előfeltételek ellenőrzése**

*   Telepített **.NET 8 SDK** (vagy újabb).

*   Telepített **SQL Server** (vagy LocalDB / Docker konténer).

**2. Projekt klónozása és navigáció**

*   Lépj be a backend projekt gyökérmappájába a parancssorban (ahol a `.sln` 
    vagy a fő `.csproj` fájl található).

**3. Konfiguráció beállítása**

*   Nyisd meg az `appsettings.json` fájlt.

*   Ellenőrizd a `ConnectionStrings:DefaultConnection` beállítást, és 
    módosítsd a saját SQL Servered elérhetőségére.

**4. Csomagok helyreállítása**

*   Futtasd az alábbi parancsot a hiányzó NuGet csomagok letöltéséhez:
    `dotnet restore`

**5. Adatbázis létrehozása és Migrációk futtatása**

*   Mivel a `Program.cs` már tartalmazza a migrációk és a seed futtatását 
    induláskor, a hagyományos parancs ki is hagyható, de ha manuálisan 
    szeretnéd frissíteni a sémát:
    `dotnet ef database update`

**6. Alkalmazás elindítása**

*   Indítsd el a szervert a beépített parancs segítségével:
    `dotnet run`

*(Megjegyzés: Az első induláskor pár másodperccel tovább tarthat a 
folyamat, mivel a háttérben létrejön az adatbázis és lefut a seedelés.)*

**7. Swagger megnyitása és Tesztelés**

*   Nyisd meg a böngészőt.

*   Keresd fel a terminálban kiírt URL-t a `/swagger` végződéssel 
    (pl.: `https://localhost:7218/swagger`).

*   Használd a 14-es pontban lévő tesztelési sorrendet a rendszer 
    kipróbálásához!
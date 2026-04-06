# HibaVonal – Maintainer és Lead Maintainer backend bővítés

## Projekt rövid leírás

A **HibaVonal** rendszer célja a kollégiumban felmerülő hibajelentések és karbantartási folyamatok kezelése.  
A rendszer több szerepkört kezel:

- **User / Kollégista**
- **Maintainer / Karbantartó**
- **Lead Maintainer / Karbantartási vezető**
- **Admin**

---

# Megvalósított backend részek

## 1. Új service réteg

A logika nem közvetlenül a controller-ekben lett megvalósítva, hanem külön service rétegben.

### Új interface-ek
- `IMaintainerService`
- `ILeadMaintainerService`

### Új implementációk
- `MaintainerService`
- `LeadMaintainerService`

Ezek felelősek:
- a hibajegyek lekérdezéséért
- a státuszok módosításáért
- a hibák karbantartóhoz rendeléséért
- a rendelések kezeléséért
- a vezetői lekérdezésekért

---

## 2. Új controller-ek

### MaintainerController
A karbantartóhoz tartozó végpontok.

### LeadMaintainerController
A karbantartási vezetőhöz tartozó végpontok.

### AuthorizedControllerBase
Közös alaposztály az autentikált controllerekhez.

---

## 3. DTO-k

A tisztább API és jobb szeparáció érdekében DTO-k kerültek bevezetésre.

Példák:
- issue lekérdezési DTO-k
- státuszfrissítő DTO-k
- hozzárendelési DTO-k
- rendelési DTO-k

---

## 4. Seed rendszer

A teszteléshez automatikus adatbázis seed került kialakításra.

### Külön seed fájl
- `HibaVonal.DataContext/Seed/DbSeeder.cs`

### Külön inicializáló extension
- `HibaVonal/Extensions/DatabaseInitializationExtensions.cs`

### Program indulásakor
A program indulásakor:
1. lefutnak a migrációk
2. létrejön az adatbázis, ha még nincs
3. lefut a seed

---

# Implementált szerepkörök és jogosultságok

## Maintainer
A karbantartó:
- lekérheti a hozzá rendelt hibákat
- lekérheti egy adott hibajegy részleteit
- módosíthatja a hozzá rendelt hibák státuszát
- lekérheti a rendeléseket
- új rendelést rögzíthet

## Lead Maintainer
A karbantartási vezető:
- lekérheti az összes hibát
- szűrheti a hibákat státusz vagy kiosztottság szerint
- lekérheti az elérhető karbantartókat
- hozzárendelhet hibát karbantartóhoz
- módosíthat hibastátuszt
- kezelheti a rendeléseket
- rendelés státuszt módosíthat

---

# Adatbázis és EF Core

A projekt **Entity Framework Core** használatával működik.

A `HibaVonalDBContext` felel az adatbáziskapcsolatért és az entitások kezeléséért.

## Fontos
Az adatbázis nem csak az entity osztályoktól jön létre.  

A projekt jelenlegi megoldásában az alkalmazás indulásakor automatikusan lefut:

- `db.Database.MigrateAsync()`
- `DbSeeder.SeedAsync(db)`

---

# Seed működése

A seed célja, hogy az alkalmazás első indulás után azonnal tesztelhető legyen.

A `DbSeeder` az alábbi mintaadatokat hozza létre:

## Szobák
- 101
- 102
- 201

## Eszközök
- Csap
- Lámpa
- Radiátor

## Szoba-eszköz kapcsolatok
A különböző szobákhoz mintaként hozzá vannak rendelve eszközök.

## Felhasználók
- `leadmaintainer1`
- `maintainer1`
- `maintainer2`
- `user1`
- `user2`
- `admin1`

## ToolList elemek
- Bosch
- Makita
- DeWalt

## Hibajegyek
Több különböző státuszú hibajegy:
- Open
- InProgress
- Resolved
- Closed
- Assigned
- Unassigned

## Rendelések
Több különböző státuszú rendelés:
- Pending
- InProgress
- Completed
- Cancelled

---

# Program indulási logika

A `Program.cs` úgy lett módosítva, hogy induláskor lefusson az adatbázis inicializálás.

## Lépések induláskor
1. alkalmazás felépül
2. létrejön egy scope
3. lekéri a `HibaVonalDBContext` példányt
4. lefut a migráció
5. lefut a seed

A `Program.cs` a seed logikát nem tartalmazza közvetlenül, csak meghívja az inicializáló extensiont.

Ez tisztább és jobban szeparált megoldás.

---

# Futtatás lépésről lépésre

## 1. Connection string beállítása

Példa `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HibaVonalDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "ez-egy-legalabb-32-karakteres-fejlesztoi-kulcs",
    "Issuer": "HibaVonal",
    "Audience": "HibaVonalUsers"
  }
}

# Maintainer és Lead Maintainer backend API-k

Ez a kiegészítés a meglévő projektbe illeszti be a **Maintainer** és **Lead Maintainer** szerepkörök backend API-jait.

## Főbb elemek

- külön service réteg a két szerepkörnek
- role alapú védelem JWT + `[Authorize(Roles = ...)]`
- EF Core alapú lekérdezések `Include`, `AsNoTracking`, szűrés és rendezés használatával
- külön DTO-k a maintenance use case-ekhez
- külön controller a karbantartónak és a karbantartási vezetőnek

## Új végpontok

### Maintainer

- `GET /api/maintainer/issues?status=InProgress`
- `GET /api/maintainer/issues/{id}`
- `PATCH /api/maintainer/issues/{id}/status`
- `GET /api/maintainer/orders?status=Pending`
- `POST /api/maintainer/orders`

### Lead Maintainer

- `GET /api/lead-maintainer/issues?status=Open&onlyUnassigned=true`
- `GET /api/lead-maintainer/issues/{id}`
- `GET /api/lead-maintainer/maintainers`
- `PATCH /api/lead-maintainer/issues/{id}/assign`
- `PATCH /api/lead-maintainer/issues/{id}/status`
- `GET /api/lead-maintainer/orders?status=Pending`
- `POST /api/lead-maintainer/orders`
- `PATCH /api/lead-maintainer/orders/{id}/status`

## Minta requestek

### Hibajegy hozzárendelése vezetőként

```json
{
  "maintainerId": 5
}
```

### Hibajegy státuszfrissítése

```json
{
  "status": "Resolved"
}
```

### Rendelés létrehozása

```json
{
  "toolListId": 3,
  "deliveryDate": "2026-04-15T10:00:00Z"
}
```

### Rendelés státuszfrissítése

```json
{
  "status": "InProgress"
}
```

## Fontos megjegyzés

A jelenlegi adatmodellben az `Order` entitás **nincs közvetlenül hibajegyhez vagy kérvényező felhasználóhoz kötve**.
Ezért most a rendelési API-k a meglévő sémára épülnek.
Ha később teljesen üzletileg pontos folyamat kell, érdemes lesz bővíteni az adatmodellt pl.:

- `IssueId`
- `RequestedByUserId`
- `RequestedByRole`
- `Quantity`
- `Note`

mezőkkel vagy külön `OrderRequest` entitással.

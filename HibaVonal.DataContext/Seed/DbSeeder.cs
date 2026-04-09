using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Entities;
using Microsoft.EntityFrameworkCore;

namespace HibaVonal.DataContext.Seed
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(HibaVonalDBContext db)
        {
            await db.Database.MigrateAsync();

            await SeedRoomsAsync(db);
            await SeedEquipmentsAsync(db);
            await SeedRoomEquipmentsAsync(db);
            await SeedUsersAsync(db);
            await SeedToolListsAsync(db);
            await SeedIssuesAsync(db);
            await SeedOrdersAsync(db);
        }

        private static async Task SeedRoomsAsync(HibaVonalDBContext db)
        {
            if (!await db.Rooms.AnyAsync(r => r.RoomNum == 101))
            {
                db.Rooms.Add(new Room
                {
                    RoomNum = 101,
                    Type = TypeEnum.Single
                });
            }

            if (!await db.Rooms.AnyAsync(r => r.RoomNum == 102))
            {
                db.Rooms.Add(new Room
                {
                    RoomNum = 102,
                    Type = TypeEnum.Double
                });
            }

            if (!await db.Rooms.AnyAsync(r => r.RoomNum == 201))
            {
                db.Rooms.Add(new Room
                {
                    RoomNum = 201,
                    Type = TypeEnum.Common
                });
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedEquipmentsAsync(HibaVonalDBContext db)
        {
            if (!await db.Equipments.AnyAsync(e => e.EquipName == "Csap"))
            {
                db.Equipments.Add(new Equipment
                {
                    EquipName = "Csap",
                    EquipCost = 15000,
                    CreateDate = DateTime.UtcNow
                });
            }

            if (!await db.Equipments.AnyAsync(e => e.EquipName == "Lámpa"))
            {
                db.Equipments.Add(new Equipment
                {
                    EquipName = "Lámpa",
                    EquipCost = 8000,
                    CreateDate = DateTime.UtcNow
                });
            }

            if (!await db.Equipments.AnyAsync(e => e.EquipName == "Radiátor"))
            {
                db.Equipments.Add(new Equipment
                {
                    EquipName = "Radiátor",
                    EquipCost = 45000,
                    CreateDate = DateTime.UtcNow
                });
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedRoomEquipmentsAsync(HibaVonalDBContext db)
        {
            var room101 = await db.Rooms.FirstAsync(r => r.RoomNum == 101);
            var room102 = await db.Rooms.FirstAsync(r => r.RoomNum == 102);
            var room201 = await db.Rooms.FirstAsync(r => r.RoomNum == 201);

            var csap = await db.Equipments.FirstAsync(e => e.EquipName == "Csap");
            var lampa = await db.Equipments.FirstAsync(e => e.EquipName == "Lámpa");
            var radiator = await db.Equipments.FirstAsync(e => e.EquipName == "Radiátor");

            if (!await db.RoomEquips.AnyAsync(x => x.RoomId == room101.Id && x.EquipId == csap.Id))
            {
                db.RoomEquips.Add(new RoomEquip
                {
                    RoomId = room101.Id,
                    EquipId = csap.Id
                });
            }

            if (!await db.RoomEquips.AnyAsync(x => x.RoomId == room102.Id && x.EquipId == lampa.Id))
            {
                db.RoomEquips.Add(new RoomEquip
                {
                    RoomId = room102.Id,
                    EquipId = lampa.Id
                });
            }

            if (!await db.RoomEquips.AnyAsync(x => x.RoomId == room201.Id && x.EquipId == radiator.Id))
            {
                db.RoomEquips.Add(new RoomEquip
                {
                    RoomId = room201.Id,
                    EquipId = radiator.Id
                });
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedUsersAsync(HibaVonalDBContext db)
        {
            var room101 = await db.Rooms.FirstAsync(r => r.RoomNum == 101);
            var room102 = await db.Rooms.FirstAsync(r => r.RoomNum == 102);

            if (!await db.Users.AnyAsync(u => u.Username == "leadmaintainer1"))
            {
                db.Users.Add(new User
                {
                    Username = "leadmaintainer1",
                    Password = BCrypt.Net.BCrypt.HashPassword("jelszo123"),
                    Name = "Teszt Vezető",
                    Email = "leadmaintainer1@example.com",
                    Role = UserRole.Lead_Maintainer,
                    RoomNum = null
                });
            }

            if (!await db.Users.AnyAsync(u => u.Username == "maintainer1"))
            {
                db.Users.Add(new User
                {
                    Username = "maintainer1",
                    Password = BCrypt.Net.BCrypt.HashPassword("jelszo123"),
                    Name = "Karbantartó Egy",
                    Email = "maintainer1@example.com",
                    Role = UserRole.Maintainer,
                    RoomNum = null
                });
            }

            if (!await db.Users.AnyAsync(u => u.Username == "maintainer2"))
            {
                db.Users.Add(new User
                {
                    Username = "maintainer2",
                    Password = BCrypt.Net.BCrypt.HashPassword("jelszo123"),
                    Name = "Karbantartó Kettő",
                    Email = "maintainer2@example.com",
                    Role = UserRole.Maintainer,
                    RoomNum = null
                });
            }

            if (!await db.Users.AnyAsync(u => u.Username == "user1"))
            {
                db.Users.Add(new User
                {
                    Username = "user1",
                    Password = BCrypt.Net.BCrypt.HashPassword("jelszo123"),
                    Name = "Kollégista Egy",
                    Email = "user1@example.com",
                    Role = UserRole.User,
                    RoomNum = room101.Id
                });
            }

            if (!await db.Users.AnyAsync(u => u.Username == "user2"))
            {
                db.Users.Add(new User
                {
                    Username = "user2",
                    Password = BCrypt.Net.BCrypt.HashPassword("jelszo123"),
                    Name = "Kollégista Kettő",
                    Email = "user2@example.com",
                    Role = UserRole.User,
                    RoomNum = room102.Id
                });
            }

            if (!await db.Users.AnyAsync(u => u.Username == "admin1"))
            {
                db.Users.Add(new User
                {
                    Username = "admin1",
                    Password = BCrypt.Net.BCrypt.HashPassword("jelszo123"),
                    Name = "Teszt Admin",
                    Email = "admin1@example.com",
                    Role = UserRole.Admin,
                    RoomNum = null
                });
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedToolListsAsync(HibaVonalDBContext db)
        {
            if (!await db.ToolLists.AnyAsync(t => t.ToolMaker == "Bosch" && t.ToolModel == "GSR 120-LI"))
            {
                db.ToolLists.Add(new ToolList
                {
                    ToolMaker = "Bosch",
                    ToolModel = "GSR 120-LI",
                    ToolPrice = 35000
                });
            }

            if (!await db.ToolLists.AnyAsync(t => t.ToolMaker == "Makita" && t.ToolModel == "DHP453"))
            {
                db.ToolLists.Add(new ToolList
                {
                    ToolMaker = "Makita",
                    ToolModel = "DHP453",
                    ToolPrice = 42000
                });
            }

            if (!await db.ToolLists.AnyAsync(t => t.ToolMaker == "DeWalt" && t.ToolModel == "DCD771C2"))
            {
                db.ToolLists.Add(new ToolList
                {
                    ToolMaker = "DeWalt",
                    ToolModel = "DCD771C2",
                    ToolPrice = 51000
                });
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedIssuesAsync(HibaVonalDBContext db)
        {
            if (await db.Issues.AnyAsync())
                return;

            var maintainer1 = await db.Users.FirstAsync(u => u.Username == "maintainer1");
            var maintainer2 = await db.Users.FirstAsync(u => u.Username == "maintainer2");
            var user1 = await db.Users.FirstAsync(u => u.Username == "user1");
            var user2 = await db.Users.FirstAsync(u => u.Username == "user2");

            var room101 = await db.Rooms.FirstAsync(r => r.RoomNum == 101);
            var room102 = await db.Rooms.FirstAsync(r => r.RoomNum == 102);
            var room201 = await db.Rooms.FirstAsync(r => r.RoomNum == 201);

            var csap = await db.Equipments.FirstAsync(e => e.EquipName == "Csap");
            var lampa = await db.Equipments.FirstAsync(e => e.EquipName == "Lámpa");
            var radiator = await db.Equipments.FirstAsync(e => e.EquipName == "Radiátor");

            db.Issues.AddRange(
                new Issue
                {
                    ReportDate = DateTime.UtcNow.AddDays(-3),
                    Description = "A 101-es szobában csöpög a csap.",
                    Status = StatusEnum.Open,
                    Urgency = UrgencyEnum.High,
                    ReporterId = user1.Id,
                    AssignedMaintainerId = maintainer1.Id,
                    RoomNum = room101.Id,
                    EquipmentId = csap.Id
                },
                new Issue
                {
                    ReportDate = DateTime.UtcNow.AddDays(-2),
                    Description = "A 102-es szobában villog a lámpa.",
                    Status = StatusEnum.InProgress,
                    Urgency = UrgencyEnum.Medium,
                    ReporterId = user2.Id,
                    AssignedMaintainerId = maintainer1.Id,
                    RoomNum = room102.Id,
                    EquipmentId = lampa.Id
                },
                new Issue
                {
                    ReportDate = DateTime.UtcNow.AddDays(-4),
                    Description = "A közös helyiség radiátora nem melegít rendesen.",
                    Status = StatusEnum.Resolved,
                    Urgency = UrgencyEnum.High,
                    ReporterId = user1.Id,
                    AssignedMaintainerId = maintainer2.Id,
                    RoomNum = room201.Id,
                    EquipmentId = radiator.Id
                },
                new Issue
                {
                    ReportDate = DateTime.UtcNow.AddDays(-1),
                    Description = "A közös helyiségben elromlott a lámpa, nincs még kiosztva.",
                    Status = StatusEnum.Open,
                    Urgency = UrgencyEnum.Low,
                    ReporterId = user2.Id,
                    AssignedMaintainerId = null,
                    RoomNum = room201.Id,
                    EquipmentId = lampa.Id
                },
                new Issue
                {
                    ReportDate = DateTime.UtcNow.AddDays(-5),
                    Description = "Régi lezárt hiba a 101-es szobából.",
                    Status = StatusEnum.Closed,
                    Urgency = UrgencyEnum.Low,
                    ReporterId = user1.Id,
                    AssignedMaintainerId = maintainer2.Id,
                    RoomNum = room101.Id,
                    EquipmentId = csap.Id
                }
            );

            await db.SaveChangesAsync();
        }

        private static async Task SeedOrdersAsync(HibaVonalDBContext db)
        {
            if (await db.Orders.AnyAsync())
                return;

            var bosch = await db.ToolLists.FirstAsync(t => t.ToolMaker == "Bosch" && t.ToolModel == "GSR 120-LI");
            var makita = await db.ToolLists.FirstAsync(t => t.ToolMaker == "Makita" && t.ToolModel == "DHP453");
            var dewalt = await db.ToolLists.FirstAsync(t => t.ToolMaker == "DeWalt" && t.ToolModel == "DCD771C2");

            db.Orders.AddRange(
                new Order
                {
                    OrderDate = DateTime.UtcNow.AddDays(-5),
                    DeliveryDate = DateTime.UtcNow.AddDays(2),
                    Status = OrderStatus.Pending,
                    ToolListId = bosch.Id
                },
                new Order
                {
                    OrderDate = DateTime.UtcNow.AddDays(-4),
                    DeliveryDate = DateTime.UtcNow.AddDays(1),
                    Status = OrderStatus.InProgress,
                    ToolListId = makita.Id
                },
                new Order
                {
                    OrderDate = DateTime.UtcNow.AddDays(-10),
                    DeliveryDate = DateTime.UtcNow.AddDays(-2),
                    Status = OrderStatus.Completed,
                    ToolListId = dewalt.Id
                },
                new Order
                {
                    OrderDate = DateTime.UtcNow.AddDays(-8),
                    DeliveryDate = DateTime.UtcNow.AddDays(-1),
                    Status = OrderStatus.Cancelled,
                    ToolListId = bosch.Id
                }
            );

            await db.SaveChangesAsync();
        }
    }
}
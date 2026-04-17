using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Utilities;

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
            await SeedRegAllowAsync(db);    
            await SeedToolListsAsync(db);
            await SeedToolsAsync(db);       
            await SeedToolUsersAsync(db);  
            await SeedIssuesAsync(db);
            await SeedOrdersAsync(db);
            await SeedFeedbacksAsync(db);   
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

        private static async Task SeedRegAllowAsync(HibaVonalDBContext db)
        {
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN01"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN01",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN02"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN02",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN03"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN03",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN04"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN04",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN05"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN05",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN06"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN06",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN07"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN07",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN08"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN08",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN09"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN09",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN10"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN10",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN11"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN11",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN12"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN12",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN13"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN13",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN14"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN14",
                        Registered = false
                    }
                );
            }
            if (!await db.RegAllows.AnyAsync(r => r.NeptunCode == "NEPTUN15"))
            {
                db.RegAllows.Add(
                    new RegAllow
                    {
                        NeptunCode = "NEPTUN15",
                        Registered = false
                    }
                );
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedToolsAsync(HibaVonalDBContext db)
        {
            var bosch = await db.ToolLists.FirstAsync(t => t.ToolMaker == "Bosch" && t.ToolModel == "GSR 120-LI");
            var makita = await db.ToolLists.FirstAsync(t => t.ToolMaker == "Makita" && t.ToolModel == "DHP453");
            var dewalt = await db.ToolLists.FirstAsync(t => t.ToolMaker == "DeWalt" && t.ToolModel == "DCD771C2");

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "BOSCH-001"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "BOSCH-001",
                        ToolListId = bosch.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "BOSCH-002"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "BOSCH-002",
                        ToolListId = bosch.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "BOSCH-003"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "BOSCH-003",
                        ToolListId = bosch.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "BOSCH-004"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "BOSCH-004",
                        ToolListId = bosch.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "BOSCH-005"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "BOSCH-005",
                        ToolListId = bosch.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "MAKITA-001"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "MAKITA-001",
                        ToolListId = makita.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "MAKITA-002"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "MAKITA-002",
                        ToolListId = makita.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "MAKITA-003"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "MAKITA-003",
                        ToolListId = makita.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "MAKITA-004"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "MAKITA-004",
                        ToolListId = makita.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "MAKITA-005"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "MAKITA-005",
                        ToolListId = makita.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "DEWALT-001"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "DEWALT-001",
                        ToolListId = dewalt.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "DEWALT-002"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "DEWALT-002",
                        ToolListId = dewalt.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "DEWALT-003"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "DEWALT-003",
                        ToolListId = dewalt.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "DEWALT-004"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "DEWALT-004",
                        ToolListId = dewalt.Id
                    }
                );
            }

            if (!await db.Tools.AnyAsync(t => t.ToolSerial == "DEWALT-005"))
            {
                db.Tools.Add(
                    new Tool
                    {
                        ToolSerial = "DEWALT-005",
                        ToolListId = dewalt.Id
                    }
                );
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedToolUsersAsync(HibaVonalDBContext db)
        {
            var m1 = await db.Users.FirstAsync(u => u.Username == "maintainer1");
            var m2 = await db.Users.FirstAsync(u => u.Username == "maintainer2");

            var t1 = await db.Tools.FirstAsync(t => t.ToolSerial == "BOSCH-001");
            var t2 = await db.Tools.FirstAsync(t => t.ToolSerial == "BOSCH-002");
            var t3 = await db.Tools.FirstAsync(t => t.ToolSerial == "BOSCH-003");
            var t4 = await db.Tools.FirstAsync(t => t.ToolSerial == "BOSCH-004");
            var t5 = await db.Tools.FirstAsync(t => t.ToolSerial == "BOSCH-005");
            var t6 = await db.Tools.FirstAsync(t => t.ToolSerial == "MAKITA-001");
            var t7 = await db.Tools.FirstAsync(t => t.ToolSerial == "MAKITA-002");
            var t8 = await db.Tools.FirstAsync(t => t.ToolSerial == "MAKITA-003");
            var t9 = await db.Tools.FirstAsync(t => t.ToolSerial == "MAKITA-004");
            var t10 = await db.Tools.FirstAsync(t => t.ToolSerial == "MAKITA-005");
            var t11 = await db.Tools.FirstAsync(t => t.ToolSerial == "DEWALT-001");
            var t12 = await db.Tools.FirstAsync(t => t.ToolSerial == "DEWALT-002");
            var t13 = await db.Tools.FirstAsync(t => t.ToolSerial == "DEWALT-003");
            var t14 = await db.Tools.FirstAsync(t => t.ToolSerial == "DEWALT-004");
            var t15 = await db.Tools.FirstAsync(t => t.ToolSerial == "DEWALT-005");

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t1.Id && tu.UserId == m1.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t1.Id,
                        UserId = m1.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t2.Id && tu.UserId == m1.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t2.Id,
                        UserId = m1.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t3.Id && tu.UserId == m1.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t3.Id,
                        UserId = m1.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t4.Id && tu.UserId == m1.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t4.Id,
                        UserId = m1.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t5.Id && tu.UserId == m1.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t5.Id,
                        UserId = m1.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t6.Id && tu.UserId == m1.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t6.Id,
                        UserId = m1.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t7.Id && tu.UserId == m1.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t7.Id,
                        UserId = m1.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t8.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t8.Id,
                        UserId = m2.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t9.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t9.Id,
                        UserId = m2.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t10.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t10.Id,
                        UserId = m2.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t11.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t11.Id,
                        UserId = m2.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t12.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t12.Id,
                        UserId = m2.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t13.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t13.Id,
                        UserId = m2.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t14.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t14.Id,
                        UserId = m2.Id
                    }
                );
            }

            if (!await db.ToolUsers.AnyAsync(tu => tu.ToolId == t15.Id && tu.UserId == m2.Id))
            {
                db.ToolUsers.Add(
                    new ToolUser
                    {
                        ToolId = t15.Id,
                        UserId = m2.Id
                    }
                );
            }

            await db.SaveChangesAsync();
        }

        private static async Task SeedFeedbacksAsync(HibaVonalDBContext db)
        {
            var u1 = await db.Users.FirstAsync(u => u.Username == "user1");
            var u2 = await db.Users.FirstAsync(u => u.Username == "user2");

            var i1 = await db.Issues.FirstAsync(i => i.Description == "A 101-es szobában csöpög a csap.");
            var i2 = await db.Issues.FirstAsync(i => i.Description == "A 102-es szobában villog a lámpa.");
            var i3 = await db.Issues.FirstAsync(i => i.Description == "A közös helyiség radiátora nem melegít rendesen.");
            var i4 = await db.Issues.FirstAsync(i => i.Description == "A közös helyiségben elromlott a lámpa, nincs még kiosztva.");
            var i5 = await db.Issues.FirstAsync(i => i.Description == "Régi lezárt hiba a 101-es szobából.");

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i1.Id && f.Comment == "Köszönöm a gyors munkát!"))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Köszönöm a gyors munkát!",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i1.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i1.Id && f.Comment == "Jó lett a csap."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Jó lett a csap.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i1.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i1.Id && f.Comment == "Korrekt karbantartó."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Korrekt karbantartó.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i1.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i2.Id && f.Comment == "Még mindig kicsit villog..."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Még mindig kicsit villog...",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i2.Id,
                        ReporterId = u2.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i2.Id && f.Comment == "Légyszi nézzétek meg újra."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Légyszi nézzétek meg újra.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i2.Id,
                        ReporterId = u2.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i2.Id && f.Comment == "Most már tökéletes."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Most már tökéletes.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i2.Id,
                        ReporterId = u2.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i3.Id && f.Comment == "Tökéletes lett, meleg van."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Tökéletes lett, meleg van.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i3.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i3.Id && f.Comment == "Gyorsak voltatok!"))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Gyorsak voltatok!",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i3.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i3.Id && f.Comment == "A legjobb karbantartó!"))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "A legjobb karbantartó!",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i3.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i4.Id && f.Comment == "Légyszi siessetek vele!"))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Légyszi siessetek vele!",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i4.Id,
                        ReporterId = u2.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i4.Id && f.Comment == "Még mindig sötét van."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Még mindig sötét van.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i4.Id,
                        ReporterId = u2.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i4.Id && f.Comment == "Mikor jöttök?"))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Mikor jöttök?",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i4.Id,
                        ReporterId = u2.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i5.Id && f.Comment == "Nagyon elégedett vagyok."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Nagyon elégedett vagyok.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i5.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i5.Id && f.Comment == "Profi munka volt."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Profi munka volt.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i5.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            if (!await db.Feedbacks.AnyAsync(f => f.IssueId == i5.Id && f.Comment == "Mindig időben jönnek."))
            {
                db.Feedbacks.Add(
                    new Feedback
                    {
                        Comment = "Mindig időben jönnek.",
                        CreatedAt = DateTime.UtcNow,
                        IssueId = i5.Id,
                        ReporterId = u1.Id
                    }
                );
            }

            await db.SaveChangesAsync();
        }

    }
}
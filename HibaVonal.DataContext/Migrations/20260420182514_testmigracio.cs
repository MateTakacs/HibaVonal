using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HibaVonal.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class testmigracio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "issuePicPath",
                table: "Issues",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "issuePicPath",
                table: "Issues");
        }
    }
}

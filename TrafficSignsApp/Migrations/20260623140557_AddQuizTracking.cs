using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrafficSignsApp.Migrations
{
    /// <inheritdoc />
    public partial class AddQuizTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "UserResults",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuizMode",
                table: "UserResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "UserResults");

            migrationBuilder.DropColumn(
                name: "QuizMode",
                table: "UserResults");
        }
    }
}

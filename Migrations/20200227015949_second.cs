using Microsoft.EntityFrameworkCore.Migrations;

namespace TodoListWeb.Migrations
{
    public partial class second : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_Categories_TodoCategoryID",
                table: "Todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_TodoCategoryID",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "TodoCategoryID",
                table: "Todos");

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Todos",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "Categories",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_CategoryID",
                table: "Todos",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_Categories_CategoryID",
                table: "Todos",
                column: "CategoryID",
                principalTable: "Categories",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_Categories_CategoryID",
                table: "Todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_CategoryID",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Categories");

            migrationBuilder.AddColumn<int>(
                name: "TodoCategoryID",
                table: "Todos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_TodoCategoryID",
                table: "Todos",
                column: "TodoCategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_Categories_TodoCategoryID",
                table: "Todos",
                column: "TodoCategoryID",
                principalTable: "Categories",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

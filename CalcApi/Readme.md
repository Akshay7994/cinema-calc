1. Created webapi with dotnet.
2. Setup Models and Registered DbContext.
3. Set DB Context with the registred context with proper connection string for postgress.
4. Register DbContext in Program.cs
5. Use dotnet ef to migrate the model into a DB and its schema 
    - dotnet ef migrations add <nameForYourMigration>
    - dotnet ef database update
6. Generate a controller and link it with its respective model.

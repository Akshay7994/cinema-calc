using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
DotNetEnv.Env.Load();
// var connectionString= DotNetEnv.Env.GetString("CONNECTION_STRING");
// var str= Environment.GetEnvironmentVariable("CONNECTION_STRING");

// Console.WriteLine("Connection String:", connectionString);
// Console.WriteLine("Connection String:"+str);
// DB Context
// builder.Services.AddDbContext<CalcContext>(options => options.UseNpgsql(connectionString));


// Using ENV
builder.Services.AddDbContext<CalcContext>(options =>
{

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    // Console.WriteLine(connectionString);
    var password = Environment.GetEnvironmentVariable("POSTGRESS__PASSWORD");
    // Console.WriteLine(password);
    connectionString = string.Format(connectionString, password);
    // Console.WriteLine(connectionString);
    options.UseNpgsql(connectionString);

});
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Swagger Middleware
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "CalcAPI";
    config.Title = "CalcAPI v1";
    config.Version = "v1";
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:3000") // React app's URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "CalcAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

app.MapGet("/", () => "Hello World!");

app.MapGet("/getCalcData", async (CalcContext db) =>
    await db.CalcItems.ToListAsync());


app.MapPost("/addCalcItems", async (CalcItem ci, CalcContext db) =>
{
    var calcIt = await db.CalcItems.FindAsync(ci.Name);

    if (calcIt == null)
    {
        db.CalcItems.Add(ci);
        await db.SaveChangesAsync();

        return Results.Created($"/addCalcData/{ci.Name}", ci);
    }
    else
    {
        calcIt.Name = ci.Name;
        calcIt.Price = ci.Price;
        calcIt.Percentage = ci.Percentage;
        calcIt.Total = ci.Total;
        await db.SaveChangesAsync();

        return Results.Created($"/addCalcData/{ci.Name}", ci);

    }

});

app.MapPost("/updateCalcItem/{name}", async (string name, CalcItem ci, CalcContext db) =>
{
    var calcIt = await db.CalcItems.FindAsync(name);

    if (calcIt == null) return Results.NotFound();

    calcIt.Name = ci.Name;
    calcIt.Price = ci.Price;
    calcIt.Percentage = ci.Percentage;
    calcIt.Total = ci.Total;
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/deleteCalcItem/{name}", async (string name, CalcContext db) =>
{
    if (await db.CalcItems.FindAsync(name) is CalcItem ci)
    {
        db.CalcItems.Remove(ci);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CalcContext>();
    db.Database.Migrate();
}

app.Run();

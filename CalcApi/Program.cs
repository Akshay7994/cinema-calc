using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Using ENV
builder.Services.AddDbContext<CalcContext>(options =>
{

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var password = Environment.GetEnvironmentVariable("POSTGRESS__PASSWORD");
    var username= Environment.GetEnvironmentVariable("POSTGRESS__USERNAME");
    // Console.WriteLine(password);
    connectionString = string.Format(connectionString, username, password);
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
app.UseCors(builder =>
      {
        builder
              .WithOrigins("http://localhost:3000")
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
              .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
 
      }
);

// Swagger Init
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

// Get data
app.MapGet("/getCalcData", async (CalcContext db) =>
    await db.CalcItems.ToListAsync());

// Add and Update Data
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

// Update Data
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


// Delete Data
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

// Data Migration
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CalcContext>();
    db.Database.Migrate();
}

app.Run();

using Common;
using Common.Logging;
using Common.Shared.Configurations;
using Common.Shared.DTOs.Configurations;
using Microsoft.AspNetCore.Mvc;
using News.API.Extensions;
using News.API.Persistence;
using Newtonsoft.Json.Serialization;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog(Serilogger.Configure);
Log.Information("Start News API up");


try
{

    builder.Host.AddAppConfigurations();
    // Add services to the container.

    builder.Services.AddConfigurationSettings(builder.Configuration);
    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.ConfigureRedis();
    var services = builder.Services;
    services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
    services.Configure<PasswordPhrases>(builder.Configuration.GetSection("PasswordPhrases"));
    services.AddControllers(o =>
    {
        o.Filters.Add(new ResponseCacheAttribute() { NoStore = true, Location = ResponseCacheLocation.None });
    })
    .AddNewtonsoftJson(o =>
    {
        o.SerializerSettings.DateFormatHandling = Converter.JSONDateFormatHandling;
        o.SerializerSettings.DateTimeZoneHandling = Converter.JSONDateTimeZoneHandling;
        o.SerializerSettings.DateFormatString = Converter.JSONDateFormatString;
        o.SerializerSettings.NullValueHandling = Converter.JSONNullValueHandling;
        o.SerializerSettings.ReferenceLoopHandling = Converter.JSONReferenceLoopHandling;
        o.SerializerSettings.ContractResolver = new DefaultContractResolver();
    });

    var app = builder.Build();
    app.UseInfrastructure();
    app.MigrateDatabase<NewsContext>((
        context, _) =>
    {
        NewsContextSeed.SeedProductAsync(
            context,
            Log.Logger)
                          .Wait();
    })
       .Run();
}
catch (Exception ex)
{
    var type = ex.GetType().Name;
    if (type.Equals("StopTheHostException", StringComparison.Ordinal))
        throw;

    Log.Fatal(ex, $"Unhandled exception: {ex.Message}");
}
finally
{
    Log.Information("Shut down News API complete");
    Log.CloseAndFlush();
}
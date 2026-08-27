using DocumentPermissionsSample.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<PermissionCatalog>();

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

RegisterSyncfusionLicense();

app.UseCors("Frontend");

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();

static void RegisterSyncfusionLicense()
{
    var license = Environment.GetEnvironmentVariable("SYNCFUSION_LICENSE");
    if (!string.IsNullOrWhiteSpace(license))
    {
        Syncfusion.Licensing.SyncfusionLicenseProvider.RegisterLicense(license);
    }
}

public partial class Program;

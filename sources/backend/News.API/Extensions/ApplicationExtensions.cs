using System;
using News.API.Middlewares;

namespace News.API.Extensions
{
    public static class ApplicationExtensions
    {
        public static void UseInfrastructure(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseMiddleware<JwtMiddleware>();
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseStaticFiles();


            app.UseRouting();

            // app.UseHttpsRedirection(); //for production only
            app
                .UseCors(policy =>
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3000", "http://86.48.3.223:1818", "https://86.48.3.223:1818"));
            app.UseAuthorization();

            app
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapDefaultControllerRoute();
                });
        }
    }
}

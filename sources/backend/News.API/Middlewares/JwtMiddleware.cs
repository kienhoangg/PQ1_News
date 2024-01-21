using Common.Shared.DTOs.Configurations;
using Microsoft.Extensions.Options;
using News.API.Authorization;

namespace News.API.Middlewares
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtSettings _jwtSettings;

        public JwtMiddleware(RequestDelegate next, IOptions<JwtSettings> appSettings)
        {
            _next = next;
            _jwtSettings = appSettings.Value;
        }

        public async Task Invoke(HttpContext context, IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var role = jwtUtils.ValidateJwtToken(token);
            if (!string.IsNullOrEmpty(role))
            {
                // attach user to context on successful jwt validation
                context.Items["Role"] = role;
            }

            await _next(context);
        }
    }
}
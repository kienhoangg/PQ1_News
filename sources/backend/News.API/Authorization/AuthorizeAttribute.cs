using Common.Shared.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace News.API.Authorization
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        private readonly IList<RoleCode> _roles;

        public AuthorizeAttribute(params RoleCode[] roles)
        {
            _roles = roles ?? new RoleCode[] { };
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // skip authorization if action is decorated with [AllowAnonymous] attribute
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            // authorization
            if (context.HttpContext.Items["Role"] != null && Enum.TryParse<RoleCode>(context.HttpContext.Items["Role"].ToString(), out var roleCode))
            {
                if (roleCode == null || (_roles.Any() && !_roles.Contains(roleCode)))
                {
                    // not logged in or role not authorized
                    context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
                }
            }
            else
            {
                // Invalid token
                context.Result = new JsonResult(new { message = "Invalid Token" }) { StatusCode = StatusCodes.Status400BadRequest };
            }

        }
    }
}
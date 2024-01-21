using Common.Enums;
using Common.Shared.Constants;
using Contracts.Domains;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore.Internal;
using Models.Dtos;
using Newtonsoft.Json;

namespace News.API.Filter
{
    public class HandleStatusByRoleAttribute : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {

        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var param = context.ActionArguments.SingleOrDefault(p => p.Value is DtoBase || p.Value is UploadDtoBase);
            if (context.HttpContext.Items["Role"] != null && context.HttpContext.Items["Role"].ToString() == RoleCode.ADMIN.ToString())
            {
                context.HttpContext.Items["HandledStatus"] = Status.Enabled;
                // param.Value. = JsonConvert.SerializeObject(result);
            }
        }
    }
}
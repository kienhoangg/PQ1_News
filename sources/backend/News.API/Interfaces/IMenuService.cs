using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IMenuService
    {
        Task<ApiSuccessResult<MenuDto>>
        GetMenuByPaging(

                MenuRequest fieldNewsRequest,
                params Expression<Func<Menu, object>>[] includeProperties

        );

        Task<Menu> GetMenu(int id);

        Task CreateMenu(Menu menu);

        Task UpdateMenu(Menu menu);

        Task DeleteMenu(int id);
        Task<List<HomeMenuDto>> GetHomeMenu();
        Task<List<HomeAdminDto>> GetAdminMenu();
        Task UpdateManyMenuDto(List<int> lstMenuId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}

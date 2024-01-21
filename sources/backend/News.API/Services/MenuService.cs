using System.Linq.Expressions;
using AutoMapper;
using Common.Enums;
using Common.Interfaces;
using Infrastructure.Implements;
using Infrastructure.Mappings;
using Infrastructure.Shared.Paging;
using Infrastructure.Shared.SeedWork;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;
using News.API.Persistence;

namespace News.API.Services
{
    public class MenuService : RepositoryBase<Menu, int, NewsContext>, IMenuService
    {
        private readonly IMapper _mapper;
        public MenuService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateMenu(Menu menu)
        {
            await CreateAsync(menu);
        }

        public async Task DeleteMenu(int id)
        {
            var menu = await GetByIdAsync(id);
            await DeleteAsync(menu);
        }

        public async Task<Menu> GetMenu(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<List<HomeMenuDto>> GetHomeMenu()
        {
            var result = new List<HomeMenuDto>();
            var lstRootMenu = (await GetMenuByPaging(new MenuRequest()
            {
                ParentId = 0,
                OrderBy = "Order",
                Direction = 1,
                Status = Status.Enabled
            })).PagedData.Results.ToList();
            foreach (var item in lstRootMenu)
            {
                var lstChildMenu = (await GetMenuByPaging(new MenuRequest()
                {
                    ParentId = item.Id,
                    OrderBy = "LastModifiedDate",
                    Direction = -1,
                    Status = Status.Enabled
                })).PagedData.Results.ToList();
                item.MenuChildren = lstChildMenu;
                var homeMenuDto = new HomeMenuDto()
                {
                    Id = item.Id,
                    Title = item.Title,
                    Url = item.Url,
                    IsRootMenu = item.ParentId == 0 ? true : false,
                    Items = lstChildMenu
                };
                result.Add(homeMenuDto);
            }

            return result;
        }

        public async Task<List<HomeAdminDto>> GetAdminMenu()
        {
            var result = new List<HomeAdminDto>();
            var lstRootMenu = (await GetMenuByPaging(new MenuRequest()
            {
                ParentId = 0,
                OrderBy = "Order",
                Direction = 1,
                Status = Status.Enabled
            })).PagedData.Results.ToList();
            foreach (var item in lstRootMenu)
            {
                var lstChildMenu = (await GetMenuByPaging(new MenuRequest()
                {
                    ParentId = item.Id,
                    OrderBy = "Order",
                    Direction = 1,
                    Status = Status.Enabled
                })).PagedData.Results.ToList();
                var homeMenuDto = new HomeAdminDto()
                {
                    Key = item.Id,
                    Title = item.Title,
                    Url = item.Url,
                    Children = _mapper.Map<List<MenuAdminDto>>(lstChildMenu)
                };
                result.Add(homeMenuDto);
            }

            return result;
        }

        public async Task<ApiSuccessResult<MenuDto>> GetMenuByPaging(MenuRequest menuRequest, params Expression<Func<Menu, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(menuRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(menuRequest.Keyword)));
            }
            if (menuRequest.ParentId.HasValue)
            {
                query = query.Where((x => x.ParentId == menuRequest.ParentId.Value));
            }
            if (menuRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == menuRequest.Status.Value);
            }
            PagedResult<Menu>? sourcePaging = await query.PaginatedListAsync(menuRequest.CurrentPage ?? 0, menuRequest.PageSize ?? 0, menuRequest.OrderBy2ndColumn, menuRequest.Direction2ndColumn, menuRequest.OrderBy, menuRequest.Direction);
            var lstDto = _mapper.Map<List<MenuDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<MenuDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<MenuDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateMenu(Menu product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<Menu>> GetMenuNormalByPaging(MenuRequest menuRequest, params Expression<Func<Menu, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (menuRequest.Ids != null && menuRequest.Ids.Count > 0)
            {
                query = query.Where(x => menuRequest.Ids.Contains(x.Id));
            }

            PagedResult<Menu>? sourcePaging = await query.PaginatedListAsync(menuRequest.CurrentPage
                                                                                              ?? 0, menuRequest.PageSize ?? 0, menuRequest.OrderBy, menuRequest.Direction);
            ApiSuccessResult<Menu>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyMenuDto(List<int> lstMenuId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstMenuDto = (await GetMenuNormalByPaging(new MenuRequest()
            {
                Ids = lstMenuId
            })).PagedData.Results.ToList();
            Action<Menu> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<Menu>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstMenuDto.ForEach(action);
                await UpdateListAsync(lstMenuDto);
            }
        }
    }
}
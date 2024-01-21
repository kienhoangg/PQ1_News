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
    public class RadioService : RepositoryBase<Radio, int, NewsContext>, IRadioService
    {
        private readonly IMapper _mapper;
        public RadioService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateRadio(Radio radio)
        {
            await CreateAsync(radio);
        }

        public async Task DeleteRadio(int id)
        {
            var radio = await GetByIdAsync(id);
            await DeleteAsync(radio);
        }

        public async Task<Radio> GetRadio(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<RadioDto>> GetRadioByPaging(RadioRequest radioRequest, params Expression<Func<Radio, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(radioRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(radioRequest.Keyword)));
            }
            if (radioRequest.RadioCategoryId.HasValue)
            {
                query = query.Where(x => x.RadioCategoryId == radioRequest.RadioCategoryId.Value);
            }
            if (radioRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == radioRequest.Status.Value);
            }
            PagedResult<Radio>? sourcePaging = await query.PaginatedListAsync(radioRequest.CurrentPage
                                                                                             ?? 1, radioRequest.PageSize ?? CommonConstants.PAGE_SIZE, radioRequest.OrderBy2ndColumn, radioRequest.Direction2ndColumn, radioRequest.OrderBy, radioRequest.Direction);
            var lstDto = _mapper.Map<List<RadioDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<RadioDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<RadioDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateRadio(Radio product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<Radio>> GetRadioNormalByPaging(RadioRequest radioRequest, params Expression<Func<Radio, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (radioRequest.Ids != null && radioRequest.Ids.Count > 0)
            {
                query = query.Where(x => radioRequest.Ids.Contains(x.Id));
            }

            PagedResult<Radio>? sourcePaging = await query.PaginatedListAsync(radioRequest.CurrentPage
                                                                                              ?? 0, radioRequest.PageSize ?? 0, radioRequest.OrderBy, radioRequest.Direction);
            ApiSuccessResult<Radio>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyRadioDto(List<int> lstRadioId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstRadioDto = (await GetRadioNormalByPaging(new RadioRequest()
            {
                Ids = lstRadioId
            })).PagedData.Results.ToList();
            Action<Radio> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<Radio>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstRadioDto.ForEach(action);
                await UpdateListAsync(lstRadioDto);
            }
        }
    }
}
using System.Linq.Expressions;
using AutoMapper;
using Common.Enums;
using Common.Interfaces;
using Infrastructure.Implements;
using Infrastructure.Mappings;
using Infrastructure.Shared.Paging;
using Infrastructure.Shared.SeedWork;
using Microsoft.EntityFrameworkCore;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;
using News.API.Persistence;

namespace News.API.Services
{
    public class QuestionCategoryService : RepositoryBase<QuestionCategory, int, NewsContext>, IQuestionCategoryService
    {
        private readonly IMapper _mapper;
        public QuestionCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateQuestionCategory(QuestionCategory questionCategory)
        {
            await CreateAsync(questionCategory);
        }

        public async Task<List<QuestionCategory>> GetAllQuestionCategories()
        {
            return await FindAll().ToListAsync();
        }

        public async Task DeleteQuestionCategory(int id)
        {
            var questionCategory = await GetByIdAsync(id);
            await DeleteAsync(questionCategory);
        }

        public async Task<QuestionCategory> GetQuestionCategory(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<QuestionCategoryDto>> GetQuestionCategoryByPaging(QuestionCategoryRequest questionCategoryRequest, params Expression<Func<QuestionCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(questionCategoryRequest.Keyword))
            {
                query = FindByCondition((x => x.Title.Contains(questionCategoryRequest.Keyword)));
            }
            if (questionCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == questionCategoryRequest.Status.Value);
            }
            if (questionCategoryRequest.ParentId.HasValue)
            {
                query = query.Where(x => x.ParentId == questionCategoryRequest.ParentId.Value);
            }
            PagedResult<QuestionCategory>? sourcePaging = await query.PaginatedListAsync(questionCategoryRequest.CurrentPage
                                                                                             ?? 1, questionCategoryRequest.PageSize ?? CommonConstants.PAGE_SIZE, questionCategoryRequest.OrderBy2ndColumn, questionCategoryRequest.Direction2ndColumn, questionCategoryRequest.OrderBy, questionCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<QuestionCategoryDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<QuestionCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<QuestionCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateQuestionCategory(QuestionCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<QuestionCategory>> GetQuestionCategoryNormalByPaging(QuestionCategoryRequest questionCategoryRequest, params Expression<Func<QuestionCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (questionCategoryRequest.Ids != null && questionCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => questionCategoryRequest.Ids.Contains(x.Id));
            }

            PagedResult<QuestionCategory>? sourcePaging = await query.PaginatedListAsync(questionCategoryRequest.CurrentPage
                                                                                              ?? 0, questionCategoryRequest.PageSize ?? 0, questionCategoryRequest.OrderBy, questionCategoryRequest.Direction);
            ApiSuccessResult<QuestionCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyQuestionCategoryDto(List<int> lstQuestionCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstQuestionCategoryDto = (await GetQuestionCategoryNormalByPaging(new QuestionCategoryRequest()
            {
                Ids = lstQuestionCategoryId
            })).PagedData.Results.ToList();
            Action<QuestionCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<QuestionCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstQuestionCategoryDto.ForEach(action);
                await UpdateListAsync(lstQuestionCategoryDto);
            }
        }
    }
}
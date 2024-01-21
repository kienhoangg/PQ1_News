using System.Text;
using System.Text.Json.Serialization;
using Common.Interfaces;
using Common.Shared.Configurations;
using Common.Shared.DTOs.Configurations;
using Contracts.Interfaces;
using Infrastructure.Extensions;
using Infrastructure.Implements;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using News.API.Authorization;
using News.API.Filter;
using News.API.Interfaces;
using News.API.Persistence;
using News.API.Services;
using StackExchange.Redis;

namespace News.API.Extensions
{
    public static class ServiceExtensions
    {

        internal static IServiceCollection AddConfigurationSettings(this IServiceCollection services,
       IConfiguration configuration)
        {


            var jwtSettings = configuration.GetSection(nameof(JwtSettings))
                .Get<JwtSettings>();
            services.AddSingleton(jwtSettings);
            var cacheSettings = configuration.GetSection(nameof(CacheSettings))
           .Get<CacheSettings>();
            services.AddSingleton(cacheSettings);

            return services;
        }

        internal static IServiceCollection AddJwtAuthentication(this IServiceCollection services)
        {
            var settings = services.GetOptions<JwtSettings>(nameof(JwtSettings));
            if (settings == null || string.IsNullOrEmpty(settings.Key))
                throw new ArgumentNullException($"{nameof(JwtSettings)} is not configured properly");

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ClockSkew = TimeSpan.Zero,
                RequireExpirationTime = false
            };
            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.SaveToken = true;
                x.RequireHttpsMetadata = false;
                x.TokenValidationParameters = tokenValidationParameters;
            });

            return services;
        }
        public static IServiceCollection
        AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler =
                        ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });
            services.AddCors();
            services
                .Configure<RouteOptions>(options =>
                    options.LowercaseUrls = true);

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.ConfigureProductDbContext(configuration);
            services.AddInfrastructureServices();
            services.AddAutoMapper(cfg => cfg.AddProfile(new MappingFile()));
            return services;
        }

        private static IServiceCollection
        ConfigureProductDbContext(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            var connectionString =
                configuration.GetConnectionString("DefaultConnectionString");

            services
                .AddDbContext<NewsContext>(options =>
                {
                    options
                        .UseSqlServer(configuration
                            .GetConnectionString("DefaultConnectionString"),
                        builder =>
                            builder
                                .MigrationsAssembly(typeof(NewsContext)
                                    .Assembly
                                    .FullName).UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
                });
            return services;
        }

        public static void ConfigureRedis(this IServiceCollection services)
        {
            var settings = services.GetOptions<CacheSettings>(nameof(CacheSettings));
            if (string.IsNullOrEmpty(settings.ConnectionString))
                throw new ArgumentNullException("Redis Connection string is not configured.");
            services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(settings.ConnectionString));
            //Redis Configuration
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = settings.ConnectionString;
            });
        }

        private static IServiceCollection
        AddInfrastructureServices(this IServiceCollection services)
        {
            return services
                .AddScoped(typeof(IRepositoryBase<,,>),
                typeof(RepositoryBase<,,>))
                .AddScoped(typeof(IUnitOfWork<>), typeof(UnitOfWork<>))
                .AddScoped(typeof(ISerializeService),
                typeof(SerializeService))
                .AddScoped(typeof(IDocumentService), typeof(DocumentService))
                .AddScoped(serviceType: typeof(ICategoryNewsService),
                typeof(CategoryNewsService))
                 .AddScoped(serviceType: typeof(ILinkInfoService),
                typeof(LinkInfoService))
                 .AddScoped(serviceType: typeof(ILinkInfoCategoryService),
                typeof(LinkInfoCategoryService))
                 .AddScoped(serviceType: typeof(ICompanyInfoService),
                typeof(CompanyInfoService))
                 .AddScoped(serviceType: typeof(ICompanyInfoCategoryService),
                typeof(CompanyInfoCategoryService))
                .AddScoped(serviceType: typeof(IFieldNewsService),
                typeof(FieldNewsService))
                .AddScoped(serviceType: typeof(ISourceNewsService),
                typeof(SourceNewsService))
                .AddScoped(serviceType: typeof(INewsPostService),
                typeof(NewsPostService))
                .AddScoped(serviceType: typeof(ICollaboratorService),
                typeof(CollaboratorService))
                .AddScoped(serviceType: typeof(ICommentService),
                typeof(CommentService))
                  .AddScoped(serviceType: typeof(ICacheService),
                typeof(CacheService))
                 .AddScoped(serviceType: typeof(IDocumentFieldService),
                typeof(DocumentFieldService)).AddScoped(serviceType: typeof(IFeedbackService),
                typeof(FeedbackService)).AddScoped(serviceType: typeof(IRadioService),
                typeof(RadioService)).AddScoped(serviceType: typeof(IRadioCategoryService),
                typeof(RadioCategoryService)).AddScoped(serviceType: typeof(IPublicInformationService),
                typeof(PublicInformationService)).AddScoped(serviceType: typeof(IPublicInformationCategoryService),
                typeof(PublicInformationCategoryService)).AddScoped(serviceType: typeof(IDocumentTypeService),
                typeof(DocumentTypeService)).AddScoped<HandleStatusByRoleAttribute>().AddScoped(serviceType: typeof(IDocumentDepartmentService),
                typeof(DocumentDepartmentService)).AddScoped(serviceType: typeof(IDocumentSignPersonService),
                typeof(DocumentSignPersonService)).AddScoped(serviceType: typeof(IQuestionService),
                typeof(QuestionService)).AddScoped(serviceType: typeof(IQuestionCategoryService),
                typeof(QuestionCategoryService)).AddScoped(serviceType: typeof(IStaticInfoService),
                typeof(StaticInfoService)).AddScoped(serviceType: typeof(IStaticCategoryService),
                typeof(StaticCategoryService)).AddScoped(serviceType: typeof(IMenuService),
                typeof(MenuService)).AddScoped(serviceType: typeof(IPhotoCategoryService),
                typeof(PhotoCategoryService)).AddScoped(serviceType: typeof(IUserService),
                typeof(UserService)).AddScoped(serviceType: typeof(IVideoService),
                typeof(VideoService)).AddScoped(serviceType: typeof(IVideoCategoryService),
                typeof(VideoCategoryService)).AddScoped(serviceType: typeof(IRatingService),
                typeof(RatingService)).AddScoped(serviceType: typeof(IPhotoService),
                typeof(PhotoService)).AddTransient(serviceType: typeof(ITokenService),
                typeof(TokenService)).AddScoped<IJwtUtils, JwtUtils>().AddScoped<ISecurityService, SecurityService>();
        }
    }
}

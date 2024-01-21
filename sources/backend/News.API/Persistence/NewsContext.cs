using System.Reflection;
using Contracts.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Models.Entities;

namespace News.API.Persistence
{
    public class NewsContext : DbContext
    {
        public NewsContext(DbContextOptions options) :
            base(options)
        {
        }

        public DbSet<CategoryNews> CategoryNews { get; set; }

        public DbSet<Collaborator> Collaborators { get; set; }

        public DbSet<FieldNews> FieldNews { get; set; }

        public DbSet<NewsPost> NewsPosts { get; set; }

        public DbSet<SourceNews> SourceNews { get; set; }

        public DbSet<Document> Documents { get; set; }

        public DbSet<Comment> Comments { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<QuestionCategory> QuestionCategories { get; set; }
        public DbSet<DocumentType> DocumentTypes { get; set; }
        public DbSet<DocumentField> DocumentFields { get; set; }
        public DbSet<DocumentDepartment> DocumentDepartments { get; set; }
        public DbSet<DocumentSignPerson> DocumentSignPersons { get; set; }
        public DbSet<StaticInfo> StaticInfos { get; set; }
        public DbSet<StaticCategory> StaticCategories { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<PhotoCategory> PhotoCategories { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<VideoCategory> VideoCategories { get; set; }
        public DbSet<LinkInfo> LinkInfos { get; set; }
        public DbSet<CompanyInfo> CompanyInfos { get; set; }
        public DbSet<LinkInfoCategory> LinkInfoCategories { get; set; }
        public DbSet<CompanyInfoCategory> CompanyInfoCategories { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Radio> Radios { get; set; }
        public DbSet<RadioCategory> RadioCategories { get; set; }
        public DbSet<PublicInformation> PublicInformations { get; set; }
        public DbSet<PublicInformationCategory> PublicInformationCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .ApplyConfigurationsFromAssembly(Assembly
                    .GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        public override Task<int>
        SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var modified =
                ChangeTracker
                    .Entries()
                    .Where(e =>
                        e.State == EntityState.Modified ||
                        e.State == EntityState.Added ||
                        e.State == EntityState.Deleted);

            foreach (var item in modified)
                switch (item.State)
                {
                    case EntityState.Added:
                        if (item.Entity is IDateTracking addedEntity)
                        {
                            addedEntity.CreatedDate = DateTime.UtcNow;
                            addedEntity.LastModifiedDate = DateTime.UtcNow;
                            item.State = EntityState.Added;
                        }

                        break;
                    case EntityState.Modified:
                        Entry(item.Entity).Property("Id").IsModified = false;
                        if (item.Entity is IDateTracking modifiedEntity)
                        {
                            modifiedEntity.LastModifiedDate = DateTime.UtcNow;
                            item.State = EntityState.Modified;
                        }

                        break;
                }

            return base.SaveChangesAsync(cancellationToken);
        }
    }

    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<NewsContext>
    {
        public NewsContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<NewsContext>();

            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json").Build();
            var connectionString = configuration.GetConnectionString("DefaultConnectionString");
            optionsBuilder.UseSqlServer(connectionString);
            return new NewsContext(optionsBuilder.Options);
        }
    }
}

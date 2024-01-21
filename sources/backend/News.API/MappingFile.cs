using AutoMapper;
using Infrastructure.Mappings;
using Models.Dtos;
using Models.Entities;

namespace News.API
{
    public class MappingFile : Profile
    {
        public MappingFile()
        {
            CreateMap<Document, DocumentDto>().IgnoreAllNonExisting();
            CreateMap<DocumentDto, Document>().IgnoreAllNonExisting();
            CreateMap<CategoryNews, CategoryNewsDto>().IgnoreAllNonExisting();
            CreateMap<CategoryNewsDto, CategoryNews>().IgnoreAllNonExisting();
            CreateMap<FieldNews, FieldNewsDto>().IgnoreAllNonExisting();
            CreateMap<FieldNewsDto, FieldNews>().IgnoreAllNonExisting();
            CreateMap<SourceNews, SourceNewsDto>().IgnoreAllNonExisting();
            CreateMap<SourceNewsDto, SourceNews>().IgnoreAllNonExisting();
            CreateMap<NewsPost, NewsPostDto>().IgnoreAllNonExisting();
            CreateMap<NewsPost, NewsPostWithoutContentDto>().IgnoreAllNonExisting();
            CreateMap<NewsPostDto, NewsPost>().IgnoreAllNonExisting();
            CreateMap<Collaborator, CollaboratorDto>().IgnoreAllNonExisting();
            CreateMap<CollaboratorDto, Collaborator>().IgnoreAllNonExisting();
            CreateMap<Comment, CommentDto>().IgnoreAllNonExisting();
            CreateMap<CommentDto, Comment>().IgnoreAllNonExisting();
            CreateMap<DocumentField, DocumentFieldDto>().IgnoreAllNonExisting();
            CreateMap<DocumentFieldDto, DocumentField>().IgnoreAllNonExisting();
            CreateMap<DocumentType, DocumentTypeDto>().IgnoreAllNonExisting();
            CreateMap<DocumentTypeDto, DocumentType>().IgnoreAllNonExisting();
            CreateMap<DocumentDepartment, DocumentDepartmentDto>().IgnoreAllNonExisting();
            CreateMap<DocumentDepartmentDto, DocumentDepartment>().IgnoreAllNonExisting();
            CreateMap<DocumentSignPerson, DocumentSignPersonDto>().IgnoreAllNonExisting();
            CreateMap<DocumentSignPersonDto, DocumentSignPerson>().IgnoreAllNonExisting();
            CreateMap<Question, QuestionDto>().IgnoreAllNonExisting();
            CreateMap<QuestionDto, Question>().IgnoreAllNonExisting();
            CreateMap<QuestionCategory, QuestionCategoryDto>().IgnoreAllNonExisting();
            CreateMap<QuestionCategoryDto, QuestionCategory>().IgnoreAllNonExisting();
            CreateMap<StaticCategory, StaticCategoryDto>().IgnoreAllNonExisting();
            CreateMap<StaticCategoryDto, StaticCategory>().IgnoreAllNonExisting();
            CreateMap<StaticInfo, StaticInfoDto>().IgnoreAllNonExisting();
            CreateMap<StaticInfoDto, StaticInfo>().IgnoreAllNonExisting();
            CreateMap<Menu, MenuDto>().IgnoreAllNonExisting();
            CreateMap<MenuDto, Menu>().IgnoreAllNonExisting();
            CreateMap<Photo, PhotoDto>().IgnoreAllNonExisting();
            CreateMap<PhotoDto, Photo>().IgnoreAllNonExisting();
            CreateMap<PhotoCategory, PhotoCategoryDto>().IgnoreAllNonExisting();
            CreateMap<PhotoCategoryDto, PhotoCategory>().IgnoreAllNonExisting();
            CreateMap<Video, VideoDto>().IgnoreAllNonExisting();
            CreateMap<VideoDto, Video>().IgnoreAllNonExisting();
            CreateMap<VideoCategory, VideoCategoryDto>().IgnoreAllNonExisting();
            CreateMap<VideoCategoryDto, VideoCategory>().IgnoreAllNonExisting();
            CreateMap<Rating, RatingDto>().IgnoreAllNonExisting();
            CreateMap<RatingDto, Rating>().IgnoreAllNonExisting();
            CreateMap<LinkInfo, LinkInfoDto>().IgnoreAllNonExisting();
            CreateMap<LinkInfoDto, LinkInfo>().IgnoreAllNonExisting();
            CreateMap<LinkInfoCategory, LinkInfoCategoryDto>().IgnoreAllNonExisting();
            CreateMap<LinkInfoCategoryDto, LinkInfoCategory>().IgnoreAllNonExisting();
            CreateMap<CompanyInfo, CompanyInfoDto>().IgnoreAllNonExisting();
            CreateMap<CompanyInfoDto, CompanyInfo>().IgnoreAllNonExisting();
            CreateMap<CompanyInfoCategory, CompanyInfoCategoryDto>().IgnoreAllNonExisting();
            CreateMap<CompanyInfoCategoryDto, CompanyInfoCategory>().IgnoreAllNonExisting();

            CreateMap<Feedback, FeedbackDto>().IgnoreAllNonExisting();
            CreateMap<FeedbackDto, Feedback>().IgnoreAllNonExisting();

            CreateMap<Radio, RadioDto>().IgnoreAllNonExisting();
            CreateMap<RadioDto, Radio>().IgnoreAllNonExisting();

            CreateMap<RadioCategory, RadioCategoryDto>().IgnoreAllNonExisting();
            CreateMap<RadioCategoryDto, RadioCategory>().IgnoreAllNonExisting();

            CreateMap<User, UserDto>().IgnoreAllNonExisting();
            CreateMap<UserDto, User>().IgnoreAllNonExisting();

            CreateMap<PublicInformation, PublicInformationDto>().IgnoreAllNonExisting();
            CreateMap<PublicInformationDto, PublicInformation>().IgnoreAllNonExisting();

            CreateMap<PublicInformationCategory, PublicInformationCategoryDto>().IgnoreAllNonExisting();
            CreateMap<PublicInformationCategoryDto, PublicInformationCategory>().IgnoreAllNonExisting();



            CreateMap<MenuDto, MenuAdminDto>().AfterMap((src, dest) => src.Id = dest.Key)
                .AfterMap((src, dest) => src.ParentId = dest.IsLeaf)
                .IgnoreAllNonExisting();
        }
    }
}

using Common.Enums;
using Models.Entities;
using ILogger = Serilog.ILogger;
namespace News.API.Persistence
{
    public class NewsContextSeed
    {
        public static async Task SeedProductAsync(NewsContext newsContext,
                                                  ILogger logger)
        {

            //  if (!newsContext.Collaborators.Any())
            // {
            //     newsContext.AddRange(GetCollaborators());
            // }
            if (!newsContext.DocumentFields.Any())
            {
                newsContext.AddRange(GetDocumentFields());
            }
            if (!newsContext.DocumentDepartments.Any())
            {
                newsContext.AddRange(GetDocumentDepartments());
            }
            if (!newsContext.DocumentTypes.Any())
            {
                newsContext.AddRange(GetDocumentTypes());
            }
            if (!newsContext.DocumentSignPersons.Any())
            {
                newsContext.AddRange(GetDocumentSignPersons());
            }
            await newsContext.SaveChangesAsync();
            if (!newsContext.Documents.Any())
            {
                newsContext.AddRange(GetDocuments());
            }

            if (!newsContext.QuestionCategories.Any())
            {
                newsContext.AddRange(GetQuestionCategory());
            }
            if (!newsContext.LinkInfoCategories.Any())
            {
                newsContext.AddRange(GetLinkInfoCategories());
            }
            if (!newsContext.CompanyInfoCategories.Any())
            {
                newsContext.AddRange(GetCompanyInfoCategories());
            }

            if (!newsContext.StaticCategories.Any())
            {
                newsContext.AddRange(GetStaticCategory());
            }
            if (!newsContext.Ratings.Any())
            {
                newsContext.AddRange(GetRatings());
            }
            if (!newsContext.Users.Any())
            {
                newsContext.AddRange(GetUsers());
            }

            //   if (!newsContext.NewsPosts.Any())
            // {
            //     newsContext.AddRange(GetNewsPost());
            // }

            if (!newsContext.Menus.Any())
            {
                newsContext.AddRange(GetParentMenus());
                await newsContext.SaveChangesAsync();
                newsContext.AddRange(GetMenus());
                await newsContext.SaveChangesAsync();
            }
            if (!newsContext.Photos.Any())
            {
                newsContext.AddRange(GetParentPhotoCateogries());
                await newsContext.SaveChangesAsync();
                newsContext.AddRange(GetPhotoCateogries());
                await newsContext.SaveChangesAsync();
            }
            if (!newsContext.CategoryNews.Any())
            {
                newsContext.AddRange(GetCategoryNews());
                await newsContext.SaveChangesAsync();
                newsContext.AddRange(GetCategoryParentsNews());
                await newsContext.SaveChangesAsync();
            }
            if (!newsContext.FieldNews.Any())
            {
                newsContext.AddRange(GetFieldNews());
                await newsContext.SaveChangesAsync();
            }
            if (!newsContext.NewsPosts.Any())
            {
                newsContext.AddRange(GetNewsPostV2());
            }
            if (!newsContext.VideoCategories.Any())
            {
                newsContext.AddRange(GetVideoCategories());
            }

            //  if (!newsContext.SourceNews.Any())
            // {
            //     newsContext.AddRange(GetSourceNews());
            // }


            await newsContext.SaveChangesAsync();
            logger.Information(
                "Seeded data for News DB associated with context {DbContextName}",
                nameof(NewsContext));
        }

        private static IEnumerable<StaticCategory> GetStaticCategory()
        {
            return new List<StaticCategory>()
            {
               new StaticCategory(){
                  Title = "HTML",
                  Statics = new List<StaticInfo>(){
                     new StaticInfo(){
                        Title = "UBND Tỉnh",
                        Content = "<div>Hello</div>",
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                     }
                  },
                     CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
               }
            };
        }

        private static IEnumerable<Menu> GetMenus()
        {
            return new List<Menu>()
            {
               new Menu(){
                  Title = "Tỉnh Uỷ",
                  Url = "/page/1",
                  ParentId = 3
               },new Menu(){
                  Title = "Đoàn ĐBQH",
                  Url = "/page/2",
                  ParentId = 3
               },
               new Menu(){
                  Title = "HĐND tỉnh",
                  Url = "/page/3",
                  ParentId = 3
               },new Menu(){
                  Title = "Lịch tiếp công dân",
                  Url = "/page/4",
                  ParentId = 4
               },new Menu(){
                  Title = "Kết quả giải quyết khiếu nại",
                  Url = "/page/5",
                  ParentId = 4
               }
            };
        }

        private static IEnumerable<LinkInfoCategory> GetLinkInfoCategories()
        {
            return new List<LinkInfoCategory>
            {
               new LinkInfoCategory{
                  Title = "Chính sách và cuộc sống",
                  LinkInfos = new List<LinkInfo>{
                     new LinkInfo{
                        Title = "Tỉnh đoàn yên bái",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/QuangCaoSlideShow/2017/Quy-II/thanhnien.jpg",
                        Link = "http://tinhdoanyenbai.gov.vn/"
                     },
                       new LinkInfo{
                        Title = "Hòa bình yên bái",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/QuangCaoSlideShow/2020/Quy-II/image_2020_06_01t09_34_10_631z.png",
                        Link = "http://hoabinhyenbai.com/"
                     },
                       new LinkInfo{
                        Title = "Tổng công ty điện lực",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/QuangCaoSlideShow/2017/Quy-IV/cskh-dienluc.jpg",
                        Link = "https://cskh.npc.com.vn/"
                     },
                       new LinkInfo{
                        Title = "Măng tre",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/QuangCaoSlideShow/2022/mangtrebatdo-22.jpg",
                        Link = "https://yenbai.gov.vn/hoat-dong-xuc-tien-thuong-mai/noidung/tintuc/Pages/chi-tiet-tin-tuc.aspx?l=Tinhoatdong&ItemID=1061"
                     },
                  }
               }
            };
        }

        private static IEnumerable<CompanyInfoCategory> GetCompanyInfoCategories()
        {
            return new List<CompanyInfoCategory>
            {
               new CompanyInfoCategory{
                  Title = "Chính sách và cuộc sống",
                  CompanyInfos = new List<CompanyInfo>{
                     new CompanyInfo{
                        Title = "Đặc sản trạm tấu",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/QuangCaoSlideShow/2022/tramtau---.jpg",
                        Link = "https://yenbai.gov.vn/hoat-dong-xuc-tien-thuong-mai/noidung/tintuc/Pages/chi-tiet-tin-tuc.aspx?ItemID=1060&l=Tinhoatdong"
                     },
                       new CompanyInfo{
                        Title = "Yên bái online",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/%E1%BA%A2nh%20qu%E1%BA%A3ng%20c%C3%A1o/yenbai-online.png",
                        Link = "http://www.baoyenbai.com.vn/"
                     },
                       new CompanyInfo{
                        Title = "Đặc sản tủ lệ",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/QuangCaoSlideShow/2022/tule---.jpg",
                        Link = "https://yenbai.gov.vn/hoat-dong-xuc-tien-thuong-mai/noidung/tintuc/Pages/chi-tiet-tin-tuc.aspx?ItemID=1062&l=Tinhoatdong"
                     },
                       new CompanyInfo{
                        Title = "Măng tre",
                        Avatar = "https://yenbai.gov.vn/noidung/lienket/PublishingImages/QuangCaoSlideShow/2017/Quy-IV/duongdaynong-sotnmt.gif",
                        Link = "#"
                     },
                  }
               }
            };
        }

        private static IEnumerable<PhotoCategory> GetParentPhotoCateogries()
        {
            return new List<PhotoCategory>()
            {
               new PhotoCategory()
               {
                  Title = "Danh mục 1",
                  Photos = new List<Photo>(){
                     new Photo(){
                        Title = "7",
                        ImagePath = "https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/251/5.JPG;;https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/260/1.JPG;;https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/259/4.JPG"
                     },  new Photo(){
                        Title = "8",
                        ImagePath = "https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/H…hments/265/chungnhandautuxaydungTTTM%20HOASEN.JPG;;https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/H…hAnh/Attachments/263/duaFLC%20di%20khao%20sat.JPG"
                     }
                  }
               }, new PhotoCategory()
               {
                  Title = "Danh mục 2",
                  Photos = new List<Photo>(){
                     new Photo(){
                        Title = "10",
                        ImagePath = "https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/H…%20chu%20tich%20va%20thu%20ky%20dai%20hoi%207.JPG"
                     },  new Photo(){
                        Title = "9",
                        ImagePath = "https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/H…hments/265/chungnhandautuxaydungTTTM%20HOASEN.JPG;;https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/H…/244/anh%2024%20trao%20doi%20voi%20dai%20bieu.JPG"
                     }
                  }
               }
            };
        }

        private static IEnumerable<PhotoCategory> GetPhotoCateogries()
        {
            return new List<PhotoCategory>()
            {
               new PhotoCategory()
               {
                  Title = "Danh mục 1.1",
                  ParentId = 1,
                  Photos = new List<Photo>(){
                     new Photo(){
                        Title = "23",
                        ImagePath = "https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/271/DSC_0810.JPG;;https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/274/IMG_1913.JPG"
                     },  new Photo(){
                        Title = "44",
                        ImagePath = "https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/234/ve%20dep%20thac2.jpg;;https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/H…BA%20L%E1%BB%87%20-%20V%C5%A9%20Chi%E1%BA%BFn.jpg"
                     }
                  }
               }
            };
        }
        private static IEnumerable<Menu> GetParentMenus()
        {
            return new List<Menu>()
            {
               new Menu(){
                  Title = "Trang chủ",
                  Url = "/",
                  ParentId = 0
               },new Menu(){
                  Title = "Giới thiệu",
                  Url = "/page/7",
                  ParentId = 0
               },
               new Menu(){
                  Title = "Tổ chức bộ máy",
                  Url = "/page/8",
                  ParentId = 0
               },new Menu(){
                  Title = "Công dân",
                  Url = "/page/9",
                  ParentId = 0
               },new Menu(){
                  Title = "Doanh nghiệp",
                  Url = "/page/10",
                  ParentId = 0
               }
            };
        }

        private static IEnumerable<FieldNews> GetFieldNews()
        {
            return new List<FieldNews>
               {
                   new FieldNews()
                   {
                      Title = "An ninh - Quốc phòng",
                      Order = 0,
                      Description = "An ninh - Quốc phòng",
                      Factor = 1.5M,
                      BiggestFactor = 2,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                      NewsPosts = new List<NewsPost>(){
                        new NewsPost()
                   {
                     Title = "Bộ Công an trả lời ý kiến kiến nghị của cử tri tỉnh Yên Bái",
                    PublishedDate = DateTime.Now,
                    Description = "CTTĐT - Cử tri Yên Bái có ý kiến kiến nghị với Bộ Công an trình Quốc hội sớm xem xét, thông qua Luật Lực lượng tham gia bảo vệ an ninh, trật tự ở cơ sở để thống nhất quy định chức năng, nhiệm vụ, hoạt động, chế độ chính sách và trách nhiệm quản lý nhà nước đối vói lực lượng tham gia bảo vệ an ninh, trật tự ở cơ sở nhằm hoàn thiện hệ thống pháp luật về an ninh, trật tự, thể chế hóa quan điểm, định hướng trong các văn bản, nghị quyết của Đảng về xây dựng, củng cố, duy trì lực lượng tham gia bảo vệ an ninh, trật tự ở cơ sở.",
                    IsHotNews = false,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/_giu-vung-an-ninh.jpg",
                    AvatarTitle = "Ảnh minh họa",
                    CategoryNewsId = 2,

                   }, new NewsPost()
                   {
                     Title = "Tạm hoãn xét nghĩa vụ quân sự với nam công dân là thí sinh",
                    PublishedDate = DateTime.Now,
                    Description = "Bộ Quốc phòng đã đồng ý với ý kiến đề xuất của Bộ Giáo dục và Đào tạo (GD&ĐT) về cấp giấy tạm hoãn nghĩa vụ quân sự.",
                    IsHotNews = false,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Mai-Hien/2022/Qu%C3%BD%203/nghiavuquansu.png",
                    AvatarTitle = "Ảnh minh họa",
                    CategoryNewsId = 5,

                   },
                      }
                   },
                   new FieldNews()
                   {
                      Title = "Chương trình công tác tháng",
                      Order = 0,
                      Description = "Chương trình công tác tháng",
                      Factor = 4.5M,
                      BiggestFactor = 5,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        NewsPosts = new List<NewsPost>(){
                        new NewsPost()
                   {
                     Title = "UBND tỉnh chỉ đạo tăng cường phòng, chống bệnh Đậu mùa khỉ",
                    PublishedDate = DateTime.Now,
                    Description = "CTTĐT - UBND tỉnh vừa ban hành công văn số 3340/UBND-VX yêu cầu các sở, ban, ngành của tỉnh; Công an tỉnh; Bộ Chỉ huy quân sự tỉnh; Báo Yên Bái; Đài Phát thanh và Truyền hình tỉnh; UBND các huyện, thị xã, thành phố về việc tăng cường phòng, chống bệnh Đậu mùa khỉ.",
                    IsHotNews = false,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/dau%20mua%20khi%20282022.jpg",
                    AvatarTitle = "Ảnh minh họa",
                    CategoryNewsId = 5,

                   }, new NewsPost()
                   {
                     Title = "Thông tin chỉ đạo điều hành nổi bật của UBND tỉnh Yên Bái trong tuần công tác từ 26/9-2/10/2022",
                    PublishedDate = DateTime.Now,
                    Description = "CTTĐT - Tổ chức phong trào thi đua Yên Bái chung tay vì người nghèo - Không để ai bị bỏ lại phía sau giai đoạn 2021 - 2025; Điều chỉnh, bổ sung Kế hoạch thực hiện Chương trình về định hướng chiến lược địa chất, khoáng sản và công nghiệp khai khoáng đến năm 2030, tầm nhìn đến năm 2045; kế hoạch thực hiện Đề án “Hỗ trợ học sinh, sinh viên khởi nghiệp giai đoạn 2022 - 2025” tại các cơ sở giáo dục nghề nghiệp; tổ chức các hoạt động hưởng ứng Chiến dịch Làm cho thế giới sạch hơn năm 2022; Kế hoạch tổ chức các hoạt động hưởng ứng tháng cao điểm “Ngày Pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam” năm 2022… là các thông tin chỉ đạo điều hành nổi bật của UBND tỉnh Yên Bái trong tuần công tác từ 26/9-2/10/2022.",
                    IsHotNews = true,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thanh-Thuy/2019/Hoinghi/c%C4%91htuanqqqq.jpg",
                    AvatarTitle = "Ảnh minh họa",
                    CategoryNewsId = 5,

                   },
                      }
                   }
               };
        }
        private static IEnumerable<VideoCategory> GetVideoCategories()
        {
            return new List<VideoCategory>()
            { new VideoCategory(){
                  Title = "Chương trình hành động 190 của Tỉnh ủy: Tạo đà bứt phá cho Yên Bái phát triển",
                  Videos = new List<Video>{

                     new Video(){
                        Title = "Yên Bái: Đột phá trong công tác thu ngân sách năm 2019",
                        Avatar = "https://yenbai.gov.vn/noidung/hinhanhvideo/PublishingImages/Tien%20Lap/Nam%202020/vlcsnap-2020-01-08-13h49m25s417.jpg",
                        LinkVideo = @"
                       
	<div id='player'>Tr´nh duy?t không h? tr? xem tr?c tuy?n</div>
	<script type='text/javascript'>	
	jwplayer('player').setup({
		playlist: [{image:'/Asset/live/images/play.jpg',
		sources: [{
		file: 'https://video.yenbai.gov.vn:8080/Video/portal/thuvienvideo/thu_ngan_sach_yen bai.mp4',
		type: 'mp4'
		}]
		}],	
		autostart: 'true',
		aspectratio: '16:9',
		skin: 'five',	
		logo: {
				 file: '/Asset/live/images/logo.png',
				 link: 'http://yenbai.gov.vn',
			  },
		primary: 'html5',
		
		httpstreaming: {
				levels: [
					{ bitrate: 150, label: '150k' },
					{ bitrate: 500, label: '500k', isDefault: true },
					{ bitrate: 700, label: '700k' },
					{ bitrate: 1000, label: '1000k' },
					{ bitrate: 1500, label: '1500k' }
				]
		}
	});
	</script>
                        ",
                     }, new Video(){
                        Title = "Sự kiện tháng 5",
                        Avatar = "https://yenbai.gov.vn/noidung/hinhanhvideo/PublishingImages/Tran-Hung/a111.jpg",
                        LinkVideo = @"
                    <div id='player'>Trình duyệt không hỗ trợ xem trực tuyến</div>
	<script type='text/javascript'>	
	jwplayer('player').setup({
		playlist: [{image:'/Asset/live/images/play.jpg',
		sources: [{
		file: 'https://video.yenbai.gov.vn:8080/Video/Sukientrongthang/sukienthang5_2017.mp4',
		type: 'mp4'
		}]
		}],	
		autostart: 'true',
		aspectratio: '16:9',
		skin: 'five',	
		logo: {
				 file: '/Asset/live/images/logo.png',
				 link: 'http://yenbai.gov.vn',
			  },
		primary: 'html5',
		
		httpstreaming: {
				levels: [
					{ bitrate: 150, label: '150k' },
					{ bitrate: 500, label: '500k', isDefault: true },
					{ bitrate: 700, label: '700k' },
					{ bitrate: 1000, label: '1000k' },
					{ bitrate: 1500, label: '1500k' }
				]
		}
	});
	</script>
                        ",
                     }
                  }
               },
               new VideoCategory(){
                  Title = "10 sự kiện và thành tựu nổi bật tỉnh Yên Bái năm 2020",
                  Videos = new List<Video>{

                     new Video(){
                        Title = "9 điểm du lịch hấp dẫn nhất Yên Bái",
                        Avatar = "https://yenbai.gov.vn/noidung/hinhanhvideo/Publish…es/Tien%20Lap/vlcsnap-2020-01-01-09h01m43s671.png",
                        LinkVideo = @"
                        <div id='player'>Trình duyệt không hỗ trợ xem trực tuyến</div>
	<script type='text/javascript'>	
	jwplayer('player').setup({
		playlist: [{image:'/Asset/live/images/play.jpg',
		sources: [{
		file: 'https://video.yenbai.gov.vn:8080/Video/portal/thuvienvideo/20170103-10thanhtuu-2016.mp4',
		type: 'mp4'
		}]
		}],	
		autostart: 'true',
		aspectratio: '16:9',
		skin: 'five',	
		logo: {
				 file: '/Asset/live/images/logo.png',
				 link: 'http://yenbai.gov.vn',
			  },
		primary: 'html5',
		
		httpstreaming: {
				levels: [
					{ bitrate: 150, label: '150k' },
					{ bitrate: 500, label: '500k', isDefault: true },
					{ bitrate: 700, label: '700k' },
					{ bitrate: 1000, label: '1000k' },
					{ bitrate: 1500, label: '1500k' }
				]
		}
	});
	</script>
                        ",
                     }, new Video(){
                        Title = "Chiến thắng Tây Bắc - Cuộc kháng chiến chống thực dân Pháp tiến lên giành thắng lợi quyết định",
                        Avatar = "https://yenbai.gov.vn/noidung/hinhanhvideo/PublishingImages/Tran-Hung/t6.jpg",
                        LinkVideo = @"
                       <div id='player'>Tr´nh duy?t không h? tr? xem tr?c tuy?n</div>
	<script type='text/javascript'>	
	jwplayer('player').setup({
		playlist: [{image:'/Asset/live/images/play.jpg',
		sources: [{
		file: 'https://video.yenbai.gov.vn:8080/Video/portal/thuvienvideo/2018_02_14_chu_tich_chuc_tet2018.mp4',
		type: 'mp4'
		}]
		}],	
		autostart: 'true',
		aspectratio: '16:9',
		skin: 'five',	
		logo: {
				 file: '/Asset/live/images/logo.png',
				 link: 'http://yenbai.gov.vn',
			  },
		primary: 'html5',
		
		httpstreaming: {
				levels: [
					{ bitrate: 150, label: '150k' },
					{ bitrate: 500, label: '500k', isDefault: true },
					{ bitrate: 700, label: '700k' },
					{ bitrate: 1000, label: '1000k' },
					{ bitrate: 1500, label: '1500k' }
				]
		}
	});
	</script>
                        ",
                     }
                  }
               }
            };
        }

        private static IEnumerable<NewsPost> GetNewsPostV2()
        {
            return new List<NewsPost>
            {
                new NewsPost()
                   {
                     Title = "Hội nghị bàn các giải pháp tháo gỡ khó khăn cho các doanh nghiệp chế biến nông, lâm sản",
                    PublishedDate = DateTime.Now,
                    Description = "CTTĐT - Chiều 6/10, Sở Công Thương tổ chức Hội nghị các doanh nghiệp sản xuất chế biến nông, lâm sản, thực phẩm trên địa bàn tỉnh năm 2022; bàn giải pháp tháo gỡ khó khăn cho các doanh nghiệp hoạt động ổn định và phát triển trong thời gian tới.",
                    IsHotNews = true,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Hien-Trang/hoi%20nghi/06102022_hoinghidoanhnghiepchebien.jpg",
                    AvatarTitle = "Quang cảnh hội nghị.",
                    CategoryNewsId = 1,
                      FieldNews =  new FieldNews()
                   {
                      Title = "Chương trình công tác tháng",
                      Order = 0,
                      Description = "Chương trình công tác tháng",
                      Factor = 4.5M,
                      BiggestFactor = 5,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                   },
                   new NewsPost()
                   {
                     Title = "Phó Chủ tịch Thường trực UBND tỉnh Nguyễn Thế Phước tham dự sinh hoạt chi bộ thôn Thanh Lương, xã Tân Thịnh, thành phố Yên Bái",
                    PublishedDate = DateTime.Now,
                    IsHotNews = true,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                   Description = "CTTĐT - Chiều 6/10, đồng chí Nguyễn Thế Phước - Ủy viên Ban Thường vụ Tỉnh ủy, Phó Chủ tịch Thường trực UBND tỉnh dự buổi sinh hoạt Chi bộ thôn Thanh Lương, xã Tân Thịnh, Thành phố Yên Bái. Cùng dự buổi sinh hoạt có lãnh đạo Thành ủy Yên Bái.",
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thanh-Thuy/2019/Hoinghi/anhphuoc-thanhluong2.jpg",
                    AvatarTitle = "Đồng chí Nguyễn Thế Phước - Phó Chủ tịch Thường trực UBND tỉnh phát biểu tại Hội nghị",
                    CategoryNewsId = 1

                   },
                      new NewsPost()
                   {
                     Title = "Yên Bái ban hành Quy định điều kiện, trình tự, thủ tục, hồ sơ xét, công nhận, công bố và thu hồi quyết định công nhận thôn (bản) đạt chuẩn NTM; thôn (bản) đạt chuẩn NTM kiểu mẫu trên địa bàn tỉnh giai đoạn 2021-2025",
                    PublishedDate = DateTime.Now,
                    IsHotNews = true,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                   Description = "CTTĐT - Tại Quyết định số 1739/QĐ-UBND ban hành ngày 04/10/2022, UBND tỉnh đã Quy định điều kiện, trình tự, thủ tục, hồ sơ xét, công nhận, công bố và thu hồi quyết định công nhận thôn (bản) đạt chuẩn NTM; thôn (bản) đạt chuẩn NTM kiểu mẫu trên địa bàn tỉnh giai đoạn 2021-2025.",
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/200090_lang-van-hoa.jpg",
                    AvatarTitle = "Cổng vào Làng văn hóa thôn Làng Già, xã Yên Thắng, huyện Lục Yên - thôn nông thôn mới kiểu mẫu",
                    CategoryNewsId = 5
                   },
                    new NewsPost()
                   {
                     Title = "Tăng cường công tác chăm sóc sức khỏe người lao động và phòng chống bệnh nghề nghiệp",
                    PublishedDate = DateTime.Now,
                    IsHotNews = true,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                   Description = "CTTĐT - UBND tỉnh vừa ban hành công văn số 3341/UBND-VX yêu cầu các sở, ban, ngành của tỉnh; UBND các huyện, thị xã, thành phố và các đơn vị liên quan về việc tăng cường công tác chăm sóc sức khỏe người lao động và phòng chống bệnh nghề nghiệp.",
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/185331_dam-bao-van-hanh.jpg",
                    AvatarTitle = "Công ty Điện lực Yên Bái khám sức khỏe định kỳ cho cán bộ, công nhân viên và người lao động.",
                    CategoryNewsId = 5

                   },
                    new NewsPost()
                   {
                     Title = "Nhiều hoạt động đặc sắc tại Lễ hội Quế Văn Yên năm 2022",
                    PublishedDate = DateTime.Now,
                    IsHotNews = true,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                   Description = "CTTĐT - Lễ hội Quế huyện Văn Yên lần thứ IV năm 2022 với chủ đề “Quế Văn Yên - khát vọng vươn xa” sẽ diễn ra trong 2 ngày 14 và 15/10/2022 với nhiều hoạt động văn hóa, nghệ thuật, du lịch đặc sắc đón chào du khách gần xa.",
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/le%20hoi%20que%20vy%205102022.jpg",
                    AvatarTitle = "Lễ khai mạc lễ hội sẽ diễn ra vào tối ngày 14/10",
                    CategoryNewsId = 6
                   },
                    new NewsPost()
                   {
                     Title = "Hội LHPN huyện Văn Yên tổ chức Chung kết Hội thi tìm hiểu Nghị quyết Đại hội phụ nữ các cấp năm 2022",
                    PublishedDate = DateTime.Now,
                    IsHotNews = false,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                   Description = "CTTĐT - Sáng ngày 4/10, Hội LHPN huyện Văn Yên tổ chức Chung kết Hội thi tìm hiểu Nghị quyết Đại hội đại biểu phụ nữ toàn quốc lần thứ 13, Nghị quyết Đại hội đại biểu phụ nữ tỉnh và Nghị quyết Đại hội đại biểu phụ nữ huyện Văn Yên lần thứ 16.",
                    Avatar = "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/trao%20giai%20nhat%204102022.jpg",
                    AvatarTitle = "Ban Tổ chức đã trao giải nhất cho thí sinh Nguyễn Thị Bích Liên - Phó Chủ tịch Hội LHPN xã Viễn Sơn",
                    CategoryNewsId = 5

                   }
            };
        }
        private static IEnumerable<QuestionCategory> GetQuestionCategory()
        {
            return new List<QuestionCategory>
            {
               new QuestionCategory(){
                  Title= "Chính sách",
                  Questions = new List<Question>(){
                     new Question(){
                        Title = "Hỏi đáp về thủ tục mở cơ sở kinh doanh tại tỉnh Yên Bái",
                        AskedPersonName = "Nguyễn Văn Tuấn",
                        Address = "Số 27C đường số 12, phường Hiệp Bình Phước, thành phố Thủ Đức, thành phố Hồ Chí Minh",
                        Phone = "0888778964",
                        Email = "mayhutamkosmen@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "Chào quý cơ quan! Công ty Cổ phần Kosmen chúng tôi đang có kế hoạch",
                        IsNoticed = false,
                        QuestionStatus = QuestionStatus.APPROVED_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 30
                     },new Question(){
                        Title = "Đất 50 năm",
                        AskedPersonName = "Trần Thị Lâm",
                        Address = "Thôn Mình Thành- xã Tuy Lộc- Yên Bái",
                        Phone = "0974942905",
                        Email = "mayhutamkosmen@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "ôi ở xã Tuy Lộc, thành phố Yên Bái. Hiện nay tôi đang ở trên diện tích đất của bố mẹ c",
                        IsNoticed = true,
                        QuestionStatus = QuestionStatus.NEW_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 20
                     },new Question(){
                        Title = "Hỗ trợ các trường hợp F1 cách ly tại nhà trước ngày 31/12/2021",
                        AskedPersonName = "Chu Thị Phượng",
                        Address = "Thôn Thanh Lương - xã Tân Thịnh - Thành phố Yên Bái",
                        Phone = "0372317775",
                        Email = "chuphuongmt1d11@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "heo Quyết định số 23/2021/QĐ-TTg ngày 07/7/2021 được hỗ trợ tiền ăn với số tiền hỗ trợ là 80.000đ/ngày. Sau khi hoàn thành cách ly, gia đình tôi được hướng dẫn làm hồ sơ",
                        IsNoticed = false,
                        QuestionStatus = QuestionStatus.NEW_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 50
                     },new Question(){
                        Title = "Cột bơm xăng mọc lên trái phép tại địa bàn huyện Lục Yên, tỉnh Yên Bái",
                        AskedPersonName = "Nguyễn Văn Sáng",
                        Address = "Số 27C đường số 12, phường Hiệp Bình Phước, thành phố Thủ Đức, thành phố Hồ Chí Minh",
                        Phone = "0888778964",
                        Email = "mayhutamkosmen@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "Hiện nay, trên địa bàn huyện Lục Yên, tỉnh Yên Bái xảy",
                        IsNoticed = true,
                        QuestionStatus = QuestionStatus.WAITING_ANSWER_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 30
                     }
                  }
               }, new QuestionCategory(){
                  Title= "Giáo dục",
                  Questions = new List<Question>(){
                     new Question(){
                        Title = "Xin Giấy Phép Mở Trại Chăn Nuôi",
                        AskedPersonName = "Trần Hoàng Phát",
                        Address = "312 Nguyễn Văn Cừ",
                        Phone = "0888778964",
                        Email = "traigaminhtri@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "Tôi hiện nay đang ở Hà Nội, muốn về tỉnh Yên Bái để phát triển kinh d",
                        IsNoticed = false,
                        QuestionStatus = QuestionStatus.APPROVED_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 66
                     },new Question(){
                        Title = "Thăng hạng",
                        AskedPersonName = "Vũ Thị Thanh Vân",
                        Address = "Thị Trấn Trạm Tấu",
                        Phone = "0988179490",
                        Email = "mayhutamkosmen@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "Tôi xin hỏi cơ quan chức năng một việc như sau:Bản ",
                        IsNoticed = true,
                        QuestionStatus = QuestionStatus.NEW_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 22
                     },new Question(){
                        Title = "Hỏi về diện tích tích chênh lệch thực tế nhiều hơn so với giấy chứng nhận quyền sử dụng đất và nghĩa vụ thuế phải nộp",
                        AskedPersonName = "Phùng Quang Hưng",
                        Address = "ngõ 50 tổ 9 đường hòa bình phường Nguyễn Thái Học. TP Yên Bái",
                        Phone = "0983284786",
                        Email = "phungquanghungyb88@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "ên tôi là Phùng Quang Hưng, sinh ngày 28/5/1988. Địa chỉ: Ngõ 50",
                        IsNoticed = true,
                        QuestionStatus = QuestionStatus.WAITING_ANSWER_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 77
                     },new Question(){
                        Title = "Mở chi nhánh công ty thu mua phế liệu tại Yên Bá",
                        AskedPersonName = "Nguyễn Đức",
                        Address = "Hà Nội",
                        Phone = "0958767889",
                        Email = "mayhutamkosmen@gmail.com",
                        AnswerDate = DateTime.Now,
                        QuestionContent = "Chúng tôi là Công ty Thịnh Phát chuyên về dịch vụ thu mua phế liệu cho các xưởng sản x",
                        IsNoticed = true,
                        QuestionStatus = QuestionStatus.WAITING_APPROVED_QUESTION,
                           CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        Views = 49
                     }
                  }
               }
            };
        }
        private static IEnumerable<User> GetUsers()
        {
            return new List<User>(){
               new User(){
                  Username = "admin",
                  Password = "123"
               },
                new User(){
                  Username = "siteadmin",
                  Password = "123"
               }
            };
        }

        private static IEnumerable<Rating> GetRatings()
        {

            return new List<Rating>()
            {
               new Rating("Văn phòng UBND",15,2,6,7,1),
               new Rating("Sở tài nguyên môi trường",18,5,2,1,2),
               new Rating("Sở ngoại vụ",10,5,2,4,8),
            };
        }

        private static IEnumerable<NewsPost> GetNewsPost()
        {
            return new List<NewsPost>
               {
                   new NewsPost()
                   {
                      CategoryNews =  new CategoryNews()
                   {
                      CategoryNewsName = "Tin tức",
                      Order = 0,
                      ParentId = 0,
                      FieldNews_SK_FK = 1,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                       FieldNews = new FieldNews()
                   {
                      Title = "An ninh - Quốc phòng",
                      Order = 0,
                      Description = "An ninh - Quốc phòng",
                      Factor = 1.5M,
                      BiggestFactor = 2,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",

                   },
                   },
                      Title = "Văn Chấn yêu cầu chủ động phòng ngừa, ứng phó thiên tai những tháng cuối năm 2022",
                    PublishedDate = DateTime.Now,
                    IsHotNews = true,
                    IsVideoNews = false,
                    IsShowTitle = true,
                    IsShowAvatar = true,
                    IsShowComment = true,
                    Avatar = "avatar.png",
                    AvatarTitle = "AvatarTitle",
                    FieldNews =  new FieldNews()
                   {
                      Title = "Chương trình công tác tháng",
                      Order = 0,
                      Description = "Chương trình công tác tháng",
                      Factor = 4.5M,
                      BiggestFactor = 5,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                    SourceNews =  new SourceNews()
                   {
                       Title = "Bộ Lao động - Thương binh và Xã hội",
                      Order = 0,
                      Description = "Bộ Lao động - Thương binh và Xã hội",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                   Collaborator =    new Collaborator()
                   {
                      Name = "A Cớ",
                      BirthDate = DateTime.Now,
                      Username = "abcabc123",
                      Address = "123 Lạc long quân",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                      Comments = new List<Comment>(){
                        new Comment(){
                           Username = "BVMINH",
                           Content = "That tuyet voi",
                             CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        }

                      }
                   },
                  new NewsPost()
                   {
                      CategoryNews =  new CategoryNews()
                   {
                      CategoryNewsName = "Tin tức",
                      Order = 0,
                      ParentId = 0,
                      FieldNews_SK_FK = 1,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                      FieldNews = new FieldNews()
                   {
                      Title = "An ninh - Quốc phòng",
                      Order = 0,
                      Description = "An ninh - Quốc phòng",
                      Factor = 1.5M,
                      BiggestFactor = 2,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",

                   },
                   },
                      Title = "Yên Bái tăng cường công tác chống buôn lậu, gian lận thương mại và hàng giả trên địa bàn nội địa",
                    PublishedDate = DateTime.Now,
                    IsHotNews = false,
                    IsVideoNews = true,
                    IsShowTitle = false,
                    IsShowAvatar = true,
                    IsShowComment = false,
                    Avatar = "avatar1.png",
                    AvatarTitle = "AvatarTitle1",
                    FieldNews =   new FieldNews()
                   {
                      Title = "Chương trình công tác tháng",
                      Order = 0,
                      Description = "Chương trình công tác tháng",
                      Factor = 4.5M,
                      BiggestFactor = 5,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                    SourceNews =  new SourceNews()
                   {
                      Title = "Báo Tin tức TTXVN",
                      Order = 0,
                      Description = "Báo Tin tức TTXVN",

                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                   Collaborator =     new Collaborator()
                   {
                      Name = "A Cớ",
                      BirthDate = DateTime.Now,
                      Username = "cccc123",
                      Address = "123 Thuỵ Khuê",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                       Comments = new List<Comment>(){
                        new Comment(){
                           Username = "KIENHT12",
                           Content = "This one is awesome",
                             CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        },
                        new Comment(){
                           Username = "DVHUNG1",
                           Content = "amzing gút chóp",
                             CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                        }
                      }
                   },
               };
        }


        private static IEnumerable<CategoryNews> GetCategoryNews()
        {
            return new List<CategoryNews>
               {
                    new CategoryNews()
                   {
                      CategoryNewsName = "Tin Tức",
                      Order = 0,
                      ParentId = 0,

                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                     new CategoryNews()
                   {
                      CategoryNewsName = "Dư địa chí YB",
                      Order = 0,
                      ParentId = 0,

                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                     new CategoryNews()
                   {
                      CategoryNewsName = "Tin giao thông",
                      Order = 0,
                      ParentId = 0,

                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
               };
        }

        private static IEnumerable<CategoryNews> GetCategoryParentsNews()
        {
            return new List<CategoryNews>
               {
                    new CategoryNews()
                   {
                      CategoryNewsName = "Chính sách mới",
                      Order = 0,
                      ParentId = 1,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                     new CategoryNews()
                   {
                      CategoryNewsName = "Tin trong tỉnh",
                      Order = 0,
                      ParentId = 1,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                     new CategoryNews()
                   {
                      CategoryNewsName = "Tin Sở ngành địa phương",
                      Order = 0,
                      ParentId = 1,
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
               };
        }


        private static IEnumerable<SourceNews> GetSourceNews()
        {
            return new List<SourceNews>
               {
                   new SourceNews()
                   {
                      Title = "Báo Tin tức TTXVN",
                      Order = 0,
                      Description = "Báo Tin tức TTXVN",

                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                   new()
                   {
                       Title = "Bộ Lao động - Thương binh và Xã hội",
                      Order = 0,
                      Description = "Bộ Lao động - Thương binh và Xã hội",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   }
               };
        }

        private static IEnumerable<Collaborator> GetCollaborators()
        {
            return new List<Collaborator>
               {
                   new Collaborator()
                   {
                      Name = "A Cớ",
                      BirthDate = DateTime.Now,
                      Username = "abcabc123",
                      Address = "123 Lạc long quân",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
                   new Collaborator()
                   {
                      Name = "A Cớ",
                      BirthDate = DateTime.Now,
                      Username = "cccc123",
                      Address = "123 Thuỵ Khuê",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                   },
               };
        }

        private static IEnumerable<DocumentField> GetDocumentFields()
        {
            return new List<DocumentField>(){
               new DocumentField(){
                     Title = "Giáo dục và đào tạo thuộc hệ thống giáo dục quốc dân và các cơ sở giáo dục khác",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentField(){
                     Title = "Đăng ký giao dịch bảo đảm",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentField(){
                     Title = "Đất đai",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentField(){
                     Title = "Giao thông vận tải",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               }
            };
        }
        private static IEnumerable<DocumentType> GetDocumentTypes()
        {
            return new List<DocumentType>(){
               new DocumentType(){
                     Title = "Báo cáo",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentType(){
                     Title = "Chỉ thị",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentType(){
                     Title = "Công điện",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentType(){
                     Title = "Công văn",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               }
            };
        }
        private static IEnumerable<DocumentDepartment> GetDocumentDepartments()
        {
            return new List<DocumentDepartment>(){
               new DocumentDepartment(){
                     Title = "Ban An toàn giao thông",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentDepartment(){
                     Title = "Hội đồng nhân dân tỉnh Yên Bái",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentDepartment(){
                     Title = "Sở Tư Pháp",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentDepartment(){
                     Title = "UBND Tỉnh",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               }
            };
        }
        private static IEnumerable<DocumentSignPerson> GetDocumentSignPersons()
        {
            return new List<DocumentSignPerson>(){
               new DocumentSignPerson(){
                     Title = "Đinh Khắc Yên",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentSignPerson(){
                     Title = "Đỗ Đức Duy",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentSignPerson(){
                     Title = "Đỗ Việt Bách",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               },new DocumentSignPerson(){
                     Title = "Lê Phương Khanh",
                     CreatedBy = "SystemAdmin",
                     LastModifiedBy = "SystemAdmin",
               }
            };
        }

        private static IEnumerable<Document> GetDocuments()
        {
            return new List<Document>
               {
                   new()
                   {
                       Code = "3378/UBND-XD",
                       Name = "Công văn về việc tăng cường quản lý tạm ứng vốn đầu tư công nguồn NSNN trên địa bàn tỉnh Yên Bái",
                       ExpiredDate = DateTime.Now,
                       PublishedDate = DateTime.Now,
                       FilePath = "abc/xyz/aaa.pdf",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                     DocumentDepartmentId =1,
                     DocumentFieldId =2,
                     DocumentTypeId =3,
                     DocumentSignPersonId =1
                   },
                   new()
                   {
                      Code = "3365/UBND-NLN",
                       Name = "Công văn về việc thực hiện Quyết định số 942/QĐ-TTg ngày 05/8/2022 của Thủ tướng Chính phủ về việc phê duyệt Kế hoạch hành động giảm phát thải khí mê-tan đến năm 2030",
                       ExpiredDate = DateTime.Now,
                       PublishedDate = DateTime.Now,
                       FilePath = "abc/xyz/ccc.pdf",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                      DocumentDepartmentId =2,
                     DocumentFieldId =2,
                     DocumentTypeId =4,
                     DocumentSignPersonId =1
                   },
                   new()
                   {
                      Code = "3313/UBND-VX",
                       Name = "Công văn về việc thực hiện Quyết định số 1079/QĐ-TTg ngày 14/9/2022 của Thủ tướng Chính phủ",
                       ExpiredDate = DateTime.Now,
                       PublishedDate = DateTime.Now,
                       FilePath = "abc/xyz/eee.pdf",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                      DocumentDepartmentId =1,
                     DocumentFieldId =3,
                     DocumentTypeId =2,
                     DocumentSignPersonId =2
                   },
                   new()
                   {
                      Code = "206/KH-BATGT",
                       Name = "Kế hoạch Kiểm tra công tác bảo đảm trật tự an toàn giao thông tại các địa phương năm 2022",
                       ExpiredDate = DateTime.Now,
                       PublishedDate = DateTime.Now,
                       FilePath = "abc/xyz/dđ.pdf",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                      DocumentDepartmentId =1,
                     DocumentFieldId =2,
                     DocumentTypeId =3,
                     DocumentSignPersonId =4
                   },
                   new()
                   {
                      Code = "203./KH-UBND",
                       Name = "Kế hoạch tổ chức các hoạt động hưởng ứng tháng cao điểm “Ngày Pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam” năm 2022 trên địa bàn tỉnh Yên Bái (Gửi file có thêm QĐ kiện toàn Hội đồng)",
                       ExpiredDate = DateTime.Now,
                       PublishedDate = DateTime.Now,
                       FilePath = "abc/xyz/zzz.pdf",
                      CreatedBy = "SystemAdmin",
                      LastModifiedBy ="SystemAdmin",
                      DocumentDepartmentId =4,
                     DocumentFieldId =3,
                     DocumentTypeId =2,
                     DocumentSignPersonId =1
                   }
               };
        }
    }
}


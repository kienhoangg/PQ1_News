import routes from "config/configRoutes";

const datafakeHome = {
    "NewsHots": [
        {
            "Id": 1,
            "Title": "Phó Chủ tịch Thường trực UBND tỉnh Nguyễn Thế Phước tham dự sinh hoạt chi bộ thôn Thanh Lương, xã Tân Thịnh, thành phố Yên Bái",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
            "IsHotNews": true,
            "IsVideoNews": false,
            "IsShowTitle": true,
            "IsShowAvatar": true,
            "IsShowComment": true,
            "AvatarTitle": "Đồng chí Nguyễn Thế Phước - Phó Chủ tịch Thường trực UBND tỉnh phát biểu tại Hội nghị",
            "Description": "CTTĐT - Chiều 6/10, đồng chí Nguyễn Thế Phước - Ủy viên Ban Thường vụ Tỉnh ủy, Phó Chủ tịch Thường trực UBND tỉnh dự buổi sinh hoạt Chi bộ thôn Thanh Lương, xã Tân Thịnh, Thành phố Yên Bái. Cùng dự buổi sinh hoạt có lãnh đạo Thành ủy Yên Bái.",
            "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thanh-Thuy/2019/Hoinghi/anhphuoc-thanhluong2.jpg",
            "CreatedDate": "2022-10-13T13:20:16.046+00:00",
            "Status": 0
        },
        {
            "Id": 2,
            "Title": "Yên Bái ban hành Quy định điều kiện, trình tự, thủ tục, hồ sơ xét, công nhận, công bố và thu hồi quyết định công nhận thôn (bản) đạt chuẩn NTM; thôn (bản) đạt chuẩn NTM kiểu mẫu trên địa bàn tỉnh giai đoạn 2021-2025",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
            "IsHotNews": true,
            "IsVideoNews": false,
            "IsShowTitle": true,
            "IsShowAvatar": true,
            "IsShowComment": true,
            "AvatarTitle": "Cổng vào Làng văn hóa thôn Làng Già, xã Yên Thắng, huyện Lục Yên - thôn nông thôn mới kiểu mẫu",
            "Description": "CTTĐT - Tại Quyết định số 1739/QĐ-UBND ban hành ngày 04/10/2022, UBND tỉnh đã Quy định điều kiện, trình tự, thủ tục, hồ sơ xét, công nhận, công bố và thu hồi quyết định công nhận thôn (bản) đạt chuẩn NTM; thôn (bản) đạt chuẩn NTM kiểu mẫu trên địa bàn tỉnh giai đoạn 2021-2025.",
            "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/200090_lang-van-hoa.jpg",
            "CreatedDate": "2022-10-13T13:20:16.046+00:00",
            "Status": 0
        },
        {
            "Id": 3,
            "Title": "Tăng cường công tác chăm sóc sức khỏe người lao động và phòng chống bệnh nghề nghiệp",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
            "IsHotNews": true,
            "IsVideoNews": false,
            "IsShowTitle": true,
            "IsShowAvatar": true,
            "IsShowComment": true,
            "AvatarTitle": "Công ty Điện lực Yên Bái khám sức khỏe định kỳ cho cán bộ, công nhân viên và người lao động.",
            "Description": "CTTĐT - UBND tỉnh vừa ban hành công văn số 3341/UBND-VX yêu cầu các sở, ban, ngành của tỉnh; UBND các huyện, thị xã, thành phố và các đơn vị liên quan về việc tăng cường công tác chăm sóc sức khỏe người lao động và phòng chống bệnh nghề nghiệp.",
            "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/185331_dam-bao-van-hanh.jpg",
            "CreatedDate": "2022-10-13T13:20:16.046+00:00",
            "Status": 0
        },
        {
            "Id": 4,
            "Title": "Nhiều hoạt động đặc sắc tại Lễ hội Quế Văn Yên năm 2022",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
            "IsHotNews": true,
            "IsVideoNews": false,
            "IsShowTitle": true,
            "IsShowAvatar": true,
            "IsShowComment": true,
            "AvatarTitle": "Lễ khai mạc lễ hội sẽ diễn ra vào tối ngày 14/10",
            "Description": "CTTĐT - Lễ hội Quế huyện Văn Yên lần thứ IV năm 2022 với chủ đề “Quế Văn Yên - khát vọng vươn xa” sẽ diễn ra trong 2 ngày 14 và 15/10/2022 với nhiều hoạt động văn hóa, nghệ thuật, du lịch đặc sắc đón chào du khách gần xa.",
            "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/le%20hoi%20que%20vy%205102022.jpg",
            "CreatedDate": "2022-10-13T13:20:16.046+00:00",
            "Status": 0
        },
        {
            "Id": 6,
            "Title": "Hội nghị bàn các giải pháp tháo gỡ khó khăn cho các doanh nghiệp chế biến nông, lâm sản",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
            "IsHotNews": true,
            "IsVideoNews": false,
            "IsShowTitle": true,
            "IsShowAvatar": true,
            "IsShowComment": true,
            "AvatarTitle": "Quang cảnh hội nghị.",
            "Description": "CTTĐT - Chiều 6/10, Sở Công Thương tổ chức Hội nghị các doanh nghiệp sản xuất chế biến nông, lâm sản, thực phẩm trên địa bàn tỉnh năm 2022; bàn giải pháp tháo gỡ khó khăn cho các doanh nghiệp hoạt động ổn định và phát triển trong thời gian tới.",
            "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Hien-Trang/hoi%20nghi/06102022_hoinghidoanhnghiepchebien.jpg",
            "CreatedDate": "2022-10-13T13:20:16.046+00:00",
            "Status": 0
        },
        {
            "Id": 10,
            "Title": "Thông tin chỉ đạo điều hành nổi bật của UBND tỉnh Yên Bái trong tuần công tác từ 26/9-2/10/2022",
            "PublishedDate": "2022-10-13T20:20:16.035Z",
            "IsHotNews": true,
            "IsVideoNews": false,
            "IsShowTitle": true,
            "IsShowAvatar": true,
            "IsShowComment": true,
            "AvatarTitle": "Ảnh minh họa",
            "Description": "CTTĐT - Tổ chức phong trào thi đua Yên Bái chung tay vì người nghèo - Không để ai bị bỏ lại phía sau giai đoạn 2021 - 2025; Điều chỉnh, bổ sung Kế hoạch thực hiện Chương trình về định hướng chiến lược địa chất, khoáng sản và công nghiệp khai khoáng đến năm 2030, tầm nhìn đến năm 2045; kế hoạch thực hiện Đề án “Hỗ trợ học sinh, sinh viên khởi nghiệp giai đoạn 2022 - 2025” tại các cơ sở giáo dục nghề nghiệp; tổ chức các hoạt động hưởng ứng Chiến dịch Làm cho thế giới sạch hơn năm 2022; Kế hoạch tổ chức các hoạt động hưởng ứng tháng cao điểm “Ngày Pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam” năm 2022… là các thông tin chỉ đạo điều hành nổi bật của UBND tỉnh Yên Bái trong tuần công tác từ 26/9-2/10/2022.",
            "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thanh-Thuy/2019/Hoinghi/c%C4%91htuanqqqq.jpg",
            "CreatedDate": "2022-10-13T13:20:16.046+00:00",
            "Status": 0
        }
    ],
    "NewsSectionDto": {
        "CategoryNews": {
            "Id": 5,
            "CategoryNewsName": "Tin trong tỉnh",
            "ParentId": 1,
            "CreatedDate": "2022-10-13T13:20:15.957+00:00",
            "Status": 0
        },
        "Data": [
            {
                "Id": 2,
                "Title": "Yên Bái ban hành Quy định điều kiện, trình tự, thủ tục, hồ sơ xét, công nhận, công bố và thu hồi quyết định công nhận thôn (bản) đạt chuẩn NTM; thôn (bản) đạt chuẩn NTM kiểu mẫu trên địa bàn tỉnh giai đoạn 2021-2025",
                "PublishedDate": "2022-10-13T20:20:15.970Z",
                "IsHotNews": true,
                "IsVideoNews": false,
                "IsShowTitle": true,
                "IsShowAvatar": true,
                "IsShowComment": true,
                "AvatarTitle": "Cổng vào Làng văn hóa thôn Làng Già, xã Yên Thắng, huyện Lục Yên - thôn nông thôn mới kiểu mẫu",
                "Description": "CTTĐT - Tại Quyết định số 1739/QĐ-UBND ban hành ngày 04/10/2022, UBND tỉnh đã Quy định điều kiện, trình tự, thủ tục, hồ sơ xét, công nhận, công bố và thu hồi quyết định công nhận thôn (bản) đạt chuẩn NTM; thôn (bản) đạt chuẩn NTM kiểu mẫu trên địa bàn tỉnh giai đoạn 2021-2025.",
                "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/200090_lang-van-hoa.jpg",
                "CreatedDate": "2022-10-13T13:20:16.046+00:00",
                "Status": 0
            },
            {
                "Id": 3,
                "Title": "Tăng cường công tác chăm sóc sức khỏe người lao động và phòng chống bệnh nghề nghiệp",
                "PublishedDate": "2022-10-13T20:20:15.970Z",
                "IsHotNews": true,
                "IsVideoNews": false,
                "IsShowTitle": true,
                "IsShowAvatar": true,
                "IsShowComment": true,
                "AvatarTitle": "Công ty Điện lực Yên Bái khám sức khỏe định kỳ cho cán bộ, công nhân viên và người lao động.",
                "Description": "CTTĐT - UBND tỉnh vừa ban hành công văn số 3341/UBND-VX yêu cầu các sở, ban, ngành của tỉnh; UBND các huyện, thị xã, thành phố và các đơn vị liên quan về việc tăng cường công tác chăm sóc sức khỏe người lao động và phòng chống bệnh nghề nghiệp.",
                "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/185331_dam-bao-van-hanh.jpg",
                "CreatedDate": "2022-10-13T13:20:16.046+00:00",
                "Status": 0
            },
            {
                "Id": 5,
                "Title": "Hội LHPN huyện Văn Yên tổ chức Chung kết Hội thi tìm hiểu Nghị quyết Đại hội phụ nữ các cấp năm 2022",
                "PublishedDate": "2022-10-13T20:20:15.970Z",
                "IsHotNews": false,
                "IsVideoNews": false,
                "IsShowTitle": true,
                "IsShowAvatar": true,
                "IsShowComment": true,
                "AvatarTitle": "Ban Tổ chức đã trao giải nhất cho thí sinh Nguyễn Thị Bích Liên - Phó Chủ tịch Hội LHPN xã Viễn Sơn",
                "Description": "CTTĐT - Sáng ngày 4/10, Hội LHPN huyện Văn Yên tổ chức Chung kết Hội thi tìm hiểu Nghị quyết Đại hội đại biểu phụ nữ toàn quốc lần thứ 13, Nghị quyết Đại hội đại biểu phụ nữ tỉnh và Nghị quyết Đại hội đại biểu phụ nữ huyện Văn Yên lần thứ 16.",
                "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/trao%20giai%20nhat%204102022.jpg",
                "CreatedDate": "2022-10-13T13:20:16.046+00:00",
                "Status": 0
            },
            {
                "Id": 8,
                "Title": "Tạm hoãn xét nghĩa vụ quân sự với nam công dân là thí sinh",
                "PublishedDate": "2022-10-13T20:20:16.035Z",
                "IsHotNews": false,
                "IsVideoNews": false,
                "IsShowTitle": true,
                "IsShowAvatar": true,
                "IsShowComment": true,
                "AvatarTitle": "Ảnh minh họa",
                "Description": "Bộ Quốc phòng đã đồng ý với ý kiến đề xuất của Bộ Giáo dục và Đào tạo (GD&ĐT) về cấp giấy tạm hoãn nghĩa vụ quân sự.",
                "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Mai-Hien/2022/Qu%C3%BD%203/nghiavuquansu.png",
                "CreatedDate": "2022-10-13T13:20:16.046+00:00",
                "Status": 0
            },
            {
                "Id": 9,
                "Title": "UBND tỉnh chỉ đạo tăng cường phòng, chống bệnh Đậu mùa khỉ",
                "PublishedDate": "2022-10-13T20:20:16.035Z",
                "IsHotNews": false,
                "IsVideoNews": false,
                "IsShowTitle": true,
                "IsShowAvatar": true,
                "IsShowComment": true,
                "AvatarTitle": "Ảnh minh họa",
                "Description": "CTTĐT - UBND tỉnh vừa ban hành công văn số 3340/UBND-VX yêu cầu các sở, ban, ngành của tỉnh; Công an tỉnh; Bộ Chỉ huy quân sự tỉnh; Báo Yên Bái; Đài Phát thanh và Truyền hình tỉnh; UBND các huyện, thị xã, thành phố về việc tăng cường phòng, chống bệnh Đậu mùa khỉ.",
                "Avatar": "https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Thu-Nga/2022/dau%20mua%20khi%20282022.jpg",
                "CreatedDate": "2022-10-13T13:20:16.046+00:00",
                "Status": 0
            }
        ]
    },
    "DocumentHots": [
        {
            "Id": 1,
            "Code": "3378/UBND-XD",
            "Name": "Công văn về việc tăng cường quản lý tạm ứng vốn đầu tư công nguồn NSNN trên địa bàn tỉnh Yên Bái",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
        },
        {
            "Id": 2,
            "Code": "3379/UBND-XD",
            "Name": "Công văn về việc tăng cường quản lý tạm ứng vốn đầu tư công nguồn NSNN trên địa bàn tỉnh Yên Bái",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
        },
        {
            "Id": 3,
            "Code": "3380/UBND-XD",
            "Name": "Công văn về việc tăng cường quản lý tạm ứng vốn đầu tư công nguồn NSNN trên địa bàn tỉnh Yên Bái",
            "PublishedDate": "2022-10-13T20:20:15.970Z",
        },
    ],
    "DocumentSectionDto": {
        "Data": [
            {
                "Id": 1,
                "Code": "3378/UBND-XD",
                "Name": "Công văn về việc tăng cường quản lý tạm ứng vốn đầu tư công nguồn NSNN trên địa bàn tỉnh Yên Bái",
                "PublishedDate": "2022-10-13T20:20:15.970Z",
            },
            {
                "Id": 2,
                "Code": "3379/UBND-XD",
                "Name": "Công văn về việc tăng cường quản lý tạm ứng vốn đầu tư công nguồn NSNN trên địa bàn tỉnh Yên Bái",
                "PublishedDate": "2022-10-13T20:20:15.970Z",
            },
            {
                "Id": 3,
                "Code": "3380/UBND-XD",
                "Name": "Công văn về việc tăng cường quản lý tạm ứng vốn đầu tư công nguồn NSNN trên địa bàn tỉnh Yên Bái",
                "PublishedDate": "2022-10-13T20:20:15.970Z",
            },
        ]
    },
}

export const datafakeLayoutData =
    [
        {
            Id: '1',
            Name: 'Trang chủ',
            IsHome: true,
            Url: '/',
            Items: []
        },
        {
            Id: '2',
            Name: 'QLVB điều hành',
            IsHome: false,
            Items: [
                {
                    Id: '2.1',
                    Name: 'Tỉnh ủy',
                    IsHome: false,
                    Url: routes.publishedStaticPage.replace(":id", "1"),
                    Items: [
                        {
                            Id: '2.1.1',
                            Name: "Tỉnh ủy Yên bái",
                            Url: routes.publishedStaticPage.replace(":id", "1"),
                            Items: [
                                {
                                    Id: '2.1.1.1',
                                    Name: "Thường trực tỉnh ủy",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                },
                                {
                                    Id: '2.1.1.2',
                                    Name: "Ban thường vụ Tỉnh ủy",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                },
                                {
                                    Id: '2.1.1.3',
                                    Name: "Ban Chấp hành Đảng bộ tỉnh",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                }
                            ]
                        },
                        {
                            Id: '2.1.2',
                            Name: "CÁC BAN ĐẢNG",
                            Url: routes.publishedStaticPage.replace(":id", "1"),
                            Items: [
                                {
                                    Id: '2.1.2.1',
                                    Name: "Văn phòng Tỉnh ủy",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                },
                                {
                                    Id: '2.1.2.2',
                                    Name: "Ủy Ban Kiểm tra Tỉnh ủy",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                },
                                {
                                    Id: '2.1.2.3',
                                    Name: "Ban Nội chính Tỉnh uỷ",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                },
                                {
                                    Id: '2.1.2.4',
                                    Name: "Các Đảng ủy trực thuộc",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                },
                                {
                                    Id: '2.1.2.4',
                                    Name: "Ban Tổ chức Tỉnh ủy",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                },
                                {
                                    Id: '2.1.2.4',
                                    Name: "Ban Tuyên giáo Tỉnh ủy",
                                    Url: routes.publishedStaticPage.replace(":id", "1"),
                                }
                            ]
                        },
                    ]
                },
                {
                    Id: '2.2',
                    Name: 'UBND Huyện',
                    IsHome: false,
                    Url: routes.publishedStaticPage.replace(":id", "1")
                },
                {
                    Id: '2.3',
                    Name: 'Sở ban ngành',
                    IsHome: false,
                    Url: routes.publishedStaticPage.replace(":id", "1")
                }
            ]
        },
        {
            Id: '3',
            Name: 'Thư điện tử',
            IsHome: false,
            Url: '/',
            Items: []
        },
        {
            Id: '4',
            Name: 'Danh bạ điện thoại',
            IsHome: false,
            Url: '/',
            Items: []
        },
        {
            Id: '5',
            Name: 'Liên hệ',
            IsHome: false,
            Url: '/',
            Items: []
        },
    ]
    ;

export const datafakeIntroduce = {
    Title: "Khái quát về xã Đông Cuông",
    Content: `<p><em>Y&ecirc;n B&aacute;i l&agrave; một tỉnh miền n&uacute;i, nằm ở ph&iacute;a T&acirc;y Bắc của Tổ quốc, c&oacute; 30 d&acirc;n tộc anh em c&ugrave;ng chung sống v&agrave; c&oacute; vị tr&iacute; chiến lược hết sức quan trọng trong x&acirc;y dựng v&agrave; bảo vệ Tổ quốc.</em></p>

<p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; L&agrave; &quot;cửa ng&otilde; ph&ecirc;n dậu&quot; v&ugrave;ng T&acirc;y Bắc, nơi giao thoa của hai khu vực Đ&ocirc;ng Bắc - T&acirc;y Bắc, của những nền văn ho&aacute; đa sắc tộc, h&igrave;nh th&agrave;nh n&ecirc;n nền văn minh s&ocirc;ng Hồng rực rỡ. Thi&ecirc;n ph&uacute; v&agrave; sự s&aacute;ng tạo trong lao động của cộng đồng c&aacute;c d&acirc;n tộc Y&ecirc;n B&aacute;i đ&atilde; tạo n&ecirc;n một v&ugrave;ng đất nhiều tiềm năng. C&ugrave;ng d&ograve;ng chảy của lịch sử d&acirc;n tộc Việt Nam, nh&acirc;n d&acirc;n c&aacute;c d&acirc;n tộc Y&ecirc;n B&aacute;i đ&atilde; hun đ&uacute;c n&ecirc;n truyền thống y&ecirc;u nước, đo&agrave;n kết, anh dũng, ki&ecirc;n cường trong đấu tranh chống giặc ngoại x&acirc;m, cần c&ugrave;, s&aacute;ng tạo trong lao động sản xuất, trong c&aacute;c cuộc đấu tranh gi&agrave;nh độc lập d&acirc;n tộc.</em></p>

<p><em>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Sự hấp dẫn của v&ugrave;ng đất n&agrave;y l&agrave; h&igrave;nh s&ocirc;ng thế n&uacute;i, được kiến tạo dọc s&ocirc;ng Hồng tr&ecirc;n nền ph&ugrave; sa cổ sinh, với những c&aacute;nh đồng bằng phẳng đan xen c&ugrave;ng n&uacute;i non ngoạn mục vươn s&aacute;t bờ s&ocirc;ng tạo th&agrave;nh những l&aacute;t cắt ph&oacute;ng kho&aacute;ng, tr&ugrave;ng điệp, đ&oacute; l&agrave; tặng vật của thi&ecirc;n nhi&ecirc;n để con người g&acirc;y dựng n&ecirc;n những x&oacute;m l&agrave;ng tr&ugrave; mật v&agrave; thanh b&igrave;nh. Từ đ&acirc;y, những kh&aacute;t vọng về sự y&ecirc;n ấm thơ mộng được đặt cho c&aacute;c t&ecirc;n l&agrave;ng, trở th&agrave;nh dấu ấn kh&ocirc;ng thể phai nhạt như Ch&acirc;u Quế, Y&ecirc;n Hưng, Lan Đ&igrave;nh, Cổ Ph&uacute;c, Y&ecirc;n Lương, &Acirc;u L&acirc;u, B&igrave;nh Phương, Linh Th&ocirc;ng, Minh Qu&acirc;n, Nga Qu&aacute;n&hellip; Những t&ecirc;n l&agrave;ng nhắc tới l&agrave; biết ngay đất Y&ecirc;n B&aacute;i.</em></p>

<p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</em><em>Dải đất n&agrave;y trầm t&iacute;ch bao b&iacute; mật của qu&aacute; khứ, từ thủa xa xưa. Những kết quả khảo cổ học cho thấy đ&acirc;y l&agrave; v&ugrave;ng đất c&oacute; lịch kỳ từ thời đ&aacute; mới trải d&agrave;i tới đồ đồng, đồ sắt. Ti&ecirc;u biểu nhất tương ứng với thời kỳ đ&aacute; Sơn Vi t&igrave;m thấy ở Mậu A, được c&aacute;c nh&agrave; khảo cổ đ&aacute;nh gi&aacute; l&agrave; di chỉ c&oacute; những đặc trưng nổi trội nhất. Dọc lưu vực s&ocirc;ng l&agrave; qu&ecirc; hương của thạp đồng Đ&agrave;o Thịnh, thạp đồng Hợp Minh nổi tiếng quốc gia c&ugrave;ng v&ocirc; số đồ đồng ph&aacute;t lộ, được người xưa ch&ocirc;n giấu dọc dải đất hai b&ecirc;n bờ s&ocirc;ng. V&ugrave;ng đất n&agrave;y cũng l&agrave; v&ugrave;ng c&ograve;n chứa nhiều b&iacute; ẩn đầy k&yacute; ức của cư d&acirc;n cổ xưa, đang rất cần được c&aacute;c nh&agrave; khoa học kh&aacute;m ph&aacute;.</em></p>

<p><em>&nbsp; &nbsp; &nbsp; &nbsp; C&ugrave;ng với tr&iacute; tuệ v&agrave; b&agrave;n tay tạo dựng của con người, nhiều nơi ngo&agrave;i việc trồng l&uacute;a nước c&ograve;n ph&aacute;t triển c&aacute;c l&agrave;ng nghề: trồng d&acirc;u nu&ocirc;i tằm, đan l&aacute;t thủ c&ocirc;ng l&agrave;m miến, k&eacute;o mật, c&ugrave;ng với những rừng quế bạt ng&agrave;n, những nương ch&egrave; ng&uacute;t ng&aacute;t xanh tươi. C&aacute;c l&agrave;ng văn h&oacute;a được tạo dựng, ch&iacute;nh l&agrave; nơi giữ g&igrave;n cảnh quản m&ocirc;i trường thi&ecirc;n nhi&ecirc;n v&agrave; bảo tồn c&aacute;c gi&aacute; trị văn h&oacute;a d&acirc;n gian được bao thế hệ lưu truyền. Ở đ&acirc;y c&oacute; thể bắt gặp c&aacute;i lạ v&agrave; độc đ&aacute;o của kh&egrave;n &quot;ma nh&iacute;&quot;, s&aacute;o &quot;c&uacute;c kẹ&quot; d&acirc;n tộc Xa Ph&oacute;, cũng như sự huyền linh trong &quot;tết nhẩy&quot; của d&acirc;n tộc Dao v&agrave; c&aacute;c gi&aacute; trị phi vật thể kh&aacute;c đang tiềm ẩn trong nh&acirc;n d&acirc;n. Đ&oacute; l&agrave; kết quả của lao động sản xuất v&agrave; nhu cầu sinh hoạt tinh thần của người d&acirc;n c&aacute;c d&acirc;n tộc s&aacute;ng tạo n&ecirc;n.</em></p>

<p><em>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Đồng h&agrave;nh c&ugrave;ng với lịch sử, c&aacute;c gi&aacute; trị văn h&oacute;a tinh thần được x&aacute;c lập c&ugrave;ng với t&iacute;n ngưỡng bản địa, c&aacute;c đ&igrave;nh đền miếu mạo được nh&acirc;n d&acirc;n t&ocirc;n &aacute;i x&acirc;y dựng. Những đền ch&ugrave;a nổi tiếng trong v&ugrave;ng như đền Đ&ocirc;ng Cu&ocirc;ng, Tuần Qu&aacute;n, Nhược Sơn, ch&ugrave;a B&aacute;ch Lẫm, Ngọc Am được tu bổ, đ&aacute;p ứng nhu cầu t&acirc;m linh của người d&acirc;n v&agrave; cũng l&agrave; c&aacute;c di t&iacute;ch văn h&oacute;a gắn với c&aacute;c truyền t&iacute;ch được người d&acirc;n lưu giữ. C&aacute;c dấu t&iacute;ch đ&igrave;nh đền c&ograve;n gắn với c&aacute;c sự kiện lịch sử từng xảy ra tr&ecirc;n mảnh đất n&agrave;y đ&oacute; l&agrave;, đền Nhược Sơn gắn với t&ecirc;n tuổi H&agrave; Bổng, H&agrave; Chương thời kỳ chống Nguy&ecirc;n M&ocirc;ng; Đền Đ&ocirc;ng Cu&ocirc;ng (c&ograve;n gọi l&agrave; đền Thần Vệ Quốc) gắn với khởi nghĩa Gi&aacute;p Dần (1914) của đồng b&agrave;o T&agrave;y, Dao địa phương chống thực d&acirc;n Ph&aacute;p, đền Tuần Qu&aacute;n gắn với khởi nghĩa Y&ecirc;n B&aacute;i th&aacute;ng 2 năm 1930 của c&aacute;c ch&iacute; sĩ y&ecirc;u nước tụ họp ở đ&acirc;y trước khi khởi sự. Th&agrave;nh phố Y&ecirc;n B&aacute;i c&ograve;n nổi bật di t&iacute;ch lịch sử văn h&oacute;a Lễ đ&agrave;i nơi B&aacute;c Hồ n&oacute;i chuyện với c&aacute;c nh&acirc;n d&acirc;n c&aacute;c d&acirc;n tộc Y&ecirc;n B&aacute;i (ng&agrave;y 25/9/1958) giữa trung t&acirc;m th&agrave;nh phố, một địa chỉ quen thuộc với cả nước l&agrave; di t&iacute;ch lịch sử văn h&oacute;a: Lăng mộ Nguyễn Th&aacute;i Học v&agrave; c&aacute;c nh&agrave; y&ecirc;u nước hy sinh năm 1930 trong khởi nghĩa Y&ecirc;n B&aacute;i chống thực d&acirc;n Ph&aacute;p nổi tiếng đương thời, được tọa lạc trong c&ocirc;ng vi&ecirc;n Y&ecirc;n H&ograve;a kho&aacute;ng đạt.</em></p>

<p><em>&nbsp; &nbsp; &nbsp; &nbsp; Trung t&acirc;m Y&ecirc;n B&aacute;i c&ograve;n l&agrave; nơi cửa ng&otilde; nối giữa Đ&ocirc;ng Bắc với T&acirc;y Bắc của Tổ quốc, c&oacute; đường sắt v&agrave; đường bộ nối H&agrave; Nội v&agrave; c&aacute;c tỉnh đồng bằng trung du với V&acirc;n Nam - Trung Quốc. Nơi đ&acirc;y c&ograve;n c&oacute; chiến khu Vần - Dọc thời kh&aacute;ng chiến chống Ph&aacute;p, c&oacute; bến ph&agrave; &Acirc;u L&acirc;u đ&atilde; trở th&agrave;nh di t&iacute;ch lịch sử văn h&oacute;a của địa phương.</em></p>

<p><em>&nbsp; &nbsp; &nbsp; &nbsp; C&oacute; thể tự h&agrave;o rằng, dưới sự l&atilde;nh đạo của Đảng Cộng sản Việt Nam, Đảng bộ tỉnh Y&ecirc;n B&aacute;i đ&atilde; gi&aacute;c ngộ, gi&aacute;o dục, tập hợp, đo&agrave;n kết, l&atilde;nh đạo nh&acirc;n d&acirc;n, tạo n&ecirc;n sức mạnh đại đo&agrave;n kết c&aacute;c d&acirc;n tộc, sức mạnh của cả đảng bộ, ch&iacute;nh quyền, Mặt trận Tổ quốc v&agrave; c&aacute;c tổ chức th&agrave;nh vi&ecirc;n, c&ocirc;ng nh&acirc;n, n&ocirc;ng d&acirc;n, tr&iacute; thức, lực lượng vũ trang, c&aacute;c doanh nghiệp, hợp t&aacute;c x&atilde; v&agrave; c&aacute;c tầng lớp nh&acirc;n d&acirc;n trong tỉnh l&agrave;m n&ecirc;n kỳ t&iacute;ch anh h&ugrave;ng - một tỉnh Y&ecirc;n B&aacute;i ph&aacute;t triển to&agrave;n diện, vững bước đi l&ecirc;n c&ugrave;ng cả nước trong sự nghiệp đổi mới - c&ocirc;ng nghiệp ho&aacute;, hiện đại ho&aacute; đất nước.</em></p>

<p><em>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&quot;Lịch sử l&agrave; d&ograve;ng chảy, truyền thống l&agrave; h&agrave;nh trang&quot;, chặng đường c&aacute;ch mạng vẻ vang của Đảng bộ v&agrave; nh&acirc;n d&acirc;n c&aacute;c d&acirc;n tộc trong tỉnh những năm qua l&agrave; niềm tự h&agrave;o về những chiến c&ocirc;ng, những th&agrave;nh t&iacute;ch đ&atilde; đạt được, đồng thời cũng nhận thức s&acirc;u sắc nhiệm vụ, mục ti&ecirc;u trong c&ocirc;ng cuộc đổi mới, hội nhập quốc tế, phấn đấu thực hiện bằng được mục ti&ecirc;u x&acirc;y dựng Y&ecirc;n B&aacute;i trở&nbsp;th&agrave;nh tỉnh ph&aacute;t triển kh&aacute; trong v&ugrave;ng Trung du v&agrave; Miền n&uacute;i ph&iacute;a Bắc.​</em></p>
`
};

export const datafakeMenuPageData = [
    {
        Id: "1",
        Title: "Tỉnh ủy đông cuông",
        IsRootMenu: true,
        Items: [
            {
                Id: 1,
                Title: "Thường trực tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 2,
                Title: "Ban thường vụ Tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 3,
                Title: "Ban Chấp hành Đảng bộ tỉnh",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 4,
                Title: "Ban Tổ chức Tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 5,
                Title: "Ban Tuyên giáo Tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            }
        ]
    },
    {
        Id: "2",
        Title: "CÁC BAN ĐẢNG",
        IsRootMenu: true,
        Items: [
            {
                Id: 1,
                Title: "Thường trực tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 2,
                Title: "Ban thường vụ Tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 3,
                Title: "Ban Chấp hành Đảng bộ tỉnh",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 4,
                Title: "Ban Tổ chức Tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            },
            {
                Id: 5,
                Title: "Ban Tuyên giáo Tỉnh ủy",
                Url: "https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx"
            }
        ]
    }
]

export const datafakeEvaluateReport = {
    Id: 1,
    Total: 64,
    PercentLevel1: 35,
    PercentLevel2: 23,
    PercentLevel3: 10,
    PercentLevel4: 3,
    PercentLevel5: 26
}

export default datafakeHome;
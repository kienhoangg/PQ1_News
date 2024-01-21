const datafakeNews = {
    news: {
        objectExample: {
            Id: "1",
            Title: "Yên bái: Phong trào thi đua 'Chung tay vì người nghèo - không để bỏ lại phía sau' giai đoạn 2021 - 2025",
            CreatedDate: "2022-09-30T13:54:50.005Z",
            Info: "Đinh Văn A xuất bản",
            Status: false,
            Description: "Mô tả bài viết",
            IsHot: true,
            AvatarUrl: "",
            TitleAvatar: "Tiêu đề ảnh",
            Content: "<p>Nội dung</p>",
            CreatedBy: "Đinh Văn A",
            CategoryText: "Văn bản mới",
            SourceText: "Nguồn NXB Việt Nam",
            AuthorName: "Nguyễn Văn A",
            IsDisplayTitle: true,

        },
        examples: [
            {
                Id: "1",
                Title: "Yên bái: Phong trào thi đua 'Chung tay vì người nghèo - không để bỏ lại phía sau' giai đoạn 2021 - 2025",
                CreatedDate: "2022-09-30T13:54:50.005Z",
                Info: "Đinh Văn A xuất bản",
                Status: true,
                Description: "Mô tả bài viết",
                IsHot: true
            },
            {
                Id: "2",
                Title: "Yên bái: Phong trào thi đua 'Chung tay vì người nghèo - không để bỏ lại phía sau' giai đoạn 2021 - 2025 2",
                CreatedDate: "2022-09-30T13:54:50.005Z",
                Info: "Đinh Văn A xuất bản 3",
                Status: false,
                Description: "Mô tả bài viết 4",
                IsHot: false
            }
        ],
    },
    Comment: {
        objectExample: {
            Id: "1",
            Name: "Đinh Văn A",
            SendDate: "2022-09-30T13:54:50.005Z",
            Title: "Bệnh viện sản nhỉ tỉnh A",
            Status: true,
            Content: "Bác sĩ ơi cho Em hỏi là bệnh viện mở lúc mấy giờ ạ"
        },
        examples: [

        ]
    },
    Source: {
        objectExample: {
            Id: "1",
            Title: "Bộ lao động - thương binh xã hội",
            OrderNumber: 0,
            Description: "Nguồn nhà nước",
            CreatedDate: "2022-09-30T13:54:50.005Z",
            ModifiedDate: "2022-09-30T13:54:50.005Z",
            CreatedBy: "Đinh Văn A",
            ModifiedBy: "Đinh Văn B"
        },
        examples: []
    },
    Field: {
        objectExample: {
            Id: "1",
            Title: "An ninh - quốc phòng",
            Description: "Nhà nước",
            OrderNumber: 1,
            CoefficientNumber: 1,
            CoefficientMaxNumber: 10,
            CreatedDate: "2022-08-30T13:54:50.005Z",
            ModifiedDate: "2022-30-30T13:54:50.005Z",
            CreatedBy: "Đinh Văn A",
            ModifiedBy: "Đinh Văn B",
            FileUrl: "Image.pdf",
            FileId: "1"
        },
        examples: []
    },
    Category: {
        objectExample: {
            Id: "1",
            Title: "Bảo vệ văn hóa phi vật thể quốc gia",
            ParentId: "2",
            ParentTitle: "Nhà nước",
            OrderNumber: 1,
            CreatedDate: "2022-08-30T13:54:50.005Z",
            ModifiedDate: "2022-09-30T13:54:50.005Z",
            CreatedBy: "Đinh Văn A",
            ModifiedBy: "Đinh Văn B",
            FileId: "1",
            FileUrl: "Image.pdf",
        },
        examples: []
    },
    Collaborators: {
        objectExample: {
            Id: "1",
            Title: "Anh Tịnh - Khắc Điệp",
            UserName: "annhien",
            AuthorAlias: "An nhiên",
            DateOfBirth: "1997-09-09",
            Address: "Cầu giấy, hà nội",
            Organization: "Hội nhà báo Hà Nội",
            PhoneNumber: "0991452165",
            Email: "dinhvana@gmail.com",
            Gender: 1,
            CreatedDate: "2022-09-30T13:54:50.005Z",
            ModifiedDate: "2022-09-30T13:54:50.005Z",
            CreatedBy: "Đinh Văn A",
            ModifiedBy: "Đinh Văn B",
            FileId: "1",
            FileUrl: "Image.pdf",
        },
        examples: []
    },
}

export default datafakeNews;
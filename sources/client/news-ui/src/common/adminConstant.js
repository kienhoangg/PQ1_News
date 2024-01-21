import routes from 'config/configRoutes';
import Radio from '../assets/icons/radio.png';

const {
  FileTextFilled,
  ThunderboltFilled,
  CloudFilled,
  FileImageFilled,
  VideoCameraFilled,
  CopyFilled,
  AppstoreFilled,
  BookFilled,
  QuestionCircleFilled,
  PlayCircleFilled,
  CommentOutlined,
  UserOutlined,
  ClusterOutlined,
  SettingOutlined,
  MenuOutlined,
  HighlightOutlined,
  ProfileOutlined,
  AuditOutlined,
  UnorderedListOutlined,
  InboxOutlined,
  BuildOutlined,
  RadiusUpleftOutlined,
  ExperimentOutlined,
  AreaChartOutlined,
  UserSwitchOutlined,
} = require('@ant-design/icons');

const adminMenu = [
  // {
  //     key: 'dashboard',
  //     label: "Tổng quan",
  //     icon: <PieChartOutlined />
  // },
  {
    key: 'news',
    label: 'Tin tức - bài viết',
    icon: <FileTextFilled />,
    children: [
      {
        key: 'news-list',
        label: 'Tin tức',
        icon: <FileTextFilled />,
        to: routes.adminNewsList,
      },
      {
        key: 'news-hot',
        label: 'Tin hoạt động',
        icon: <ThunderboltFilled />,
        to: routes.adminNewsHot,
      },
      {
        key: 'news-comment',
        label: 'Quản trị bình luận',
        icon: <CommentOutlined />,
        to: routes.adminNewsComment,
      },
      {
        key: 'news-source',
        label: 'Nguồn tin',
        icon: <CloudFilled />,
        to: routes.adminNewsSource,
      },
      {
        key: 'news-field',
        label: 'Lĩnh vực',
        icon: <AppstoreFilled />,
        to: routes.adminNewsField,
      },
      {
        key: 'news-category',
        label: 'Danh mục tin tức',
        icon: <ClusterOutlined />,
        to: routes.adminNewsCategory,
      },
      {
        key: 'news-collaborators',
        label: 'Tác giả',
        icon: <UserOutlined />,
        to: routes.adminNewsCollaborators,
      },
      {
        key: 'news-statistics',
        label: 'Thống kê tin bài',
        icon: <AreaChartOutlined />,
        to: routes.adminNewsStatistics,
      },
    ],
  },
  {
    key: 'document',
    label: 'Văn bản điều hành',
    icon: <BookFilled />,
    children: [
      {
        key: 'document-list',
        label: 'Văn bản',
        icon: <BookFilled />,
        to: routes.adminDocumentList,
      },
      {
        key: 'document-type',
        label: 'Loại văn bản',
        icon: <CopyFilled />,
        to: routes.adminDocumentCategory,
      },
      {
        key: 'document-source',
        label: 'Cơ quan ban hành',
        icon: <CloudFilled />,
        to: routes.adminDocumentSource,
      },
      {
        key: 'document-field',
        label: 'Lĩnh vực',
        icon: <AppstoreFilled />,
        to: routes.adminDocumentField,
      },
      {
        key: 'document-singer',
        label: 'Người ký',
        icon: <AppstoreFilled />,
        to: routes.adminDocumentSinger,
      },
    ],
  },
  {
    key: 'question',
    label: 'Hỏi & đáp',
    icon: <QuestionCircleFilled />,
    children: [
      {
        key: 'question-category',
        label: 'Danh mục chủ đề',
        icon: <QuestionCircleFilled />,
        to: routes.adminQuestionCategory,
      },
      {
        key: 'question-list',
        label: 'Danh sách câu hỏi',
        icon: <QuestionCircleFilled />,
        to: routes.adminQuestionList,
      },
      {
        key: 'suggetion-box',
        label: 'Hòm thư góp ý',
        icon: <InboxOutlined />,
        to: routes.adminSuggetionBox,
      },
    ],
  },
  {
    key: 'media',
    label: 'Đa phương tiện',
    icon: <FileImageFilled />,
    children: [
      {
        key: 'media-image',
        label: 'Hình ảnh',
        icon: <FileImageFilled />,
        to: routes.adminMediaImageList,
      },
      {
        key: 'media-image-category',
        label: 'Danh mục hình ảnh',
        icon: <FileImageFilled />,
        to: routes.adminMediaImageCategory,
      },
      {
        key: 'media-video',
        label: 'Video',
        icon: <VideoCameraFilled />,
        to: routes.adminMediaVideoList,
      },
      {
        key: 'media-video-category',
        label: 'Danh mục Video',
        icon: <VideoCameraFilled />,
        to: routes.adminMediaVideoCategory,
      },
      {
        key: 'media-radio',
        label: 'Radio',
        icon: (
          <img
            style={{
              width: 15,
              height: 15,
            }}
            src={Radio}
          />
        ),
        to: routes.adminMediaRadioList,
      },
      {
        key: 'media-radio-category',
        label: 'Danh mục radio',
        icon: (
          <img
            style={{
              width: 15,
              height: 15,
            }}
            src={Radio}
          />
        ),
        to: routes.adminMediaRadioCategory,
      },
    ],
  },
  {
    key: 'advertisement',
    label: 'Liên kết & doanh nghiệp',
    icon: <PlayCircleFilled />,
    children: [
      // {
      //   key: 'advertisement-category',
      //   label: 'Danh mục quảng cáo',
      //   icon: <PlayCircleFilled />,
      //   to: routes.adminAdvertisementCategory,
      // },
      // {
      //   key: 'advertisement-list',
      //   label: 'Quảng Cáo',
      //   icon: <PlayCircleFilled />,
      //   to: routes.adminAdvertisementList,
      // },
      {
        key: 'company-category',
        label: 'Danh mục doanh nghiệp',
        icon: <PlayCircleFilled />,
        to: routes.adminCompanyCategory,
      },
      {
        key: 'company-list',
        label: 'Doanh nghiệp',
        icon: <PlayCircleFilled />,
        to: routes.adminCompanyList,
      },
      {
        key: 'connection-category',
        label: 'Danh mục liên kết',
        icon: <ThunderboltFilled />,
        to: routes.adminConnectionCategory,
      },
      {
        key: 'connection-list',
        label: 'Liên kết',
        icon: <ThunderboltFilled />,
        to: routes.adminConnectionList,
      },
    ],
  },
  {
    key: 'static',
    label: 'Thông tin tĩnh',
    icon: <HighlightOutlined />,
    children: [
      {
        key: 'static-category',
        label: 'Danh mục tĩnh',
        icon: <UnorderedListOutlined />,
        to: routes.staticCategory,
      },
      {
        key: 'static-content',
        label: 'Nội dung tĩnh',
        icon: <AuditOutlined />,
        to: routes.staticContent,
      },
    ],
  },
  {
    key: 'budget',
    label: 'Công khai ngân sách',
    icon: <BuildOutlined />,
    children: [
      {
        key: 'budget-category',
        label: 'Danh mục công khai',
        icon: <UnorderedListOutlined />,
        to: routes.budgetCategory,
      },
      {
        key: 'budget-content',
        label: 'Nội dung',
        icon: <AuditOutlined />,
        to: routes.budgetContent,
      },
    ],
  },
  {
    key: 'setup',
    label: 'Thiết lập cổng',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'setup-menu',
        label: 'Menu hệ thống',
        icon: <MenuOutlined />,
        to: routes.adminSetupMenu,
      },
      {
        key: 'setup-account',
        label: 'Quản lý tài khoản',
        icon: <UserSwitchOutlined />,
        to: routes.adminSetupAccount,
      },
    ],
  },
];

const adminConst = { adminMenu };

export default adminConst;

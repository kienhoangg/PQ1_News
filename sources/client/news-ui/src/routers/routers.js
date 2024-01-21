import config from 'config/config.js';
import AdminLayout from 'features/admin/layouts/AdminLayout/AdminLayout';
import DocumentCategoryPage from 'features/admin/pages/documents/DocumentCategoryPage/DocumentCategoryPage';
import DocumentFieldPage from 'features/admin/pages/documents/DocumentFieldPage/DocumentFieldPage';
import DocumentListPage from 'features/admin/pages/documents/DocumentListPage/DocumentListPage.';
import DocumentSignerPage from 'features/admin/pages/documents/DocumentSignerPage/DocumentSignerPage';
import DocumentSourcePage from 'features/admin/pages/documents/DocumentSourcePage/DocumentSourcePage';
import LoginPage from 'features/admin/pages/LoginPage/LoginPage';
import ImageCategoryPage from 'features/admin/pages/media/ImageCategoryPage/ImageCategoryPage';
import ImageListPage from 'features/admin/pages/media/ImageListPage/ImageListPage';
import VideoCategoryPage from 'features/admin/pages/media/VideoCategoryPage/VideoCategoryPage';
import VideoListPage from 'features/admin/pages/media/VideoListPage/VideoListPage';
import NewsCategoryPage from 'features/admin/pages/news/NewsCategoryPage/NewsCategoryPage';
import NewsCollaboratorsPage from 'features/admin/pages/news/NewsCollaboratorsPage/NewsCollaboratorsPage';
import NewsCommentPage from 'features/admin/pages/news/NewsCommentPage/NewsCommentPage';
import NewsFieldPage from 'features/admin/pages/news/NewsFieldPage/NewsFieldPage';
import NewsHotPage from 'features/admin/pages/news/NewsHotPage/NewsHotPage';
import NewsListPage from 'features/admin/pages/news/NewsListPage/NewsListPage';
import NewsSourcePage from 'features/admin/pages/news/NewsSourcePage/NewsSourcePage';
import QuestionCategoryPage from 'features/admin/pages/questions/QuestionCategoryPage/QuestionCategoryPage';
import QuestionListPage from 'features/admin/pages/questions/QuestionListPage/QuestionListPage';
import MenuPage from 'features/admin/pages/setup/MenuPage/MenuPage';
import Home from 'features/Home/Home';
import AlbumImageDetailPage from 'features/visitor/ImageListPage/AlbumImageDetailPage';
import PublishedDocumentPage from 'features/visitor/PublishedNewsPostPage/PublishedNewsPostPage';
import PublishedDocumentPrintPage from 'features/visitor/PublishedNewsPostPrintPage/PublishedNewsPostPrintPage';
import PublishedEvaluatePage from 'features/visitor/PublishedEvaluatePage/PublishedEvaluatePage';
import PublishedIntroducePage from 'features/visitor/PublishedIntroducePage/PublishedIntroducePage';
import PublishedMenuPage from 'features/visitor/PublishedMenuPage/PublishedMenuPage';
import PublishedNewsFieldPage from 'features/visitor/PublishedNewsFieldDetailPage/PublishedNewsFieldPage';
import PublishedNewsFieldListPage from 'features/visitor/PublishedNewsFieldListPage/PublishedNewsFieldListPage';
import PublishedNewsListDocumentPage from 'features/visitor/PublishedNewsListDocumentPage/PublishedNewsListDocumentPage';
import SearchPage from 'features/visitor/SearchPage/SearchPage';
import OperatingDocumentsPage from 'features/visitor/OperatingDocumentsPage/OperatingDocumentsPage';
import OperatingDocumentsDetailPage from 'features/visitor/OperatingDocumentsDetailPage/OperatingDocumentsDetailPage';
import QuestionAndAnswerPage from 'features/visitor/QuestionAndAnswerPage/QuestionAndAnswerPage';
import LibVideoListPage from 'features/visitor/VideoListPage/LibVideoListPage';
import StaticContentListPage from 'features/admin/pages/staticInfor/StaticContent/StaticContentListPage';
import StaticCategoryListPage from 'features/admin/pages/staticInfor/StaticCategory/StaticCategoryListPage';
import QuestionDetailPage from 'features/visitor/QuestionDetailPage/QuestionDetailPage';
import PublishedStaticPage from 'features/visitor/PublishedStaticPage/PublishedStaticPage';
import CompanyListPage from './../features/admin/pages/connection/CompanyListPage/CompanyListPage';
import CompanyCategoryPage from './../features/admin/pages/connection/CompanyCategoryPage/CompanyCategoryPage';
import ConnectionListPage from 'features/admin/pages/connection/ConnectionListPage/ConnectionListPage';
import ConnectionCategoryPage from '../features/admin/pages/connection/ConnectionCategoryPage/ConnectionCategoryPage';
import PublishedInternationalTreaties from './../features/visitor/PublishedInternationalTreaties/PublishedInternationalTreaties';
import PublishedLawDissemination from './../features/visitor/PublishedLawDissemination/PublishedLawDissemination';
import PublishedSuggestionBox from './../features/visitor/PublishedSuggestionBox/PublishedSuggestionBox';
import PublishedNewsCategoryDetailPage from 'features/visitor/PublishedNewsCategoryDetailPage/PublishedNewsCategoryDetailPage';
import RadioListPage from 'features/admin/pages/media/RadioListPage/RadioListPage';
import RadioCategoryPage from 'features/admin/pages/media/RadioCategoryPage/RadioCategoryPage';
import SuggetionBoxListPage from 'features/admin/pages/questions/SuggetionBox/SuggetionBoxListPage';
import BudgetContentListPage from 'features/admin/pages/publicBudget/BudgetContent/BudgetContentListPage';
import BudgetCategoryListPage from 'features/admin/pages/publicBudget/BudgetCategory/BudgetCategoryListPage';
import PublishedAudioPage from 'features/visitor/PublishedAudioPage/PublishedAudioPage';
import PublishedPublicInformation from 'features/visitor/PublishedPublicInformationPage/PublishedPublicInformation';
import NewsStatisticsPage from 'features/admin/pages/news/NewsStatisticsPage/NewsStatisticsPage';
import PublishedPublicInformationListPage from 'features/visitor/PublishedPublicInformationListPage/PublishedPublicInformationListPage';
import PublishedPublicInformationDetailPage from 'features/visitor/PublishedPublicInformationDetailPage/PublishedPublicInformationDetailPage';
import AccountPage from 'features/admin/pages/setup/AccountPage/AccountPage';

// Public routes
const publicRoutes = [
  { path: config.routes.root, component: Home },
  // { path: config.routes.blog, component: BlogMainPage },
  { path: config.routes.publishedDocument, component: PublishedDocumentPage },
  { path: config.routes.publishedNewsPost, component: PublishedDocumentPage },
  {
    path: config.routes.publishedNewsPostPrint,
    component: PublishedDocumentPrintPage,
    layout: null,
  },
  {
    path: config.routes.publishedNewsPostFieldList,
    component: PublishedNewsFieldListPage,
  },
  {
    path: config.routes.publishedNewsPostFieldDetail,
    component: PublishedNewsFieldPage,
  },
  {
    path: config.routes.publishedNewsPostCategoryDetail,
    component: PublishedNewsCategoryDetailPage,
  },
  {
    path: config.routes.publishedInternationalTreaties,
    component: PublishedInternationalTreaties,
  },
  {
    path: config.routes.publishedLawDissemination,
    component: PublishedLawDissemination,
  },
  {
    path: config.routes.publishedSuggestionBox,
    component: PublishedSuggestionBox,
  },

  { path: config.routes.publishedIntroduce, component: PublishedIntroducePage },

  { path: config.routes.publishedStaticPage, component: PublishedStaticPage },
  { path: config.routes.search, component: SearchPage },

  {
    path: config.routes.publishedEvaluatePage,
    component: PublishedEvaluatePage,
  },
  // { path: config.routes.notfound, component: NotFound, layout: null },

  // //Admin
  { path: config.routes.login, component: LoginPage, layout: null },
  { path: config.routes.admin, component: NewsListPage, layout: AdminLayout },
  {
    path: config.routes.adminNewsList,
    component: NewsListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminNewsHot,
    component: NewsHotPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminNewsComment,
    component: NewsCommentPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminNewsSource,
    component: NewsSourcePage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminNewsField,
    component: NewsFieldPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminNewsCategory,
    component: NewsCategoryPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminNewsCollaborators,
    component: NewsCollaboratorsPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminNewsStatistics,
    component: NewsStatisticsPage,
    layout: AdminLayout,
  },

  {
    path: config.routes.adminDocumentList,
    component: DocumentListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminDocumentCategory,
    component: DocumentCategoryPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminDocumentField,
    component: DocumentFieldPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminDocumentSinger,
    component: DocumentSignerPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminDocumentSource,
    component: DocumentSourcePage,
    layout: AdminLayout,
  },

  {
    path: config.routes.adminSuggetionBox,
    component: SuggetionBoxListPage,
    layout: AdminLayout,
  },

  {
    path: config.routes.adminQuestionList,
    component: QuestionListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminQuestionCategory,
    component: QuestionCategoryPage,
    layout: AdminLayout,
  },

  {
    path: config.routes.adminMediaImageList,
    component: ImageListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminMediaImageCategory,
    component: ImageCategoryPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminMediaVideoList,
    component: VideoListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminMediaVideoCategory,
    component: VideoCategoryPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminMediaRadioList,
    component: RadioListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminMediaRadioCategory,
    component: RadioCategoryPage,
    layout: AdminLayout,
  },

  {
    path: config.routes.adminAdvertisementCategory,
    component: ImageListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminAdvertisementList,
    component: ImageCategoryPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminCompanyCategory,
    component: CompanyCategoryPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminCompanyList,
    component: CompanyListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminConnectionCategory,
    component: ConnectionCategoryPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminConnectionList,
    component: ConnectionListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminSetupMenu,
    component: MenuPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.adminSetupAccount,
    component: AccountPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.publishedDocumentList,
    component: OperatingDocumentsPage,
  },
  {
    path: config.routes.publishedDocumentDetail,
    component: OperatingDocumentsDetailPage,
  },
  {
    path: config.routes.publishedQuestions,
    component: QuestionAndAnswerPage,
  },
  {
    path: config.routes.publishedPhotos,
    component: AlbumImageDetailPage,
  },

  {
    path: config.routes.staticContent,
    component: StaticContentListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.staticCategory,
    component: StaticCategoryListPage,
    layout: AdminLayout,
  },

  {
    path: config.routes.budgetContent,
    component: BudgetContentListPage,
    layout: AdminLayout,
  },
  {
    path: config.routes.budgetCategory,
    component: BudgetCategoryListPage,
    layout: AdminLayout,
  },

  {
    path: config.routes.publishedQuestionsDetail,
    component: QuestionDetailPage,
  },

  {
    path: config.routes.publishedVideos,
    component: LibVideoListPage,
  },

  {
    path: config.routes.publishedRadio,
    component: PublishedAudioPage,
  },
  {
    path: config.routes.publishedPublicInformation,
    component: PublishedPublicInformation,
  },
  {
    path: config.routes.publishedPublicInformationListPage,
    component: PublishedPublicInformationListPage,
  },
  {
    path: config.routes.publishedPublicInformationDetailPage,
    component: PublishedPublicInformationDetailPage,
  },

  // { path: config.routes.admin, component: NewsListPage, layout: AdminLayout },
  // { path: config.routes.adminNewsList, component: NewsListPage, layout: AdminLayout },
  // { path: config.routes.adminNewsHot, component: NewsHotPage, layout: AdminLayout },

  // //TEST
  // { path: config.routes.test, component: PostEditor, layout: null },
];
// { path: config.routes.home, component: Home },

const privateRoutes = [];

export { publicRoutes, privateRoutes };

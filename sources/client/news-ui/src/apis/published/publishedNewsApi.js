// import axiosClient from './axiosClient';

import axiosClient from 'apis/axiosClient';
import datafakePublisedNews from 'apis/datafake/datafakePublisedNews';
import datafakePublishedCategoryList from 'apis/datafake/datafakePublishedCategoryList';
import datafakePublishedDocument from 'apis/datafake/datafakePublishedDocument';
import moment from 'moment';

class PublishedNewsApi {
  getData = (params) => {
    const { id } = params;
    let url = `/home/published/${id}`;
    return axiosClient.get(url, {});
  };

  getComments() {
    var response = datafakePublishedCategoryList;
    return response;
  }

  getFieldsDataListPage() {
    let url = `/home/published/fields`;
    return axiosClient.get(url, {});

    // var response = datafakePublishedCategoryList;
    // return response;
  }

  getFieldsDataPage(params) {
    const { id, currentPage, todayDate } = params;
    const url = `/home/published/fieldNews/${id}`;
    const body = {
      CurrentPage: currentPage,
      PageSize: 6,
    };

    if (todayDate) {
      const formatDateApi = 'YYYY-MM-DD';
      body.TodayDate = moment(todayDate, 'DD/MM/YYYY').format(formatDateApi);
    }

    return axiosClient.post(url, body);
  }

  getDataComments(body) {
    const url = `/home/comments/filter`;
    return axiosClient.post(url, body);
  }


  getCategoryDetailDataPage(params) {
    const { id, currentPage } = params;
    const url = `/home/published/categorynews/${id}`;
    const body = {
      CurrentPage: currentPage,
      PageSize: 6,
    };

    return axiosClient.post(url, body);
  }

  getInternationalTreatiesPage(body) {
    const url = `/home/published/categorynews`;
    return axiosClient.get(url);
  }

  getInternationalLawDissemination(body) {
    const url = `/home/published/categorynews`;
    return axiosClient.post(url, body);
  }

  postVisitorComment(params) {
    const url = `/home/comment`;
    const body = params;

    return axiosClient.post(url, body);
  }

  //#region API thông tin công khai
  getDataPublicInformationCategoriesPage() {
    let url = `/home/published/publicinformationcategories`;
    return axiosClient.get(url, {});
  }

  getDataPublicInformationCategoriesListPage(body) {
    let url = `/home/publicinformations/filter`;
    return axiosClient.post(url, body);
  }

  getDataPublicInformationCategoriesDetailPage(id) {
    let url = `/home/publicinformations/${id}`;
    return axiosClient.get(url, {});
  }
  //#endregion
}
const publishedNewsApi = new PublishedNewsApi();
export default publishedNewsApi;

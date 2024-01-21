import commonFunc from 'common/commonFunc';
import axiosClient from './axiosClient';
import datafakeNews from './datafake/datafakeNews';

class NewsApi {
  getNewsAll = (body) => {
    const url = '/newsPost/filter';
    return axiosClient.post(url, body);
  };
  insertNew = (body) => {
    const url = '/newsPost';
    return axiosClient.post(url, body, {
      headers: {
        Prefer: 'code=200, example=200GetReturn2Record',
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  updatNews = (body) => {
    const url = '/newsPost';
    return axiosClient.put(url, body);
  };
  updatNewsByID = (id, body) => {
    const url = `/newsPost/${id}`;
    return axiosClient.put(url, body);
  };
  deleteHotNew = (id) => {
    const url = `/newsPost/${id}`;
    return axiosClient.delete(url);
  };

  getNewsById = (id) => {
    const url = `/newsPost/${id}`;
    return axiosClient.get(url);
  };
  //#region Nguồn tin
  getNewsSourceAll = (body) => {
    const url = '/sourceNews/filter';
    return axiosClient.post(url, body);
  };
  getSourceNewByID = (id) => {
    const url = `/sourceNews/${id}`;
    return axiosClient.get(url);
  };
  insertSourceNew = (body) => {
    const url = '/sourceNews';
    return axiosClient.post(url, body);
  };
  updateStatusSourceNew = (body) => {
    const url = '/sourceNews';
    return axiosClient.put(url, body);
  };
  updateSourceNew = (id, body) => {
    const url = `/sourceNews/${id}`;
    return axiosClient.put(url, body);
  };
  deleteSourceNew = (id) => {
    const url = `/sourceNews/${id}`;
    return axiosClient.delete(url);
  };
  //#endregion

  //#endregion Lĩnh vực
  getNewsFieldAll = (body) => {
    const url = '/fieldNews/filter';
    return axiosClient.post(url, body);
  };
  getNewsFieldByID = (id) => {
    const url = `/fieldNews/${id}`;
    return axiosClient.get(url);
  };
  insertFieldNews = (body) => {
    const url = '/fieldNews';
    return axiosClient.post(url, body);
  };
  updateFieldNews = (id, body) => {
    const url = `/fieldNews/${id}`;
    return axiosClient.put(url, body);
  };
  updateStatusFieldNews = (body) => {
    const url = '/fieldNews';
    return axiosClient.put(url, body);
  };
  deleteFieldNews = (id) => {
    const url = `/fieldNews/${id}`;
    return axiosClient.delete(url);
  };
  //#endregion

  //#region Danh mục
  getNewsCategoryAll = (body) => {
    const url = '/categoryNews/filter';
    return axiosClient.post(url, body);
  };
  getNewsCategoryByID = (id) => {
    const url = `/categoryNews/${id}`;
    return axiosClient.get(url);
  };
  insertCategoryNews = (body) => {
    const url = '/categoryNews';
    return axiosClient.post(url, body);
  };
  updateCategoryNews = (id, body) => {
    const url = `/categoryNews/${id}`;
    return axiosClient.put(url, body);
  };
  updateStatusCategoryNews = (body) => {
    const url = '/categoryNews';
    return axiosClient.put(url, body);
  };

  deleteCategoryNews = (id) => {
    const url = `/categoryNews/${id}`;
    return axiosClient.delete(url);
  };

  getNewsCategoryById = (id) => {
    const url = `/categoryNews/${id}`;
    return axiosClient.get(url);
  };
  //#endregion

  getNewsCollaboratorsAll = (body) => {
    return axiosClient.post('/collaborators/filter', body);
  };
}
const newsApi = new NewsApi();
export default newsApi;

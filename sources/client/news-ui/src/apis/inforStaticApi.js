import axiosClient from './axiosClient';

class InforStaticAPI {
  getContentAll = (body) => {
    const url = '/StaticInfos/filter';
    return axiosClient.post(url, body);
  };
  getNewsById = (id) => {
    const url = `/StaticInfos/${id}`;
    return axiosClient.get(url);
  };
  insertContent = (body) => {
    const url = '/StaticInfos';
    return axiosClient.post(url, body);
  };
  updateStatusContent = (body) => {
    const url = '/StaticInfos';
    return axiosClient.put(url, body);
  };
  updateContent = (id, body) => {
    const url = `/StaticInfos/${id}`;
    return axiosClient.put(url, body);
  };
  deleteContent = (id) => {
    const url = `/StaticInfos/${id}`;
    return axiosClient.delete(url);
  };

  getStaticCategoryAll = (body) => {
    const url = '/StaticCategories/filter';
    return axiosClient.post(url, body);
  };
  getCategoryByID = (id) => {
    const url = `/StaticCategories/${id}`;
    return axiosClient.get(url);
  };
  insertCategory = (body) => {
    const url = '/StaticCategories';
    return axiosClient.post(url, body);
  };
  updateStatusCategor = (body) => {
    const url = '/StaticCategories';
    return axiosClient.put(url, body);
  };
  updateCategoryByID = (id, body) => {
    const url = `/StaticCategories/${id}`;
    return axiosClient.put(url, body);
  };
  deleteCategory = (id) => {
    const url = `/StaticCategories/${id}`;
    return axiosClient.delete(url);
  };
}
const inforStaticAPI = new InforStaticAPI();
export default inforStaticAPI;

import axiosClient from './axiosClient';

class BudgetPublicAPI {
  getContentAll = (body) => {
    const url = '/PublicInformations/filter';
    return axiosClient.post(url, body);
  };
  getContentById = (id) => {
    const url = `/PublicInformations/${id}`;
    return axiosClient.get(url);
  };
  insertContent = (body) => {
    const url = '/PublicInformations';
    return axiosClient.post(url, body);
  };
  updateStatusContent = (body) => {
    const url = '/PublicInformations';
    return axiosClient.put(url, body);
  };
  updateContent = (id, body) => {
    const url = `/PublicInformations/${id}`;
    return axiosClient.put(url, body);
  };
  deleteContent = (id) => {
    const url = `/PublicInformations/${id}`;
    return axiosClient.delete(url);
  };

  getBudgetCategoryAll = (body) => {
    const url = '/PublicInformationCategories/filter';
    return axiosClient.post(url, body);
  };
  getCategoryByID = (id) => {
    const url = `/PublicInformationCategories/${id}`;
    return axiosClient.get(url);
  };
  insertCategory = (body) => {
    const url = '/PublicInformationCategories';
    return axiosClient.post(url, body);
  };
  updateStatusCategory = (body) => {
    const url = '/PublicInformationCategories';
    return axiosClient.put(url, body);
  };
  updateCategoryByID = (id, body) => {
    const url = `/PublicInformationCategories/${id}`;
    return axiosClient.put(url, body);
  };
  deleteCategory = (id) => {
    const url = `/PublicInformationCategories/${id}`;
    return axiosClient.delete(url);
  };
}
const budgetPublicAPI = new BudgetPublicAPI();
export default budgetPublicAPI;

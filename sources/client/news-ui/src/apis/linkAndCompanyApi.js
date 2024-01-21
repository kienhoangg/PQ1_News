import commonFunc from 'common/commonFunc';
import axiosClient from './axiosClient';

class LinkAndCompanyApi {
  getCompanyAll = (body) => {
    const url = '/CompanyInfos/filter';
    return axiosClient.post(url, body);
  };
  getCompanyById = (id) => {
    const url = `/CompanyInfos/${id}`;
    return axiosClient.get(url);
  };
  insertCompany = (body) => {
    const url = '/CompanyInfos';
    return axiosClient.post(url, body);
  };
  updateStatusCompany = (body) => {
    const url = '/CompanyInfos';
    return axiosClient.put(url, body);
  };
  updateCompany = (id, body) => {
    const url = `/CompanyInfos/${id}`;
    return axiosClient.put(url, body);
  };
  deleteCompany = (id) => {
    const url = `/CompanyInfos/${id}`;
    return axiosClient.delete(url);
  };

  getCompanyInfoCategoryAll = (body) => {
    const url = '/CompanyInfoCategories/filter';
    return axiosClient.post(url, body);
  };
  getCompanyInfoCategoryById = (id) => {
    const url = `/CompanyInfoCategories/${id}`;
    return axiosClient.get(url);
  };
  insertCompanyInfoCategory = (body) => {
    const url = '/CompanyInfoCategories';
    return axiosClient.post(url, body);
  };
  updateStatusCompanyInfoCategory = (body) => {
    const url = '/CompanyInfoCategories';
    return axiosClient.put(url, body);
  };
  updateCompanyInfoCategory = (id, body) => {
    const url = `/CompanyInfoCategories/${id}`;
    return axiosClient.put(url, body);
  };
  deleteCompanyInfoCategory = (id) => {
    const url = `/CompanyInfoCategories/${id}`;
    return axiosClient.delete(url);
  };

  getLinkInfoAll = (body) => {
    const url = '/LinkInfos/filter';
    return axiosClient.post(url, body);
  };
  getLinkInfoById = (id) => {
    const url = `/LinkInfos/${id}`;
    return axiosClient.get(url);
  };
  insertLinkInfo = (body) => {
    const url = '/LinkInfos';
    return axiosClient.post(url, body);
  };
  updateStatusLinkInfo = (body) => {
    const url = '/LinkInfos';
    return axiosClient.put(url, body);
  };
  updateLinkInfo = (id, body) => {
    const url = `/LinkInfos/${id}`;
    return axiosClient.put(url, body);
  };
  deleteLinkInfo = (id) => {
    const url = `/LinkInfos/${id}`;
    return axiosClient.delete(url);
  };

  getLinkInfoCategoryAll = (body) => {
    const url = '/LinkInfoCategories/filter';
    return axiosClient.post(url, body);
  };
  getLinkInfoCategoryById = (id) => {
    const url = `/LinkInfoCategories/${id}`;
    return axiosClient.get(url);
  };
  insertLinkInfoCategory = (body) => {
    const url = '/LinkInfoCategories';
    return axiosClient.post(url, body);
  };
  updateStatusLinkInfoCategory = (body) => {
    const url = '/LinkInfoCategories';
    return axiosClient.put(url, body);
  };
  updateLinkInfoCategory = (id, body) => {
    const url = `/LinkInfoCategories/${id}`;
    return axiosClient.put(url, body);
  };
  deleteLinkInfoCategory = (id) => {
    const url = `/LinkInfoCategories/${id}`;
    return axiosClient.delete(url);
  };
}
const linkAndCompanyApi = new LinkAndCompanyApi();
export default linkAndCompanyApi;

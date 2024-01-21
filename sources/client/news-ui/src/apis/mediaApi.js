import commonFunc from "common/commonFunc";
import datafakeMedia from "./datafake/datafakeMedia";
import axiosClient from "./axiosClient";

class MediaApi {
  insertVideo = (body) => {
    const url = "/Videos";
    return axiosClient.post(url, body);
  };
  insertRadio = (body) => {
    const url = "/Radios";
    return axiosClient.post(url, body);
  };
  deleteVideo = (id) => {
    const url = `/Videos/${id}`;
    return axiosClient.delete(url);
  };
  deleteRadio = (id) => {
    const url = `/Radios/${id}`;
    return axiosClient.delete(url);
  };
  updateStatusVideo = (body) => {
    const url = "/Videos";
    return axiosClient.put(url, body);
  };
  updateStatusRadio = (body) => {
    const url = "/Radios";
    return axiosClient.put(url, body);
  };
  updateVideo = (id, body) => {
    const url = `/Videos/${id}`;
    return axiosClient.put(url, body);
  };
  updateRadio = (id, body) => {
    const url = `/Radios/${id}`;
    return axiosClient.put(url, body);
  };
  getDetailVideo = (id) => {
    const url = `/Videos/${id}`;
    return axiosClient.get(url);
  };
  getDetailRadio = (id) => {
    const url = `/Radios/${id}`;
    return axiosClient.get(url);
  };

  getImageAll = (body) => {
    const url = "/Photos/filter";
    return axiosClient.post(url, body);
  };
  insertImage = (body) => {
    const url = "/Photos";
    return axiosClient.post(url, body);
  };
  updateStatusImage = (body) => {
    const url = "/Photos";
    return axiosClient.put(url, body);
  };
  deleteImage = (id) => {
    const url = `/Photos/${id}`;
    return axiosClient.delete(url);
  };

  updateImage = (id, body) => {
    const url = `/Photos/${id}`;
    return axiosClient.put(url, body);
  };

  getDetailImage = (id) => {
    const url = `/Photos/${id}`;
    return axiosClient.get(url);
  };

  getImageCategoryAll = (body) => {
    const url = "/PhotoCategories/filter";
    return axiosClient.post(url, body);
  };
  insertImageCategory = (body) => {
    const url = "/PhotoCategories";
    return axiosClient.post(url, body);
  };
  updateImageCategory = (id, body) => {
    const url = "/PhotoCategories/" + id;
    return axiosClient.put(url, body);
  };
  updateStatusImageCategory = (body) => {
    const url = "/PhotoCategories";
    return axiosClient.put(url, body);
  };
  deleteImageCategory = (id) => {
    const url = `/PhotoCategories/${id}`;
    return axiosClient.delete(url);
  };

  getVideoAll = (params = {}) => {
    const url = "/videos/filter";
    return axiosClient.post(url, params);
  };

  getRadioAll = (params = {}) => {
    const url = "/radios/filter";
    return axiosClient.post(url, params);
  };

  //Video category
  getVideoCategoryFilter = (body) => {
    const url = "/videocategories/filter";
    return axiosClient.post(url, body);
  };

  //Video category
  getRadioCategoryFilter = (body) => {
    const url = "/radiocategories/filter";
    return axiosClient.post(url, body);
  };

  getVideoCategoryByID = (id) => {
    const url = `/videocategories/${id}`;
    return axiosClient.get(url);
  };

  getRadioCategoryByID = (id) => {
    const url = `/radiocategories/${id}`;
    return axiosClient.get(url);
  };

  insertVideoCategory = (body) => {
    const url = "/videocategories";
    return axiosClient.post(url, body);
  };

  insertRadioCategory = (body) => {
    const url = "/radiocategories";
    return axiosClient.post(url, body);
  };

  updateVideoCategory = (id, body) => {
    const url = "/videocategories/" + id;
    return axiosClient.put(url, body);
  };

  updateRadioCategory = (id, body) => {
    const url = "/radiocategories/" + id;
    return axiosClient.put(url, body);
  };

  updateStatusVideoCategory = (body) => {
    const url = "/videocategories";
    return axiosClient.put(url, body);
  };

  updateStatusRadioCategory = (body) => {
    const url = "/radiocategories";
    return axiosClient.put(url, body);
  };

  deleteStatusVideoCategory = (id) => {
    const url = `/videocategories/${id}`;
    return axiosClient.delete(url);
  };

  deleteStatusRadioCategory = (id) => {
    const url = `/radiocategories/${id}`;
    return axiosClient.delete(url);
  };
}
const mediaApi = new MediaApi();
export default mediaApi;

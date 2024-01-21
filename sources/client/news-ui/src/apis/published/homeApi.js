import axiosClient from 'apis/axiosClient';
import datafakeHome, {
  datafakeEvaluateList,
  datafakeIntroduce,
  datafakeLayoutData,
  datafakeMenuPageData,
} from 'apis/datafake/datafakeHome';
import commonFunc from 'common/commonFunc';
import commonLocalStorage from 'common/commonLocalStorage';
import { constantLocalStorageKey } from 'common/constant';

class HomeApi {
  getData = (params) => {
    const url = '/home';
    return axiosClient.get(url, {});

    // var response = {
    //     Data: datafakeHome
    // };
    // return response;
  };

  getUserInfo = (params) => {
    const url = '/home/getUserInfo';
    return axiosClient.get(url, {});
  };

  getLayoutData = (params) => {
    const url = '/home/menu';
    return axiosClient.get(url, {});

    // var response = {
    //     Menu: datafakeLayoutData
    // };
    // return response;
  };

  getIntroduceData = (params) => {
    // const url = '/home';
    // return axiosClient.get(url, {});

    var response = datafakeIntroduce;
    return response;
  };

  getMenuPageData = (params) => {
    // const url = '/home';
    // return axiosClient.get(url, {});

    var response = datafakeMenuPageData;
    return response;
  };

  getStaticPageData = (id) => {
    const url = '/home/staticinfos/' + id;
    return axiosClient.get(url);

    // var response = datafakeMenuPageData;  //​/api​/staticinfos​/{id}
    // return response;
  };

  getRateListData = (params) => {
    const url = '/ratings/filter';
    return axiosClient.post(url, {});
  };

  getRateReport = (Id) => {
    const url = `/ratings/${Id}`;
    return axiosClient.get(url);
  };

  submitRating = (params) => {
    const url = `/ratings/${params.Id}`;
    const body = params;
    return axiosClient.put(url, body);
  };

  /**
   * Convert dữ liệu lấy từ API sang dữ liệu hiển thị UI
   * @param {object} dataApi Dữ liệu lấy từ API
   */
  convertDataApiToDataUI(dataApi) {}

  /**
   * Api tracking số lượng visitor online
   */
  trackingVisitorOnline() {
    let clientId = commonLocalStorage.getValue(constantLocalStorageKey.ClientID);
    if (clientId == null || clientId == undefined) {
      clientId = commonFunc.newGuid();
      commonLocalStorage.setValue(constantLocalStorageKey.ClientID, clientId);
    }
    const url = `/home/visitor/tracking?ClientId=${clientId}`;

    return axiosClient.post(url);
  }
}
const homeApi = new HomeApi();
export default homeApi;

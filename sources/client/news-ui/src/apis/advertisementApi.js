import commonFunc from "common/commonFunc";
import datafakeAdvertisement from "./datafake/datafakeAdvertisement";
// import axiosClient from "./axiosClient";

class AdvertisementApi {
    getAdvertisementAll = (params) => {
        // const url = '/news';
        // return axiosClient.get(url, { params });

        var response = commonFunc.generateFakeData(20, 50, datafakeAdvertisement.item.objectExample);
        return response;
    };

    getAdvertisementCategoryAll = (params) => {
        // const url = '/news';
        // return axiosClient.get(url, { params });

        var response = commonFunc.generateFakeData(20, 50, datafakeAdvertisement.category.objectExample);
        return response;
    };
}
const advertisementApi = new AdvertisementApi();
export default advertisementApi;
import commonFunc from "common/commonFunc";
import datafakConnection from "./datafake/datafakConnection";
// import axiosClient from "./axiosClient";

class ConnectionApi {
    getConnectionAll = (params) => {
        // const url = '/news';
        // return axiosClient.get(url, { params });

        var response = commonFunc.generateFakeData(20, 50, datafakConnection.item.objectExample);
        return response;
    };

    getConnectionCategoryAll = (params) => {
        // const url = '/news';
        // return axiosClient.get(url, { params });

        var response = commonFunc.generateFakeData(20, 50, datafakConnection.category.objectExample);
        return response;
    };
}
const connectionApi = new ConnectionApi();
export default connectionApi;
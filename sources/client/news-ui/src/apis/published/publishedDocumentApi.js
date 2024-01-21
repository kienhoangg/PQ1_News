// import axiosClient from './axiosClient';

import axiosClient from "apis/axiosClient";
import datafakePublisedNews from "apis/datafake/datafakePublisedNews";
import datafakePublishedCategoryList from "apis/datafake/datafakePublishedCategoryList";
import datafakePublishedDocument from "apis/datafake/datafakePublishedDocument";
import commonFunc from "common/commonFunc";

class PublishedDocumentApi {
    getData = (params) => {
        // const url = '/home';
        // const { id } = params;
        // let url = `/newsPost/published/${id}`;
        // return axiosClient.get(url, {});
        var response = commonFunc.generateFakeData(
            10,
            50,
            datafakePublishedDocument.objectExample
        );
        return response;
    };

    postComment = (params) => {
        var response = commonFunc.generateFakeData(
            10,
            50,
            datafakePublishedDocument.objectExample
        );
        return response;
    }
}
const publishedDocumentApi = new PublishedDocumentApi();
export default publishedDocumentApi;

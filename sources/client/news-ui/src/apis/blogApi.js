import axiosClient from "./axiosClient";

class BlogApi {
    getAll = (params) => {
        const url = '/products';
        return axiosClient.get(url, { params });
    };
}
const blogApi = new BlogApi();
export default blogApi;
import axiosClient from './axiosClient';

class UserAPI {
  login = (body) => {
    const url = '/users';
    return axiosClient.post(url, body);
  };

  changeAccount = (body) => {
    const url = '/users';
    return axiosClient.put(url, body);
  };
}
const userApi = new UserAPI();
export default userApi;

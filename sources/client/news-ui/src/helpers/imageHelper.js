import { envDomainBackend, envDomainClient } from "common/enviroments";

const imageHelper = {
  /**
   * Lấy đường dẫn hình ảnh hiển thị trong Client
   * @param {string} url Đường dẫn Url lấy từ API
   */
  getLinkImageUrl(urlApi) {
    if (urlApi) {
      if (urlApi.startsWith("http://") || urlApi.startsWith("https://")) {
        return urlApi;
      }

      if (urlApi.startsWith("/UploadFiles")) {
        let result = `${envDomainBackend}${urlApi}`;
        return result;
      }

      if (urlApi.startsWith("/")) {
        return urlApi;
      }

      let result = `${envDomainClient}${urlApi}`;
      return result;
    }

    return undefined;
  },

  getNameFile(filePath = "") {
    const file = filePath?.substring(
      filePath?.lastIndexOf("/") + 1,
      filePath?.length
    );
    const fileName =
      file.substring(
        0,
        file.lastIndexOf("_") === -1 ? file?.length : file.lastIndexOf("_")
      ) + file.substring(file.lastIndexOf("."));

    return fileName;
  },
};

export default imageHelper;

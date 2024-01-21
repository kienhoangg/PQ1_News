import { CheckCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { notification } from "antd";
import routes from "config/configRoutes";
import datetimeHelper from "helpers/datetimeHelper";


export const commonRenderTable = {
    showTableTotalPagination: (total, pageSize) => {
        return `Tổng có ${total} kết quả`;
    },

}

/**
 * Render chung
 */
export const commonRender = {
    /**
    * Lấy link đường dần chi tiết tin tức theo id
    * @param {string} id ID của tin tức
    * @returns Đường dẫn chi tiết tin tức
    */
    renderLinkNewsDetail: (id) => {
        var link = routes.publishedNewsPost.replace(":id", id);
        return link;
    },

    /**
    * Lấy link đường dần chi tiết tin tức theo id trang in
    * @param {string} id ID của tin tức
    * @returns Đường dẫn chi tiết tin tức trang in
    */
    renderLinkNewsDetailPrint: (id) => {
        var link = routes.publishedNewsPostPrint.replace(":id", id);
        return link;
    },

    /**
    * Lấy link đường dần danh sách tin tức theo loại tin tức
    * @param {string} id ID của loại tin tức
    * @returns Đường dẫn chi tiết tin tức
    */
    renderLinkNewsCategory: (id) => {
        var link = routes.publishedNewsPostFieldDetail.replace(":id", id);
        return link;
    },

    /**
    * Lấy link đường dần chi tiết tin tức theo loại tin tức
    * @param {string} id ID của loại tin tức
    * @returns Đường dẫn chi tiết tin tức
    */
    renderLinkNewsCategoryDetail: (id) => {
        var link = routes.publishedNewsPostCategoryDetail.replace(":id", id);
        return link;
    },

    /**
    * Lấy link đường dần danh sách tin tức theo loại tin tức
    * @param {string} id ID của loại tin tức
    * @returns Đường dẫn chi tiết tin tức
    */
    renderLinkNewsField: (id, date = undefined) => {
        var link = routes.publishedNewsPostFieldDetail.replace(":id", id);
        if (date) {
            link = link + `?date=${datetimeHelper.formatDateToDateVN(date)}`;
        }
        return link;
    },

    /**
    * Lấy link đường dần photo/album ảnh
    * @param {string} id ID của loại tin tức
    * @returns Đường dẫn chi tiết tin tức
    */
    renderLinkPhotos: (id = undefined) => {
        var link = routes.publishedPhotos;
        if (id) {
            link = link + `?albumid=${id}`;
        }
        return link;
    },

    /**
    * Lấy link đường dần danh sách tin tức theo loại tin tức
    * @param {string} id ID của loại tin tức
    * @returns Đường dẫn chi tiết tin tức
    */
    renderMenuPage: (id) => {
        var link = routes.publishedStaticPage.replace(":id", id);
        return link;
    },

    /**
    * Lấy link đường dần chi tiết tin tức theo id
    * @param {string} id ID của tin tức
    * @returns Đường dẫn chi tiết tin tức
    */
    renderLinkDocumentDetail: (id) => {
        var link = routes.publishedDocumentDetail.replace(":id", id);
        return link;
    },

    /**
    * Lấy link đường dần danh sách một thông tin công khai
    * @param {string} id ID của tin tức
    * @returns Đường dần danh sách một thông tin công khai
    */
    renderLinkPublishedPublicInformationListPage: (id) => {
        var link = routes.publishedPublicInformationListPage.replace(":id", id);
        return link;
    },

    /**
    * Lấy link đường dần chi tiết một thông tin công khai
    * @param {string} id ID của tin tức
    * @returns Đường dần chi tiết một thông tin công khai
    */
    renderLinkPublishedPublicInformationDetailPage: (id) => {
        var link = routes.publishedPublicInformationDetailPage.replace(":id", id);
        return link;
    },

    /**
     * Hiển thị thông báo todo
     */
    showNotifyTodo: () => {
        notification.open({
            message: 'Thông báo',
            description: 'Tính năng đang được thi công',
            duration: 1
        });
    },

    /**
    * Hiển thị thông báo thành công
    */
    showNotifySuccess: (msg) => {
        notification.open({
            message: 'Thành công',
            description: msg ?? "Thực hiện thành công",
            duration: 2,
            icon: (
                < CheckCircleOutlined
                    style={{
                        color: '#49cc90',
                    }}
                />
            ),
        });
    },
}



export default commonRender;
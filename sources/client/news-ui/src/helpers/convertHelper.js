const convertHelper = {
    //#region JSON
    /**
     * JSON Serialize object
     * @param {object} object đối tượng 
     */
    Serialize(object) {
        return JSON.stringify(object);
    },

    /**
     * JSON Deserialize object
     * @param {string} jsonString Nội dung string của JSON
     */
    Deserialize(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Deserialize:", error);
            return undefined;
        }
    },
    //#endregion

    //#region Base 64
    Base64Encode(data) {
        return btoa(data);
    },
    Base64Decode(data) {
        return atob(data);
    },
    //#endregion

    //#region HTML Encode/Decode
    UrlEncode(url) {
        return encodeURIComponent(url)
    },
    UrlDecode(url) {
        return decodeURIComponent(url);
    },
    //#endregion
};

export default convertHelper;
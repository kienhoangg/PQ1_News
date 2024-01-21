const stringHelper = {

    isNullOrEmpty(strValue) {
        if (strValue && strValue !== "") {
            return true;
        }
        return false;
    }
}


export default stringHelper;
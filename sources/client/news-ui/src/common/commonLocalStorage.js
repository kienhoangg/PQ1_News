import { getValue } from "@testing-library/user-event/dist/utils";

const commonLocalStorage = {
    setObject: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },

    getObject: (key) => {
        var data = localStorage.getItem(key);
        try {
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    },


    getValue(key) {
        let value = localStorage.getItem(key);
        value = value === null ? undefined : value;
        return value;
    },

    setValue(key, value) {
        localStorage.setItem(key, value);
    }
}


export default commonLocalStorage;
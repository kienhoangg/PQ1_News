import constant from 'common/constant';
import moment from 'moment';

const UTC_VN = 7;

const datetimeHelper = {
  formatDateToDateVN(input) {
    try {
      if (input) {
        let value = moment(input).format(constant.DATE_FORMAT_VN);
        return value;
      }
    } catch (error) { }
  },
  formatDatetimeToDateVN(input) {
    try {
      if (input) {
        let value = moment(input).format(constant.DATETIME_FORMAT_VN);
        return value;
      }
    } catch (error) { }
  },
  formatDatetimeToDate(input) {
    try {
      if (input) {
        let value = moment(input).format(constant.DATETIME_FORMAT);
        return value;
      }
    } catch (error) { }
  },

  formatDatetimeToDateSerer(input) {
    try {
      if (input) {
        let value = moment(input).format(constant.DATETIME_FORMAT_SERVER);
        return value;
      }
    } catch (error) { }
  },
};

export default datetimeHelper;

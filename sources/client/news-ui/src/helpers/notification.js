import { notification } from 'antd';
import { NotificationType } from 'common/enum';

const notificationCustom = {
  success: (body) => {
    notification.success(body);
  },
  info: (body) => {
    notification.info(body);
  },
  error: (body) => {
    notification.error(body);
  },
};

// TODO thông báo để demo
export const openNotification = (
  message,
  description = '',
  typeNotification = NotificationType.SUCCESS,
  placement = 'top'
) => {
  const body = {
    message,
    description,
    placement,
  };
  notificationCustom[typeNotification](body);
};

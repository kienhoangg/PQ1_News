import { Modal } from 'antd';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './AdminCollectionDetail.module.scss';
import AdminCollectionDetailDate from './AdminCollectionDetailDate/AdminCollectionDetailDate';
import AdminCollectionDetailDateTime from './AdminCollectionDetailDateTime/AdminCollectionDetailDateTime';
import AdminCollectionDetailImage from './AdminCollectionDetailImage/AdminCollectionDetailImage';
import AdminCollectionDetailText from './AdminCollectionDetailText/AdminCollectionDetailText';

const cx = classNames.bind(styles);

AdminCollectionDetail.propTypes = {
  listData: PropTypes.array, //Danh sách các dữ liệu chi tiết có thành phần
  // listData: React.PropTypes.arrayOf(React.PropTypes.shape({
  //     type: PropTypes.oneOf([
  //         'text', 'image', 'date', 'file'
  //     ]).isRequired,
  //     label: React.PropTypes.string.isRequired,
  //     content: React.PropTypes.string.isRequired,
  // })).isRequired
};

//Item:
// {
//     type: "string,",- "text|image|date|file",
//     label: "string",
//     content: "string"
// }

AdminCollectionDetail.defaultProps = {};

function AdminCollectionDetail(props) {
  const { listData } = props;
  const { open, onCancel, confirmLoading, width } = props;

  return (
    <Modal
      confirmLoading={confirmLoading}
      open={open}
      title='Hiển thị thông tin'
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      cancelText='Thoát'
      onCancel={onCancel}
      onOk={() => {}}
    >
      {Array.isArray(listData) &&
        listData.map((item) => {
          switch (item.type) {
            case 'date':
              return (
                <AdminCollectionDetailDate
                  key={item.label}
                  label={item.label}
                  value={item.content}
                />
              );
            case 'datetime':
              return (
                <AdminCollectionDetailDateTime
                  key={item.label}
                  label={item.label}
                  value={item.content}
                />
              );
            case 'image':
              return (
                <AdminCollectionDetailImage
                  key={item.label}
                  label={item.label}
                  value={item.content}
                />
              );
            case 'text':
            default:
              return (
                <AdminCollectionDetailText
                  key={item.label}
                  label={item.label}
                  value={item.content}
                />
              );
          }
        })}
    </Modal>
  );
}

export default AdminCollectionDetail;

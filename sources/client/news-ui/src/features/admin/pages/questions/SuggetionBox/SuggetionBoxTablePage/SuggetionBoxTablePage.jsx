import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Table } from 'antd';
import classNames from 'classnames/bind';
import commonFunc from 'common/commonFunc';
import { commonRenderTable } from 'common/commonRender';
import { DEFAULT_COLUMN_ORDER_BY, Role } from 'common/constant';
import { Direction, NotificationType } from 'common/enum';
import datetimeHelper from 'helpers/datetimeHelper';
import imageHelper from 'helpers/imageHelper';
import { openNotification } from 'helpers/notification';
import styles from './SuggetionBoxTablePage.module.scss';

const cx = classNames.bind(styles);

SuggetionBoxTablePage.propTypes = {};

SuggetionBoxTablePage.defaultProps = {};

function SuggetionBoxTablePage(props) {
  const {
    data,
    setPagination,
    updateStatusNew,
    deleteCategoryNew,
    onEdit,
    onClickRow,
  } = props;

  function handleOnClickStatus(values) {
    const role = commonFunc.getCookie('role');
    if (role !== Role.ADMIN) {
      openNotification(
        <>
          Chỉ có <b>ADMIN</b> mới thực hiện được hành động này
        </>,
        '',
        NotificationType.ERROR
      );
      return;
    }
    Modal.confirm({
      title: 'Cập nhật trạng thái',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          Bạn có chắc chắn <b>DUYỆT/HỦY DUYỆT</b> không?
        </>
      ),
      okText: 'Cập nhật',
      cancelText: 'Hủy',
      onOk: () => {
        if (!updateStatusNew) {
          return;
        }
        updateStatusNew(values);
      },
    });
  }

  const columns = [
    {
      key: 'FullName',
      dataIndex: 'FullName',
      title: 'Họ tên',
      render: (_, record) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            onClickRow && onClickRow(record);
          }}
        >
          {record.FullName}
        </div>
      ),
      sorter: (a, b) => a.FullName - b.FullName,
    },

    {
      key: 'Phone',
      dataIndex: 'Phone',
      title: 'Điện thoại',
      render: (Phone) => <>{Phone}</>,
      sorter: (a, b) => a.Phone - b.Phone,
      width: 200,
      align: 'right',
    },
    {
      key: 'Email',
      dataIndex: 'Email',
      title: 'Email',
      render: (Email) => <>{Email}</>,
      sorter: (a, b) => a.Email - b.Email,
      width: 200,
      align: 'right',
    },
    {
      key: 'Title',
      dataIndex: 'Title',
      title: 'Tiêu đề',
      render: (_, record) => <div>{record.Title}</div>,
      sorter: (a, b) => a.Title - b.Title,
      width: 200,
      align: 'right',
    },
    {
      key: 'FileAttachment',
      dataIndex: 'FileAttachment',
      title: 'Tệp đính kèm',
      render: (FileAttachment) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            window.open(imageHelper.getLinkImageUrl(FileAttachment));
          }}
        >
          {imageHelper.getNameFile(FileAttachment)}
        </div>
      ),
      sorter: (a, b) => a.FileAttachment - b.FileAttachment,
      width: 200,
      align: 'right',
    },
  ];

  let dataItems = data?.data ?? [];
  dataItems = dataItems.map((item) => {
    var PublishedDate = datetimeHelper.formatDateToDateVN(item.PublishedDate);
    return { ...item, PublishedDate: PublishedDate, key: item.Key };
  });

  const handleOnchangeTable = (pagination, filters, sorter, extra) => {
    let columnKey = sorter.columnKey;
    let order = sorter.order === 'ascend' ? Direction.ASC : Direction.DESC;
    if (sorter.order === undefined) {
      columnKey = DEFAULT_COLUMN_ORDER_BY;
      order = Direction.DESC;
    }

    setPagination(pagination.current, pagination.pageSize, columnKey, order);
  };

  return (
    <div className={cx('wrapper')}>
      <Table
        onChange={handleOnchangeTable}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30],
          showTotal: () =>
            commonRenderTable.showTableTotalPagination(data?.total ?? 0),
        }}
        dataSource={dataItems}
        size='small'
      />
    </div>
  );
}

export default SuggetionBoxTablePage;

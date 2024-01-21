import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, Tag, Modal, Row, Col } from 'antd';
import { commonRenderTable } from 'common/commonRender';
import datetimeHelper from 'helpers/datetimeHelper';
import styles from './NewsSourceTableData.module.scss';
import classNames from 'classnames/bind';
import { PropTypes } from 'prop-types';
import { Direction, NotificationType } from 'common/enum';
import { openNotification } from 'helpers/notification';
import commonFunc from 'common/commonFunc';
import { Role, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import newsApi from './../../../../../../apis/newsApi';

const cx = classNames.bind(styles);

NewsSourceTableData.propTypes = {
  /**
   * Func thay đổi phân trang
   */
  setPagination: PropTypes.func,

  /**
   * Xóa nguồn tin
   */
  deleteSourceNew: PropTypes.func,
};

NewsSourceTableData.defaultProps = {
  setPagination: () => {},
  deleteSourceNew: () => {},
};

function NewsSourceTableData(props) {
  const { data, setPagination, deleteSourceNew, updateStatusNew } = props;

  const columns = [
    {
      key: 'Title',
      dataIndex: 'Title',
      title: 'Tiêu đề',
      render: (_, { Id, Title }) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (props.showDetail) {
              props.showDetail(Id);
            }
          }}
        >
          {Title}
        </div>
      ),
      sorter: (a, b) => a.Title - b.Title,
    },
    {
      key: 'Order',
      dataIndex: 'Order',
      title: 'Số thứ tự',
      render: (Order) => <>{Order}</>,
      sorter: (a, b) => a.Order - b.Order,
      width: 100,
      align: 'right',
    },
    {
      key: 'Description',
      dataIndex: 'Description',
      title: 'Mô tả',
      render: (Description) => <>{Description}</>,
      sorter: (a, b) => a.Description - b.Description,
      width: 200,
    },
    {
      key: 'Status',
      dataIndex: 'Status',
      title: 'Trạng thái',
      align: 'center',
      width: 100,
      sorter: (a, b) => a.Status - b.Status,
      render: (_, { Id, Status }) => {
        let color = !Status ? 'geekblue' : 'volcano';
        let text = !Status ? 'Duyệt' : 'Hủy duyệt';
        return (
          <Tag
            color={color}
            key={Id}
            style={{ cursor: 'pointer' }}
            onClick={() => handleOnClickStatus({ Id, Status })}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EditFilled />}
            onClick={() => {
              if (record?.Status) {
                openNotification(
                  'Hủy duyệt trước khi sửa',
                  '',
                  NotificationType.ERROR
                );
                return;
              }
              handleChangeSourceNew(record);
            }}
          >
            Sửa
          </Button>
          <Button
            type='ghost'
            danger
            icon={<DeleteFilled />}
            onClick={() => {
              if (record?.Status) {
                openNotification(
                  'Hủy duyệt trước khi xóa',
                  '',
                  NotificationType.ERROR
                );
                return;
              }
              handleDeleteSourceNew(record);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];

  let dataItems = data?.data ?? [];
  dataItems = dataItems.map((item) => {
    var createdDate = datetimeHelper.formatDateToDateVN(item.createdDate);
    return { ...item, createdDate: createdDate, key: item.Id };
  });

  function handleChangeSourceNew(values) {
    if (values.Status) {
      openNotification('Hủy duyệt trước khi sửa', '', NotificationType.ERROR);
      return;
    }
    if (props.updateData) {
      props.updateData(values.Id);
    }
  }

  function handleDeleteSourceNew(values) {
    if (values.Status) {
      openNotification('Hủy duyệt trước khi xóa', '', NotificationType.ERROR);
      return;
    }
    return Modal.confirm({
      title: 'Xóa nguồn tin',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn xóa không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => deleteSourceNewCustom(values),
    });
  }

  const deleteSourceNewCustom = (values) => {
    if (!deleteSourceNew) {
      return;
    }
    deleteSourceNew(values.Id);
  };

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
          total: data?.total,
          showTotal: () =>
            commonRenderTable.showTableTotalPagination(data?.total ?? 0),
        }}
        dataSource={dataItems}
        size='small'
      />
    </div>
  );
}

export default NewsSourceTableData;

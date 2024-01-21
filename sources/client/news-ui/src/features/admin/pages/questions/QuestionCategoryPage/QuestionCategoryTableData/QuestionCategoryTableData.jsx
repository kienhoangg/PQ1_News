import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Table, Tag } from 'antd';
import { commonRenderTable } from 'common/commonRender';
import datetimeHelper from 'helpers/datetimeHelper';
import classNames from 'classnames/bind';
import styles from './QuestionCategoryTableData.module.scss';
import PropTypes from 'prop-types';
import { Direction, NotificationType } from 'common/enum';
import commonFunc from 'common/commonFunc';
import { DEFAULT_COLUMN_ORDER_BY, Role } from 'common/constant';
import { openNotification } from 'helpers/notification';

const cx = classNames.bind(styles);

QuestionCategoryTableData.propTypes = {
  setPagination: PropTypes.func,
  data: PropTypes.object,
  handleUpdate: PropTypes.func,
  handleDelete: PropTypes.func,
  toggleStatus: PropTypes.func,
  showDetail: PropTypes.func,
};

QuestionCategoryTableData.defaultProps = {
  setPagination: () => {},
};

function QuestionCategoryTableData(props) {
  const { setPagination, data, handleUpdate, handleDelete, toggleStatus } =
    props;

  const handleOnchangeTable = (pagination, filters, sorter, extra) => {
    let columnKey = sorter.columnKey;
    let order = sorter.order === 'ascend' ? Direction.ASC : Direction.DESC;
    if (sorter.order === undefined) {
      columnKey = DEFAULT_COLUMN_ORDER_BY;
      order = Direction.DESC;
    }

    setPagination(pagination.current, pagination.pageSize, columnKey, order);
  };

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
      sorter: (a, b) => a.title - b.title,
    },
    {
      key: 'Order',
      dataIndex: 'Order',
      title: 'Số thứ tự',
      render: (OrderNumber) => <>{OrderNumber}</>,
      sorter: (a, b) => a.OrderNumber - b.OrderNumber,
      width: 100,
      align: 'right',
    },
    {
      key: 'status',
      dataIndex: 'Status',
      title: 'Trạng thái',
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
              onEdit(record);
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
              onDeleteRecord(record);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];

  let dataItems = data?.Results ?? [];
  dataItems = dataItems.map((item) => {
    var CreatedDate = datetimeHelper.formatDateToDateVN(item.CreatedDate);
    return { ...item, CreatedDate: CreatedDate, key: item.Id };
  });

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
        if (toggleStatus) toggleStatus(values);
      },
    });
  }

  function onDeleteRecord(values) {
    if (values.Status) {
      openNotification('Hủy duyệt trước khi xóa', '', NotificationType.ERROR);
      return;
    }
    return Modal.confirm({
      title: 'Xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn xóa không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => handleDelete(values),
    });
  }

  function onEdit(values) {
    if (values.Status) {
      openNotification('Hủy duyệt trước khi sửa', '', NotificationType.ERROR);
      return;
    }
    if (handleUpdate) {
      handleUpdate(values.Id);
    }
  }

  return (
    <div className={cx('wrapper')}>
      <Table
        onChange={handleOnchangeTable}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30],
          total: data?.RowCount,
          showTotal: () =>
            commonRenderTable.showTableTotalPagination(data?.RowCount ?? 0),
        }}
        dataSource={dataItems}
        size='small'
      />
    </div>
  );
}

export default QuestionCategoryTableData;

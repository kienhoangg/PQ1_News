import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, Tag, Modal } from 'antd';
import classNames from 'classnames/bind';
import { commonRenderTable } from 'common/commonRender';
import { Direction, NotificationType } from 'common/enum';
import datetimeHelper from 'helpers/datetimeHelper';
import PropTypes from 'prop-types';
import styles from './NewsListTableData.module.scss';
import commonFunc from 'common/commonFunc';
import { openNotification } from 'helpers/notification';
import newsApi from 'apis/newsApi';
import { DEFAULT_COLUMN_ORDER_BY, Role, TypeUpdate } from 'common/constant';

const cx = classNames.bind(styles);

NewsListTableData.propTypes = {
  data: PropTypes.object,
  onClickShowRowDetail: PropTypes.func,
  /**
   * Func thay đổi phân trang
   */
  setPagination: PropTypes.func,

  /**
   * Xóa nguồn tin
   */
  deleteNew: PropTypes.func,
};

NewsListTableData.defaultProps = {
  setPagination: () => {},
  deleteNew: () => {},
};

function NewsListTableData(props) {
  const {
    data,
    onClickShowRowDetail,
    onClickEditOneRow,
    setPagination,
    setActionForm,
    updateStatusNew,
    onClickEdit,
    deleteSourceNew,
  } = props;
  const handleOnClickTitle = (values) => {
    if (onClickShowRowDetail) onClickShowRowDetail(values);
  };

  const handleOnClickEditRow = (values) => {
    if (!onClickEditOneRow || !setActionForm) {
      return;
    }
    onClickEditOneRow(values);
    setActionForm('edit');
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
            handleOnClickTitle({ Id, Title });
          }}
        >
          {Title}
        </div>
      ),
      sorter: (a, b) => a.title - b.title,
    },
    {
      key: 'PublishedDate',
      dataIndex: 'PublishedDate',
      title: 'Ngày sửa lần cuối',
      width: 200,
      sorter: (a, b) => a.PublishedDate - b.PublishedDate,
      render: (_, { PublishedDate }) => (
        <div>
          {PublishedDate.includes('0001')
            ? '- - -'
            : datetimeHelper.formatDateToDateVN(PublishedDate)}
        </div>
      ),
    },
    {
      title: 'Thông tin',
      dataIndex: 'description',
      key: 'Description',
      width: 200,
      sorter: (a, b) => a.Status - b.Status,
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
              if (record.Status) {
                openNotification(
                  'Hủy duyệt trước khi sửa',
                  '',
                  NotificationType.ERROR
                );
                return;
              }

              onClickEdit(record?.Id);
            }}
          >
            Sửa
          </Button>
          <Button
            type='ghost'
            danger
            icon={<DeleteFilled />}
            onClick={() => handleDeleteNews(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];

  function handleDeleteNews(values) {
    if (values.Status) {
      openNotification('Hủy duyệt trước khi xóa', '', NotificationType.ERROR);
      return;
    }
    return Modal.confirm({
      title: 'Xóa tin',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn xóa không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => deleteNewCustom(values),
    });
  }

  const deleteNewCustom = (values) => {
    if (!deleteSourceNew) {
      return;
    }
    deleteSourceNew(values.Id);
  };

  let dataItems = data?.data ?? [];
  dataItems = dataItems.map((item) => {
    var createdDate = datetimeHelper.formatDateToDateVN(item.createdDate);
    return { ...item, CreatedDate: createdDate, key: item.Id };
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

export default NewsListTableData;

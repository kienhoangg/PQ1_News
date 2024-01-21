import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, Tag, Modal } from 'antd';
import PropTypes from 'prop-types';
import { commonRenderTable } from 'common/commonRender';
import datetimeHelper from 'helpers/datetimeHelper';
import styles from './StaticCategoryTableData.module.scss';
import classNames from 'classnames/bind';
import { Direction, NotificationType } from 'common/enum';
import commonFunc from 'common/commonFunc';
import { Role, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import { openNotification } from 'helpers/notification';

const cx = classNames.bind(styles);

StaticCategoryTableData.propTypes = {
  data: PropTypes.shape({
    Title: PropTypes.string,
    OrderNumber: PropTypes.number,
    Status: PropTypes.bool,
  }),
  onClickShowRowDetail: PropTypes.func,
};

StaticCategoryTableData.defaultProps = {};

function StaticCategoryTableData(props) {
  const {
    data,
    onClickShowRowDetail,
    setPagination,
    deleteCategoryNew,
    updateStatusNew,
  } = props;

  const handleOnClickTitle = (values) => {
    if (onClickShowRowDetail) onClickShowRowDetail(values);
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
      sorter: (a, b) => a.CategoryNewsName - b.CategoryNewsName,
    },

    {
      key: 'status',
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
      // title: 'Xóa',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EditFilled />}
            onClick={() => handleChangeSourceNew(record)}
          >
            Sửa
          </Button>
          <Button
            type='ghost'
            danger
            icon={<DeleteFilled />}
            onClick={() => handleDeleteCategoryNew(record)}
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
    var createdDate = datetimeHelper.formatDateToDateVN(item.CreatedDate);
    return { ...item, CreatedDate: createdDate, key: item.Id };
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

  function handleDeleteCategoryNew(values) {
    if (values.Status) {
      openNotification('Hủy duyệt trước khi xóa', '', NotificationType.ERROR);
      return;
    }
    return Modal.confirm({
      title: 'Xóa danh mục tin',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn xóa không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => deleteCategoryNewCustom(values),
    });
  }

  const deleteCategoryNewCustom = (values) => {
    if (!deleteCategoryNew) {
      return;
    }
    deleteCategoryNew(values.Id);
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      // if (!changeRowKey) {
      //   return;
      // }
      // changeRowKey(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      //   console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log(`selectedRowKeys: ${selected}`);
    },
  };

  return (
    <div className={cx('wrapper')}>
      <Table
        columns={columns}
        // rowSelection={rowSelection}
        onChange={handleOnchangeTable}
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

export default StaticCategoryTableData;

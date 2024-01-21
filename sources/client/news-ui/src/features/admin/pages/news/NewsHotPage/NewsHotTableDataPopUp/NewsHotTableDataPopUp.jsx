import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import { commonRenderTable } from 'common/commonRender';
import datetimeHelper from 'helpers/datetimeHelper';
import classNames from 'classnames/bind';
import styles from './NewsHotTableDataPopUp.module.scss';
import { Direction } from 'common/enum';
import { DEFAULT_COLUMN_ORDER_BY } from 'common/constant';

const cx = classNames.bind(styles);

NewsHotTableDataPopUp.propTypes = {};

NewsHotTableDataPopUp.defaultProps = {};

function NewsHotTableDataPopUp(props) {
  const { data, setPagination, changeRowKey } = props;

  const columns = [
    {
      key: 'title',
      dataIndex: 'Title',
      title: 'Tiêu đề',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.title - b.title,
    },
    {
      key: 'CreatedDate',
      dataIndex: 'CreatedDate',
      title: 'Ngày đăng',
      align: 'center',
      width: 100,
      sorter: (a, b) => a.Status - b.Status,
      render: (CreatedDate) => <>{CreatedDate}</>,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      //   console.log(`selectedRowKeys: ${selectedRowKeys}`);
      if (!changeRowKey) {
        return;
      }
      changeRowKey(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      //   console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log(`selectedRowKeys: ${selected}`);
    },
  };

  let dataItems = data?.data ?? [];
  dataItems = dataItems.map((item) => {
    var createdDate = datetimeHelper.formatDateToDateVN(item.CreatedDate);
    return { ...item, CreatedDate: createdDate, key: item.Id };
  });

  function handleOnClickStatus(values) {
    // console.log(values);
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
        columns={columns}
        onChange={handleOnchangeTable}
        rowSelection={rowSelection}
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

export default NewsHotTableDataPopUp;

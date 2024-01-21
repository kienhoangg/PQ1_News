import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Tag, Modal } from "antd";
import { commonRenderTable } from "common/commonRender";
import datetimeHelper from "helpers/datetimeHelper";
import classNames from "classnames/bind";
import styles from "./DocumentCategoryTableData.module.scss";
import { Direction } from "common/enum";
import commonFunc from "common/commonFunc";
import { Role, DEFAULT_COLUMN_ORDER_BY } from "common/constant";
import { openNotification } from "helpers/notification";
import { NotificationType } from "common/enum";

const cx = classNames.bind(styles);

DocumentCategoryTableData.propTypes = {};

DocumentCategoryTableData.defaultProps = {};

function DocumentCategoryTableData(props) {
  const {
    data,
    setPagination,
    deleteSourceNew,
    updateStatusNew,
    onEdit,
    onClickRow,
  } = props;

  const columns = [
    {
      key: "title",
      dataIndex: "Title",
      title: "Tiêu đề",
      render: (_, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            onClickRow && onClickRow(record);
          }}
        >
          {record.Title}
        </div>
      ),
      sorter: (a, b) => a.title - b.title,
    },
    {
      key: "OrderNumber",
      dataIndex: "OrderNumber",
      title: "Số thứ tự",
      render: (OrderNumber) => <>{OrderNumber}</>,
      sorter: (a, b) => a.OrderNumber - b.OrderNumber,
      width: 100,
      align: "right",
    },
    {
      key: "status",
      dataIndex: "Status",
      title: "Trạng thái",
      align: "center",
      width: 100,
      sorter: (a, b) => a.Status - b.Status,
      render: (_, { Id, Status }) => {
        let color = !Status ? "geekblue" : "volcano";
        let text = !Status ? "Duyệt" : "Hủy duyệt";
        return (
          <Tag
            color={color}
            key={Id}
            style={{ cursor: "pointer" }}
            onClick={(event) => {
              event?.stopPropagation();
              handleOnClickStatus({ Id, Status });
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditFilled />}
            onClick={(event) => {
              event?.stopPropagation();

              if (record?.Status) {
                openNotification(
                  "Hủy duyệt trước khi sửa",
                  "",
                  NotificationType.ERROR
                );
                return;
              }
              onEdit && onEdit(record);
            }}
          >
            Sửa
          </Button>
          <Button
            type="ghost"
            danger
            icon={<DeleteFilled />}
            onClick={(event) => {
              event?.stopPropagation();
              if (record?.Status) {
                openNotification(
                  "Hủy duyệt trước khi xóa",
                  "",
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
    var PublishedDate = datetimeHelper.formatDateToDateVN(item.PublishedDate);
    return { ...item, PublishedDate: PublishedDate, key: item.Key };
  });

  function handleOnClickStatus(values) {
    const role = commonFunc.getCookie("role");
    if (role !== Role.ADMIN) {
      openNotification(
        <>
          Chỉ có <b>ADMIN</b> mới thực hiện được hành động này
        </>,
        "",
        NotificationType.ERROR
      );
      return;
    }
    Modal.confirm({
      title: "Cập nhật trạng thái",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          Bạn có chắc chắn <b>DUYỆT/HỦY DUYỆT</b> không?
        </>
      ),
      okText: "Cập nhật",
      cancelText: "Hủy",
      onOk: () => {
        if (!updateStatusNew) {
          return;
        }
        updateStatusNew(values);
      },
    });
  }

  function handleDeleteSourceNew(values) {
    if (values.Status) {
      openNotification("Hủy duyệt trước khi xóa", "", NotificationType.ERROR);
      return;
    }
    return Modal.confirm({
      title: "Xóa nguồn tin",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn xóa không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => deleteSourceNewCustom(values),
    });
  }

  const deleteSourceNewCustom = (values) => {
    if (!deleteSourceNew) {
      return;
    }
    deleteSourceNew(values.Id);
  };

  const handleOnchangeTable = (pagination, filters, sorter, extra) => {
    let columnKey = sorter.columnKey;
    let order = sorter.order === "ascend" ? Direction.ASC : Direction.DESC;
    if (sorter.order === undefined) {
      columnKey = DEFAULT_COLUMN_ORDER_BY;
      order = Direction.DESC;
    }

    setPagination(pagination.current, pagination.pageSize, columnKey, order);
  };
  return (
    <div className={cx("wrapper")}>
      <Table
        columns={columns}
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
        size="small"
      />
    </div>
  );
}

export default DocumentCategoryTableData;

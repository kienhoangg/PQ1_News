import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Space, Table, Tag } from "antd";
import classNames from "classnames/bind";
import commonFunc from "common/commonFunc";
import { commonRenderTable } from "common/commonRender";
import { Role, DEFAULT_COLUMN_ORDER_BY } from "common/constant";
import { Direction, NotificationType } from "common/enum";
import datetimeHelper from "helpers/datetimeHelper";
import { openNotification } from "helpers/notification";
import styles from "./QuestionListTableData.module.scss";

const cx = classNames.bind(styles);

QuestionListTableData.propTypes = {};

QuestionListTableData.defaultProps = {};

function QuestionListTableData(props) {
  const {
    data,
    setPagination,
    updateStatusNew,
    deleteCategoryNew,
    onEdit,
    onClickRow,
  } = props;

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

  const columns = [
    {
      key: "Title",
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
      key: "Order",
      dataIndex: "Order",
      title: "Số thứ tự",
      render: (OrderNumber) => <>{OrderNumber}</>,
      sorter: (a, b) => a.OrderNumber - b.OrderNumber,
      width: 100,
      align: "right",
    },
    {
      key: "Status",
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
              event.stopPropagation();

              if (record?.Status) {
                openNotification(
                  "Hủy duyệt trước khi sửa",
                  "",
                  NotificationType.ERROR
                );
                return;
              }
              onEdit(record?.Id);
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
                title: "Xóa video",
                icon: <ExclamationCircleOutlined />,
                content: (
                  <>
                    Bạn có chắc chắn <b>Xóa</b> không?
                  </>
                ),
                okText: "Xóa",
                cancelText: "Hủy",
                onOk: () => {
                  if (!deleteCategoryNew) {
                    return;
                  }
                  deleteCategoryNew(record);
                },
              });
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
        size="small"
      />
    </div>
  );
}

export default QuestionListTableData;

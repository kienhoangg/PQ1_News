import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Tag, Modal } from "antd";
import { commonRenderTable } from "common/commonRender";
import datetimeHelper from "helpers/datetimeHelper";
import classNames from "classnames/bind";
import styles from "./NewsHotTableData.module.scss";
import { Direction } from "common/enum";
import commonFunc from "common/commonFunc";
import { openNotification } from "helpers/notification";
import { NotificationType } from "common/enum";
import { DEFAULT_COLUMN_ORDER_BY, Role } from "common/constant";

const cx = classNames.bind(styles);

NewsHotTableData.propTypes = {};

NewsHotTableData.defaultProps = {};

function NewsHotTableData(props) {
  const { data, setPagination, cancelNewsHost, updateStatusNew } = props;

  const columns = [
    {
      key: "Title",
      dataIndex: "Title",
      title: "Tiêu đề",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.Title - b.Title,
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
            onClick={() => handleOnClickStatus({ Id, Status })}
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
          <Tag
            color={"volcano"}
            style={{ cursor: "pointer" }}
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
                  if (!cancelNewsHost) {
                    return;
                  }
                  cancelNewsHost(record);
                },
              });
            }}
          >
            Xóa
          </Tag>
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

  function handleDeleteHotNew(values) {
    if (values.Status) {
      openNotification("Hủy duyệt trước khi xóa", "", NotificationType.ERROR);
      return;
    }
    return Modal.confirm({
      title: "Xóa tin nổi bật",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn xóa không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => deleteHotNewCustom(values),
    });
  }

  const deleteHotNewCustom = (values) => {
    if (!cancelNewsHost) {
      return;
    }
    cancelNewsHost(values.Id);
  };

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

  const handleOnchangeTable = (pagination, filters, sorter, extra) => {
    let columnKey = sorter.columnKey;
    let order = sorter.order === "ascend" ? Direction.ASC : Direction.DESC;
    if (sorter.order === undefined) {
      columnKey = DEFAULT_COLUMN_ORDER_BY;
      order = Direction.DESC;
    }

    setPagination(
      pagination.current,
      pagination.pageSize,
      columnKey,
      order,
      "hotnew"
    );
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

export default NewsHotTableData;

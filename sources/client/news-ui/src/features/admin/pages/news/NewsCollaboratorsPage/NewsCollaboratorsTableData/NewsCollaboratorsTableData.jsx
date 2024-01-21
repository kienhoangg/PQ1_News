import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Space, Table, Tag } from "antd";
import { commonRenderTable } from "common/commonRender";
import datetimeHelper from "helpers/datetimeHelper";
import classNames from "classnames/bind";
import styles from "./NewsCollaboratorsTableData.module.scss";
import { Role, DEFAULT_COLUMN_ORDER_BY } from "common/constant";
import commonFunc from "common/commonFunc";
import { openNotification } from "helpers/notification";
import { Direction, NotificationType } from "common/enum";

const cx = classNames.bind(styles);

NewsCollaboratorsTableData.propTypes = {};

NewsCollaboratorsTableData.defaultProps = {};

function NewsCollaboratorsTableData(props) {
  const {
    data,
    onEdit,
    updateStatusNew,
    deleteCategoryNew,
    setPagination,
    onClickRow,
  } = props;

  const columns = [
    {
      key: "Name",
      dataIndex: "Name",
      title: "Họ và tên",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => a.title - b.title,
    },
    {
      key: "Username",
      dataIndex: "Username",
      title: "Tên đăng nhập",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => a.UserName - b.UserName,
      width: 150,
    },
    {
      key: "Email",
      dataIndex: "Email",
      title: "Email",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => a.Email - b.Email,
      width: 200,
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

  const handleOnchangeTable = (pagination, filters, sorter, extra) => {
    let columnKey = sorter.columnKey;
    let order = sorter.order === "ascend" ? Direction.ASC : Direction.DESC;
    if (sorter.order === undefined) {
      columnKey = DEFAULT_COLUMN_ORDER_BY;
      order = Direction.DESC;
    }

    setPagination(pagination.current, pagination.pageSize, columnKey, order);
  };

  let dataItems = data?.data ?? [];
  dataItems = dataItems.map((item) => {
    var createdDate = datetimeHelper.formatDateToDateVN(item.CreatedDate);
    return { ...item, CreatedDate: createdDate, key: item.Key };
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
        onRow={(item) => ({
          onClick: () => onClickRow && onClickRow(item),
        })}
      />
    </div>
  );
}

export default NewsCollaboratorsTableData;

import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Space, Table, Tag } from "antd";
import { commonRenderTable } from "common/commonRender";
import datetimeHelper from "helpers/datetimeHelper";
import styles from "./NewsCommentTableData.module.scss";
import classNames from "classnames/bind";
import { Direction, NotificationType } from "common/enum";
import commonFunc from "common/commonFunc";
import { Role, DEFAULT_COLUMN_ORDER_BY } from "common/constant";
import { openNotification } from "helpers/notification";

const cx = classNames.bind(styles);

NewsCommentTableData.propTypes = {};

NewsCommentTableData.defaultProps = {};

function NewsCommentTableData(props) {
  const {
    data,
    setPagination,
    updateStatusNew,
    deleteCategoryNew,
    onClickRow,
  } = props;

  const columns = [
    {
      key: "Username",
      dataIndex: "Username",
      title: "Người gửi",
      render: (text) => <>{text}</>,
      sorter: (a, b) => a.Name - b.Name,
      width: 150,
    },
    {
      key: "NewsPostTitle",
      dataIndex: "NewsPostTitle",
      title: "Tiêu đề tin",
      render: (text) => <>{text}</>,
      sorter: (a, b) => a.Title - b.Title,
    },
    {
      key: "CreatedDate",
      dataIndex: "CreatedDate",
      title: "Ngày gửi",
      width: 110,
      sorter: (a, b) => a.SendDate - b.SendDate,
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
      width: 100,
    },
  ];

  let dataItems = data?.data ?? [];
  dataItems = dataItems.map((item) => {
    var CreatedDate = datetimeHelper.formatDateToDateVN(item.CreatedDate);
    return {
      ...item,
      CreatedDate: CreatedDate,
      CreatedDateRaw: item.CreatedDate,
      key: item.Key,
      NewsPostTitle: item?.NewsPost?.Title,
    };
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
        onRow={(item) => ({
          onClick: () => onClickRow && onClickRow(item),
        })}
      />
    </div>
  );
}

export default NewsCommentTableData;

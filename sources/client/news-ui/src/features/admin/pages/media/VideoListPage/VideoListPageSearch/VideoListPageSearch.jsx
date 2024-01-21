import { FileAddFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row } from "antd";
import classNames from "classnames/bind";
import { useState } from "react";
import styles from "./VideoListPageSearch.module.scss";

const cx = classNames.bind(styles);

VideoListPageSearch.propTypes = {};

VideoListPageSearch.defaultProps = {};

function VideoListPageSearch(props) {
  const { setTextSearch } = props;
  const [keyword, setKeyword] = useState("");
  /**
   * Sử lý sự kiện bấp search
   */
  const handleOnclickButtonSearch = () => {
    if (!setTextSearch) {
      return;
    }
    setTextSearch(keyword);
  };

  /**
   * Set từ khóa cần tìm để lấy lại danh sách
   * @param {*} event Sự kiên thay đổi
   */
  const handleChange = (event) => {
    const textSearch = event?.target?.value?.trim() ?? "";
    setKeyword(textSearch);
    // TODO: Xóa nếu bỏ search trong lúc gõ
    // setTextSearch(textSearch);
  };

  return (
    <div className={cx("wrapper")}>
      <Row gutter={16} style={{ marginBottom: 0 }}>
        <Col span={8}>
          <Input
            style={{ width: "100%" }}
            placeholder="Từ khóa tìm kiếm"
            onChange={handleChange}
          />
        </Col>
        <Col span={2}>
          <Row justify="start">
            <Button
              type="default"
              icon={<SearchOutlined />}
              onClick={handleOnclickButtonSearch}
            >
              Tìm kiếm
            </Button>
          </Row>
        </Col>
        <Col span={14}>
          <Row justify="end">
            <Button
              type="primary"
              icon={<FileAddFilled />}
              onClick={() => props?.onCreate()}
            >
              Tạo mới
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default VideoListPageSearch;

import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select } from "antd";
import { Option } from "antd/lib/mentions";
import classNames from "classnames/bind";
import { useState } from "react";
import styles from "./NewsCommentPageSearch.module.scss";

const cx = classNames.bind(styles);

NewsCommentPageSearch.propTypes = {};

NewsCommentPageSearch.defaultProps = {};

function NewsCommentPageSearch(props) {
  const { setTextSearch, listCategoryNews } = props;

  const [keyword, setKeyword] = useState("");
  const [categoryNews, setCategoryNews] = useState();

  console.log(categoryNews);

  /**
   * Sử lý sự kiện bấp search
   */
  const handleOnclickButtonSearch = () => {
    if (!setTextSearch) {
      return;
    }
    setTextSearch(keyword, parseInt(categoryNews) || null);
  };

  /**
   * Set từ khóa cần tìm để lấy lại danh sách
   * @param {*} event Sự kiên thay đổi
   */
  const handleChange = (event) => {
    const textSearch = event?.target?.value?.trim() ?? "";
    setKeyword(textSearch);
  };

  return (
    <div className={cx("wrapper")}>
      <Row gutter={16} style={{ marginBottom: 0 }}>
        <Col span={4}>
          <Input
            style={{ width: "100%" }}
            placeholder="Từ khóa tìm kiếm"
            onChange={handleChange}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Danh mục tin"
            style={{ width: "100%" }}
            onChange={(id) => setCategoryNews(id)}
            allowClear
          >
            <Option value="1">Lĩnh vực 1</Option>
            {listCategoryNews?.map((x) => (
              <Option value={x.Id} key={x.Id}>
                {x.CategoryNewsName}
              </Option>
            ))}
          </Select>
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
      </Row>
    </div>
  );
}

export default NewsCommentPageSearch;

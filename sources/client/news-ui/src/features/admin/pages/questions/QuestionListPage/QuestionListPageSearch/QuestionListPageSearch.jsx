import { FileAddFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './QuestionListPageSearch.module.scss';

const cx = classNames.bind(styles);

QuestionListPageSearch.propTypes = {};

QuestionListPageSearch.defaultProps = {};

function QuestionListPageSearch(props) {
  const { setTextSearch, onCreate, dataCategoryQuestion } = props;

  const [keyword, setKeyword] = useState('');
  const [questionStatus, setQuestionStatus] = useState(null);
  const [categoryQuestion, setCategoryQuestion] = useState(null);

  console.log(categoryQuestion);
  /**
   * Sử lý sự kiện bấp search
   */
  const handleOnclickButtonSearch = () => {
    if (!setTextSearch) {
      return;
    }
    setTextSearch(keyword, questionStatus, categoryQuestion);
  };

  /**
   * Set từ khóa cần tìm để lấy lại danh sách
   * @param {*} event Sự kiên thay đổi
   */
  const handleChange = (event) => {
    const textSearch = event?.target?.value?.trim() ?? '';
    setKeyword(textSearch);
  };

  const QuestionStatus = [
    {
      id: 0,
      label: 'Câu hỏi mới',
    },
    {
      id: 1,
      label: 'Chờ câu trả lời',
    },
    {
      id: 2,
      label: 'Chờ được phê duyệt',
    },
    {
      id: 3,
      label: 'Câu hỏi được phê duyệt',
    },
  ];

  return (
    <div className={cx('wrapper')}>
      <Row gutter={16} style={{ marginBottom: 0 }}>
        <Col
          span={8}
          style={{
            display: 'flex',
          }}
        >
          <Input
            style={{ width: '100%' }}
            placeholder='Từ khóa tìm kiếm'
            onChange={handleChange}
          />

          <Select
            style={{
              width: 200,
              marginLeft: 20,
            }}
            placeholder='Danh mục chủ đề'
            onChange={(title) => {
              setCategoryQuestion(
                parseInt(
                  dataCategoryQuestion.find((x) => x.Title === title)?.Id ?? '0'
                )
              );
            }}
            allowClear
            showSearch
          >
            {dataCategoryQuestion?.map((x) => (
              <Option value={x.Title} key={x.Id}>
                {x?.Title}
              </Option>
            ))}
          </Select>
          {/* <Select
            style={{
              width: 200,
              marginLeft: 20,
            }}
            placeholder='Trạng thái câu hỏi'
            onChange={(label) => {
              setQuestionStatus(
                parseInt(
                  QuestionStatus.find((x) => x.label === label)?.id ?? '0'
                )
              );
            }}
            allowClear
            showSearch
          >
            {QuestionStatus?.map((x) => (
              <Option value={x.label} key={x.id}>
                {x.label}
              </Option>
            ))}
          </Select> */}
        </Col>
        <Col span={2}>
          <Row justify='start'>
            <Button
              type='default'
              icon={<SearchOutlined />}
              onClick={handleOnclickButtonSearch}
            >
              Tìm kiếm
            </Button>
          </Row>
        </Col>
        <Col span={14}>
          <Row justify='end'>
            <Button type='primary' icon={<FileAddFilled />} onClick={onCreate}>
              Tạo mới
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default QuestionListPageSearch;

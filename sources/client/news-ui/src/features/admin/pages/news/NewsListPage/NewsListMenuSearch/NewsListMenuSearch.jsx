import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './NewsListMenuSearch.module.scss';
import classNames from 'classnames/bind';
import { Button, Col, DatePicker, Input, Row, Select, TreeSelect } from 'antd';
import { TreeNode } from 'antd/lib/tree-select';
import { Option } from 'antd/lib/mentions';
import { FileAddFilled, SearchOutlined } from '@ant-design/icons';
import commonFunc from 'common/commonFunc';
import datetimeHelper from 'helpers/datetimeHelper';
import convertHelper from 'helpers/convertHelper';

const cx = classNames.bind(styles);

NewsListMenuSearch.propTypes = {
  setOpenCollectionEditor: PropTypes.func,
  /**
   * Func giúp Component bố gọi để thiết lập từ khóa cần tìm
   */
  setFilterNews: PropTypes.func,
};

NewsListMenuSearch.defaultProps = {
  setFilterNews: () => {},
};

function NewsListMenuSearch(props) {
  const { setOpenCollectionEditor, setFilterNews, setActionForm, dataFilter } =
    props;

  const [objFilterNews, setObjFilterNews] = useState(undefined);
  const [keyword, setKeyword] = useState('');

  const onChangeCategoryNews = (categoryNewsId) => {
    const id =
      dataFilter?.categoryNews.find(
        (x) => x.CategoryNewsName === categoryNewsId
      )?.Id ?? undefined;
    setObjFilterNews({ ...objFilterNews, categoryNewsId: id });
  };

  const handleOnclickCreate = () => {
    if (!setOpenCollectionEditor || !setActionForm) {
      return;
    }
    setOpenCollectionEditor(true);
    setActionForm('create');
  };

  const handleChangeTextSearch = (event) => {
    const keyword = event?.target?.value?.trim() ?? '';
    setObjFilterNews({ ...objFilterNews, keyword });

    // setKeyword(textSearch);
    // // TODO: Xóa nếu bỏ search trong lúc gõ
    // setTextSearch(textSearch);
  };

  /**
   * Sử lý sự kiện bấp search
   */
  const handleOnclickButtonSearch = () => {
    if (!setFilterNews) {
      return;
    }
    setFilterNews(objFilterNews);
  };

  const handleChangeFieldNews = (fieldNewsId) => {
    const id =
      dataFilter?.fieldNews.find((x) => x.Title === fieldNewsId)?.Id ??
      undefined;
    setObjFilterNews({ ...objFilterNews, fieldNewsId: id });
  };

  const renderFieldNews = (
    <Select
      showSearch
      placeholder='Lĩnh vực'
      style={{ width: '100%' }}
      allowClear={true}
      onChange={handleChangeFieldNews}
    >
      {dataFilter?.fieldNews?.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const generateTree = (arrNode) => {
    return arrNode.map((x) => (
      <TreeNode
        value={x.CategoryNewsName}
        title={x.CategoryNewsName}
        key={x.Id}
      >
        {x.children.length > 0 && generateTree(x.children)}
      </TreeNode>
    ));
  };
  const renderCategoryNews = (
    <TreeSelect
      showSearch
      style={{
        width: '100%',
      }}
      value={objFilterNews?.type}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder='Danh mục tin'
      allowClear
      treeDefaultExpandAll
      onChange={onChangeCategoryNews}
    >
      {generateTree(
        commonFunc.list_to_tree([...dataFilter?.categoryNews] ?? [])
      )}
    </TreeSelect>
  );

  const handleChangeSourceNews = (sourceNewsId) => {
    const id =
      dataFilter?.sourceNews.find((x) => x.Title === sourceNewsId)?.Id ??
      undefined;
    setObjFilterNews({ ...objFilterNews, sourceNewsId: id });
  };

  const renderSourceNews = (
    <Select
      showSearch
      placeholder='Nguồn tin'
      style={{ width: '100%' }}
      allowClear={true}
      onChange={handleChangeSourceNews}
    >
      {dataFilter?.sourceNews?.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const handleFromDate = (e, type) => {
    const date = (e?._d ?? '0001-01-01 00:00:00.0000000') + '';
    if (date.includes('0001')) {
      const filter = { ...objFilterNews };
      delete filter[type];
      setObjFilterNews({ ...filter });
      return;
    }
    const dateConvert = datetimeHelper.formatDatetimeToDateSerer(date);
    setObjFilterNews({ ...objFilterNews, [type]: dateConvert });
  };

  const handleStatus = (value) => {
    setObjFilterNews({ ...objFilterNews, status: value });
  };

  return (
    <div className={cx('wrapper')}>
      <Row gutter={16} style={{ marginBottom: 16 }} justify={'space-between'}>
        <Col span={6}>
          <Input
            placeholder='Từ khóa tìm kiếm'
            onChange={handleChangeTextSearch}
          />
        </Col>
        <Col span={6}>{renderCategoryNews}</Col>

        <Col span={6}>{renderSourceNews}</Col>

        <Col span={6}>{renderFieldNews}</Col>
        {/* <Col span={4}>
          <Select placeholder='Biên tập viên' style={{ width: '100%' }}>
            <Option value='1'>Biên tập viên 1</Option>
            <Option value='2'>Biên tập viên 2</Option>
            <Option value='3'>Biên tập viên 3</Option>
            <Option value='4'>Biên tập viên 4</Option>
          </Select>
        </Col> */}
      </Row>
      <Row gutter={16} justify={'space-between'}>
        {/* <Col span={4}>
          <Select placeholder='Tác giả' style={{ width: '100%' }}>
            <Option value='1'>Tác giả 1</Option>
            <Option value='2'>Tác giả 2</Option>
            <Option value='3'>Tác giả 3</Option>
            <Option value='4'>Tác giả 4</Option>
            <Option value='5'>Tác giả 5</Option>
            <Option value='6'>Tác giả 6</Option>
          </Select>
        </Col> */}
        <Col span={5}>
          <Select
            allowClear={true}
            placeholder='Trạng thái tin'
            style={{ width: '100%' }}
            onChange={handleStatus}
          >
            <Option value={1}>Đã duyệt</Option>
            <Option value={0}>Chưa được duyệt</Option>
          </Select>
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder='Từ ngày'
            style={{ width: '100%' }}
            onChange={(e) => handleFromDate(e, 'fromDate')}
          />
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder='Đến ngày'
            style={{ width: '100%' }}
            onChange={(e) => handleFromDate(e, 'toDate')}
          />
        </Col>
        <Col span={9}>
          <Row>
            <Col span={6}>
              <Button
                type='default'
                icon={<SearchOutlined />}
                onClick={handleOnclickButtonSearch}
              >
                Tìm kiếm
              </Button>
            </Col>
            <Col span={6}>
              <Button
                type='primary'
                style={{ width: '100%', marginLeft: 16 }}
                icon={<FileAddFilled />}
                onClick={handleOnclickCreate}
              >
                Tạo mới
              </Button>
            </Col>
          </Row>
        </Col>
        {/* <Col span={4}>
          <Button type='default'>Kho ảnh</Button>
        </Col> */}
      </Row>
    </div>
  );
}

export default NewsListMenuSearch;

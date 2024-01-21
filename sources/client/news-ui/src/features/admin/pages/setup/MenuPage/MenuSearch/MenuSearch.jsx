import { FileAddFilled } from '@ant-design/icons';
import { Button, Col, Row, TreeSelect } from 'antd';
import { TreeNode } from 'antd/lib/tree-select';
import classNames from 'classnames/bind';
import commonFunc from 'common/commonFunc';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './MenuSearch.module.scss';

const cx = classNames.bind(styles);

MenuSearch.propTypes = {
  setOpenCollectionEditor: PropTypes.func,
  /**
   * Func giúp Component bố gọi để thiết lập từ khóa cần tìm
   */
  setFilterNews: PropTypes.func,

  dataMenu: PropTypes.array,
};

MenuSearch.defaultProps = {
  setFilterNews: () => {},
  dataMenu: [],
};

function MenuSearch(props) {
  const { setOpenCollectionEditor, changeParent, dataMenu } = props;
  const [objFilterNews, setObjFilterNews] = useState();

  const onChangeCategoryNews = (categoryNewsId) => {
    setObjFilterNews(categoryNewsId);
    if (!changeParent) {
      return;
    }
    const id =
      dataMenu.find((x) => x.Title === categoryNewsId)?.Id ?? undefined;
    changeParent(id);
  };

  const generateTree = (arrNode) => {
    return arrNode.map((x) => (
      <TreeNode value={x.Title} title={x.Title} key={x.Id}>
        {x.children.length > 0 && generateTree(x.children)}
      </TreeNode>
    ));
  };

  const getParent = () => {
    const _dataMenu = [...dataMenu];
    return _dataMenu.filter((x) => x.ParentId === 0);
  };

  const renderMenu = (
    <TreeSelect
      showSearch
      style={{
        width: '100%',
      }}
      value={objFilterNews}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder='Chọn menu'
      allowClear
      treeDefaultExpandAll={false}
      onChange={onChangeCategoryNews}
    >
      {generateTree(commonFunc.list_to_tree(dataMenu))}
    </TreeSelect>
  );

  return <div className={cx('wrapper')}>{renderMenu}</div>;
}

export default MenuSearch;

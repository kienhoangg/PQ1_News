import { MailOutlined } from '@ant-design/icons';
import { Menu, Skeleton } from 'antd';
import commonRender from 'common/commonRender';
import Images from 'common/images';
import routes from 'config/configRoutes';
import { useState } from 'react';
import './Navbar.scss';
import NavBarButtonItem from './NavBarButtonItem/NavBarButtonItem';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { envDomainClient } from 'common/enviroments';

Navbar.propTypes = {
  menuDatas: PropTypes.array,
  isLoading: PropTypes.bool,
};

Navbar.defaultProps = {
  menuDatas: undefined,
  isLoading: true,
};

function Navbar(props) {
  const navigate = useNavigate();
  const { isLoading, menuDatas } = props;

  let items = [
    {
      label: 'Trang chủ',
      key: 'mail',
      icon: <img src={Images.EMBELEM_VIETNAM} width={10} alt={''} />,
    },
  ];

  if (menuDatas) {
    items = menuDatas.map((dataLevel1) => {
      var itemDateLevel2 = dataLevel1?.Items?.map((item) => {
        return {
          label: item.Title,
          key: item.Id,
        };
      });

      let result = {
        label: dataLevel1.Title,
        key: dataLevel1.Id,
        icon: dataLevel1?.isHome ? (
          <img src={Images.EMBELEM_VIETNAM} width={10} alt={''} />
        ) : (
          ''
        ),
      };

      if (Array.isArray(dataLevel1?.Items) && dataLevel1?.Items.length > 0) {
        result.children = itemDateLevel2;
      }
      if (dataLevel1?.Title.toLowerCase() == 'trang chủ') {
        // if (dataLevel1?.IsHome) {
        result.icon = <img src={Images.EMBELEM_VIETNAM} width={10} alt={''} />;
      }
      return result;
    });
  }

  function handleOnClickMenuItem(params) {
    let select = getMenuItemByKey(params.key);

    if (select) {
      if (select?.IsHome) navigate('/');
      if (select?.Url) {
        select.Url = select.Url.trim();
        navigate(select.Url.replace(envDomainClient, ''));
      }
    }
  }

  function getMenuItemByKey(key) {
    for (let index = 0; index < menuDatas.length; index++) {
      const menuItem = menuDatas[index];
      if (menuItem?.Id == key) return menuDatas[index];

      for (let subIndex = 0; subIndex < menuItem?.Items.length; subIndex++) {
        const element = menuItem.Items[subIndex];
        if (element?.Id == key) return element;
      }
    }
    return undefined;
  }

  return (
    <div className='news-navbar'>
      {isLoading ? (
        <>
          <Skeleton.Input active block />
        </>
      ) : (
        <>
          {Array.isArray(menuDatas) && (
            <Menu
              mode='horizontal'
              items={items}
              selectable={false}
              onClick={handleOnClickMenuItem}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Navbar;

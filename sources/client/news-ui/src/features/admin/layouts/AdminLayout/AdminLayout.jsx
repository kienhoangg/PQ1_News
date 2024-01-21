import { Breadcrumb, Layout, Menu } from 'antd';
import classNames from 'classnames/bind';
import adminConst from 'common/adminConstant';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.scss';
import './AdminLayout.scss';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import commonFunc from 'common/commonFunc';
import routes from 'config/configRoutes';

const cx = classNames.bind(styles);

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

AdminLayout.defaultProps = {};

const { Content, Sider } = Layout;

const menuItems = adminConst.adminMenu;
function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumbValues, setBreadcrumbValues] = useState(['Tin tức - bài viết', 'Tin tức']);
  const navigate = useNavigate();

  const handleOnClickMenuItem = (values) => {
    const breadcrumbs = values?.keyPath.map((key) => {
      return getMenuItemByKey(key)?.label;
    });
    setBreadcrumbValues(breadcrumbs?.reverse());

    var menuItemNow = getMenuItemByKey(values.key);
    if (menuItemNow?.to) {
      navigate(menuItemNow.to);
    }
  };

  const getMenuItemByKey = (key) => {
    for (const submenu of menuItems) {
      if (submenu.key === key) {
        return submenu;
      }

      if (submenu?.children) {
        for (const item of submenu.children) {
          if (item.key === key) {
            return item;
          }
        }
      }
    }
    return undefined;
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
      className='layout-admin'
    >
      <Sider
        collapsible
        width={220}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className={cx('logo')}>
          <span>Xin chào {commonFunc.getCookie('userName')}</span>
        </div>
        {/* <FontAwesomeIcon icon='fa-solid fa-house' /> */}
        <Menu
          className={cx('admin-menu')}
          theme='dark'
          defaultSelectedKeys={['dashboard']}
          mode='inline'
          onClick={handleOnClickMenuItem}
          items={menuItems}
        />
      </Sider>
      <Layout className='site-layout'>
        {/* <Header
                    className='site-layout-background'
                    style={{
                        padding: 0,
                    }}
                /> */}
        <Content
          style={{
            margin: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div className={cx('content-header')}>
            <Breadcrumb>
              {breadcrumbValues.map((item) => {
                return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>;
              })}
            </Breadcrumb>
            <Button
              className={cx('btn-logout')}
              // type='text'
              // icon={<LogoutOutlined />}
              onClick={() => {
                commonFunc.deleteAllCookies();
                navigate(routes.login);
              }}
            >
              Logout
            </Button>
          </div>

          <div
            className='site-layout-background'
            style={{
              flex: 1,
              marginBottom: 16,
              padding: 16,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;

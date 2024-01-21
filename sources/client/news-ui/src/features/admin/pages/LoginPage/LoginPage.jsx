import { Button, Card, Form, Input } from 'antd';
import userApi from 'apis/user';
import classNames from 'classnames/bind';
import routes from 'config/configRoutes';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import { openNotification } from 'helpers/notification';
import { NotificationType } from 'common/enum';
import convertHelper from 'helpers/convertHelper';
import { useEffect } from 'react';
import commonFunc from 'common/commonFunc';

const cx = classNames.bind(styles);

LoginPage.propTypes = {};

LoginPage.defaultProps = {};

function LoginPage(props) {
  const navigate = useNavigate();

  useEffect(() => {
    commonFunc.deleteAllCookies();
  }, []);

  const onFinish = async (values) => {
    await login(values);
  };

  const login = async (body) => {
    try {
      const res = await userApi.login(body);
      const token = res.Data;
      const stringUserInfor = token.split('.')[1];
      const userInfor = convertHelper.Deserialize(atob(stringUserInfor));
      document.cookie = `token=${res.Data}`;
      document.cookie = `role=${userInfor['Role']}`;
      document.cookie = `userName=${userInfor['UserName']}`;
      navigate(routes.admin);
    } catch (err) {
      openNotification('Đăng nhập thất bại', '', NotificationType.ERROR);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={cx('login')}>
      <div className={cx('container')}>
        <Card title='Đăng nhập' style={{ width: 500 }}>
          <Form
            name='login'
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >
            <Form.Item
              label='Tên đăng nhập'
              name='Username'
              rules={[
                {
                  required: true,
                  message: 'Không được để trống!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Mật khẩu'
              name='Password'
              rules={[
                {
                  required: true,
                  message: 'Không được để trống!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* <Form.Item
                            name='remember'
                            valuePropName='checked'
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item> */}

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type='primary' htmlType='submit'>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;

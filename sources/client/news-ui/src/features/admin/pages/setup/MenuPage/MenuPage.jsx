import {
  CheckOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileAddFilled,
  InfoCircleOutlined,
  LineOutlined,
} from '@ant-design/icons';
import {
  Tree,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Checkbox,
  Row,
  Col,
} from 'antd';
import setupApi from 'apis/setupApi';
import classNames from 'classnames/bind';
import commonFunc from 'common/commonFunc';
import { NotificationType, Direction } from 'common/enum';
import { openNotification } from 'helpers/notification';
import { useEffect, useRef, useState } from 'react';
import styles from './MenuPage.module.scss';
import MenuSearch from './MenuSearch/MenuSearch';
import { Option } from 'antd/lib/mentions';
import { TypeUpdate, Role, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import Loading from 'components/Loading/Loading';
const { DirectoryTree } = Tree;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const cx = classNames.bind(styles);

MenuPage.propTypes = {};

MenuPage.defaultProps = {};
const filterAll = {
  currentPage: 1,
  pageSize: 9_999_999,
  direction: Direction.DESC,
  orderBy: DEFAULT_COLUMN_ORDER_BY,
};

const Mode = {
  Create: 1,
  Edit: 0,
};

function MenuPage(props) {
  const [displayIcon, setDisplayIcon] = useState([]);
  const [dataTree, setDataTree] = useState([]);
  const isFirstCall = useRef(true);
  const dataResource = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const mode = useRef(Mode.Create);
  const idEdit = useRef(-1);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const detail = useRef({});
  const [confirmLoading, setConfirmLoading] = useState(true);

  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      // return;
    }
    getMenuAll();
  }, []);

  const getMenuAll = async () => {
    try {
      setConfirmLoading(true);
      const res = await setupApi.getMenuAll(filterAll);
      dataResource.current = res?.PagedData?.Results ?? [];
      setDataTree(res?.PagedData?.Results ?? []);
    } catch (err) {
      openNotification('Tạo mới tin thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  function handleClickNode(id) {
    const _displayIcon = [];
    _displayIcon[id] = !displayIcon[id];
    setDisplayIcon(_displayIcon);
  }

  async function editMenu(id) {
    setConfirmLoading(true);
    const res = await setupApi.getMenuById(id);
    setConfirmLoading(false);
    if (res?.Status) {
      openNotification(
        <>
          <b>Hủy duyệt</b> để có thể chỉnh sửa
        </>,
        '',
        NotificationType.ERROR
      );

      return;
    }
    idEdit.current = id;
    mode.current = Mode.Edit;
    form?.setFieldsValue({
      title: res?.Title,
      parentId: res?.ParentId || null,
      order: res?.Order,
      url: res?.Url,
      urlAdmin: res?.UrlAdmin,
      urlChildren: res?.UrlChildren,
      isOpenNewTab: res?.IsOpenNewTab,
      isPublish: res?.IsPublish,
    });

    setIsModalOpen(true);
  }

  async function displayMenu(id, status) {
    const role = commonFunc.getCookie('role');
    if (role !== Role.ADMIN) {
      openNotification(
        <>
          Chỉ có <b>ADMIN</b> mới thực hiện được hành động này
        </>,
        '',
        NotificationType.ERROR
      );

      return;
    }
    Modal.confirm({
      title: 'Cập nhật trạng thái',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          Bạn có chắc chắn <b>DUYỆT/HỦY DUYỆT</b> không?
        </>
      ),
      okText: 'Cập nhật',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setConfirmLoading(true);
          await setupApi.updateStatusMenu({
            Ids: [id],
            Value: status === 0 ? 1 : 0,
            Field: TypeUpdate.STATUS,
          });
          getMenuAll();
          openNotification('Cập nhật thành công');
        } catch (error) {
          openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  }

  async function deleteMenu(id, status) {
    if (status) {
      openNotification(
        <>
          <b>Hủy duyệt</b> trước khi xóa
        </>,
        '',
        NotificationType.ERROR
      );
      return;
    }
    return Modal.confirm({
      title: 'Xóa menu',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn xóa không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setConfirmLoading(true);
          await setupApi.deleteMenu(id);
          openNotification('Xóa thành công');
          getMenuAll();
        } catch (error) {
          openNotification('Xóa thất bại', '', NotificationType.ERROR);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  }

  async function handleShowDetail(Id) {
    setConfirmLoading(true);
    const res = await setupApi.getMenuById(Id);
    setConfirmLoading(false);
    detail.current = res;
    setIsShowDetail(true);
  }

  const Title = (props) => {
    const { record } = props;
    const { Title, Id, Status } = record;
    return (
      <div onClick={() => handleClickNode(Id)} style={{ display: 'flex' }}>
        <div
          title={Title}
          style={{
            textDecoration: Status ? 'none' : 'line-through',
            fontStyle: Status ? 'normal' : 'italic',
          }}
        >
          {Title}
        </div>
        <div style={{ display: displayIcon[Id] ? 'block' : 'none' }}>
          <InfoCircleOutlined
            title='Chi tiết'
            style={{ margin: '0 10px', padding: 4, cursor: 'pointer' }}
            onClick={() => handleShowDetail(Id)}
          />
          <EditOutlined
            title='Sửa menu'
            style={{ margin: '0 10px', padding: 4, cursor: 'pointer' }}
            onClick={() => editMenu(Id)}
          />
          <CheckSquareOutlined
            title={Status ? 'Hủy duyệt' : 'Duyệt'}
            style={{
              margin: '0 10px',
              padding: 4,
              cursor: 'pointer',
              color: Status ? '#f81d22' : '#008000',
            }}
            onClick={() => displayMenu(Id, Status)}
          />
          <CloseOutlined
            title='Xóa menu'
            style={{ margin: '0 10px', padding: 4, cursor: 'pointer' }}
            onClick={() => deleteMenu(Id, Status)}
          />
        </div>
      </div>
    );
  };

  const handleChangeView = (id) => {
    if (!id) {
      setDataTree(dataResource.current);
      return;
    }
    const dataFilter = dataResource.current.filter(
      (x) => x.Id === id || x.ParentId === id
    );
    setDataTree(dataFilter);
  };

  const renderOption = (
    <Select
      placeholder='Chọn cấp cha'
      style={{ width: '100%' }}
      allowClear={true}
    >
      {dataResource.current
        .filter((x) => x.ParentId === 0)
        .map((x) => (
          <Option value={x.Id} key={x.Id}>
            {x.Title}
          </Option>
        ))}
    </Select>
  );
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    values.parentId = parseInt(values?.parentId || 0);
    values.url = (values?.url || '').trim();
    values.order = parseInt(values?.order ?? 0);
    if (mode.current === Mode.Create) {
      insertCategoryNews(values);
    } else {
      updateCategoryNews(values);
    }

    form.resetFields();
  };

  /**
   * Gọi api lấy dữ liệu danh sách nguồi tin tức
   */
  const insertCategoryNews = async (values) => {
    try {
      setConfirmLoading(true);
      await setupApi.insertMenu(values);
      setIsModalOpen(false);
      getMenuAll();
      openNotification('Tạo mới danh mục thành công');
    } catch (error) {
      openNotification('Tạo mới danh mục thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  /**
   * Gọi api lấy dữ liệu danh sách nguồi tin tức
   */
  const updateCategoryNews = async (values) => {
    try {
      setConfirmLoading(true);
      await setupApi.updateMenu(idEdit.current, values);
      setIsModalOpen(false);
      getMenuAll();
      openNotification('Cập nhật menu thành công');
    } catch (error) {
      openNotification('Cập nhật menu thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const showModal = () => {
    mode.current = Mode.Create;
    form?.setFieldsValue({});
    setIsModalOpen(true);
  };
  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />

      {
        //#region popup thêm mới
      }
      <Modal
        className={cx('modal-category-news')}
        title='Thêm mới danh mục tin'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name='control-hooks'
          onFinish={onFinish}
          initialValues={{
            isOpenNewTab: false,
            isPublish: false,
          }}
        >
          <Form.Item
            name='title'
            label='Tiêu đề'
            rules={[{ required: true, message: 'Tiêu đề không được để trống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='parentId' label='Danh mục cấp cha'>
            {renderOption}
          </Form.Item>
          <Form.Item name='order' label='Số thứ tự'>
            <Input type='number' min={0} defaultValue={0} />
          </Form.Item>
          <Form.Item name='url' label='Địa chỉ (Url)'>
            <Input />
          </Form.Item>
          {/*           
          <Form.Item name='urlAdmin' label='UrlList quản trị'>
            <Input />
          </Form.Item>
          <Form.Item name='urlChildren' label='Menu con '>
            <Input />
          </Form.Item>
          <Form.Item
            name='isOpenNewTab'
            label='Mở trang mới'
            valuePropName='checked'
          >
            <Checkbox />
          </Form.Item>
          <Form.Item name='isPublish' label='Xuất bản' valuePropName='checked'>
            <Checkbox />
          </Form.Item> */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type='primary'
              htmlType={mode.current === Mode.Edit ? 'Sửa' : 'Tạo mới'}
            >
              {mode.current === Mode.Edit ? 'Sửa' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {
        //#endregion
      }

      <div className={cx('top')}>
        <MenuSearch
          dataMenu={dataResource.current}
          changeParent={handleChangeView}
        />
        <div className={cx('btn-add-source-news')}>
          <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
            Thêm mới
          </Button>
        </div>
      </div>
      <div className={cx('title')}>Cổng thông tin điện tử tỉnh</div>
      <Tree
        showLine
        defaultExpandAll={true}
        treeData={commonFunc.list_to_tree(dataTree)}
        titleRender={(nodeData) => {
          return <Title record={nodeData} />;
        }}
      />

      <Modal
        open={isShowDetail}
        title='Hiển thị thông tin'
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        cancelText='Thoát'
        onCancel={() => {
          setIsShowDetail(false);
        }}
      >
        <Row gutter={8}>
          <Col span={16}>
            <Row gutter={16} className={cx('row-item')}>
              <Col span={10}>
                <div className={cx('row-item-label')}>Tiêu đề</div>
              </Col>
              <Col span={14}>
                <div>{detail.current?.Title}</div>
              </Col>
            </Row>

            <Row gutter={16} className={cx('row-item')}>
              <Col span={10}>
                <div className={cx('row-item-label')}>Danh mục cấp cha</div>
              </Col>
              <Col span={14}>
                <div>
                  {dataResource.current.find(
                    (x) => x.Id === detail.current?.ParentId
                  )?.Title ?? ''}
                </div>
              </Col>
            </Row>

            <Row gutter={16} className={cx('row-item')}>
              <Col span={10}>
                <div className={cx('row-item-label')}>Số thứ tự</div>
              </Col>
              <Col span={14}>
                <div>{detail.current?.Order}</div>
              </Col>
            </Row>

            <Row gutter={16} className={cx('row-item')}>
              <Col span={10}>
                <div className={cx('row-item-label')}>Địa chỉ (Url)</div>
              </Col>
              <Col span={14}>
                <div>{detail.current?.Url}</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default MenuPage;

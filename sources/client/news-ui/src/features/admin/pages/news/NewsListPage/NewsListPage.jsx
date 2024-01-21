import { Divider } from 'antd';
import newsApi from 'apis/newsApi';
import classNames from 'classnames/bind';
import { Direction, NotificationType } from 'common/enum';
import { openNotification } from 'helpers/notification';
import { useEffect, useRef, useState } from 'react';
import CollectionNewsDetail from './CollectionNewsDetail/CollectionNewsDetail';
import CollectionNewsEditor from './CollectionNewsEditor/CollectionNewsEditor';
import NewsListMenuSearch from './NewsListMenuSearch/NewsListMenuSearch';
import styles from './NewsListPage.module.scss';
import NewsListTableData from './NewsListTableData/NewsListTableData';
import convertHelper from 'helpers/convertHelper';
import { useNavigate } from 'react-router-dom';
import routes from 'config/configRoutes';
import { TypeUpdate, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import PopupUpdateNews from '../PopupUpdateNews/PopupUpdateNews';
import Loading from 'components/Loading/Loading';

const cx = classNames.bind(styles);

NewsListPage.propTypes = {};

NewsListPage.defaultProps = {};

const filterAll = {
  currentPage: 1,
  pageSize: 9_999_999,
  direction: Direction.DESC,
  orderBy: DEFAULT_COLUMN_ORDER_BY,
};

function NewsListPage(props) {
  const [newsData, setNewsData] = useState({});
  const [objFilter, setObjFilter] = useState({
    currentPage: 1,
    pageSize: 10,
    direction: Direction.DESC,
    orderBy: DEFAULT_COLUMN_ORDER_BY,
    keyword: '',
  });
  const isFirstCall = useRef(true);
  const [popupEditNews, setPopupEditNews] = useState({
    Id: null,
    show: false,
  });
  const [openCollectionEditor, setOpenCollectionEditor] = useState(false);
  const [openCollectionNewsDetail, setOpenCollectionNewsDetail] =
    useState(false);
  const [confirmLoading, setConfirmLoading] = useState(true);
  const dataFilter = useRef({
    categoryNews: [],
    fieldNews: [],
    sourceNews: [],
    collaborators: [],
  });

  const dataDetail = useRef({});
  const action = useRef('create');
  const navigate = useNavigate();

  const onCreate = async (values) => {
    try {
      setConfirmLoading(true);
      var formData = new FormData();
      formData.append('JsonString', convertHelper.Serialize(values.JsonString));
      if (values.Avatar) {
        formData.append('Avatar', values.Avatar);
      }
      if (values.FileAttachment) {
        formData.append('FileAttachment', values.FileAttachment);
      }
      setOpenCollectionEditor(false);
      await newsApi.insertNew(formData);
      openNotification('Tạo mới tin thành công');
      fetchList();
    } catch (error) {
      openNotification('Tạo mới tin thất bại', '', NotificationType.ERROR);
    }
  };

  const handleOnClickShowRowDetail = async (values) => {
    setConfirmLoading(true);
    const detailRow = await fetchItem(values);
    if (!detailRow) {
      return;
    }
    dataDetail.current = detailRow;
    setConfirmLoading(false);
    setOpenCollectionNewsDetail(true);
  };

  const handleOnClickEditOneRow = async (values) => {
    setConfirmLoading(true);
    const detailRow = await fetchItem(values);
    if (!detailRow) {
      return;
    }
    dataDetail.current = detailRow;
    setConfirmLoading(false);
    setOpenCollectionEditor(true);
  };

  const fetchItem = async (values) => {
    setConfirmLoading(true);

    try {
      return await newsApi.getNewsById(values?.Id);
    } catch (error) {
      openNotification('Lấy dữ liệu thất bại', '', NotificationType.ERROR);
      return null;
    }
  };

  const fetchList = async () => {
    try {
      setConfirmLoading(true);
      const response = await newsApi.getNewsAll(objFilter);
      setNewsData({
        data: response?.PagedData?.Results ?? [],
        total: response?.PagedData?.RowCount ?? 0,
      });
      setConfirmLoading(false);
    } catch (error) {
      openNotification('Lấy danh sách thất bại', '', NotificationType.ERROR);
    }
  };

  /**
   * Thay đổi phân trang
   */
  const handleChangePagination = (
    currentPage,
    pageSize,
    orderBy,
    direction
  ) => {
    setObjFilter({ ...objFilter, currentPage, pageSize, orderBy, direction });
  };
  /**
   * Sử lý thay đổi text search
   * @param {*} textSearch Từ cần tìm
   */
  const handleChangeFilterNews = (filterNews) => {
    if (!filterNews?.fromDate) {
      delete objFilter.fromDate;
    }
    if (!filterNews?.toDate) {
      delete objFilter.toDate;
    }

    setObjFilter({ ...objFilter, ...filterNews });
  };

  /**
   * Thay đổi bộ lọc thì gọi lại danh sách
   */
  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      getDataFilter();
    }
    fetchList();
  }, [objFilter]);

  const getDataFilter = async () => {
    const responseCategoryNews = newsApi.getNewsCategoryAll(filterAll);
    const responseFieldNews = newsApi.getNewsFieldAll(filterAll);
    const responseSourceNews = newsApi.getNewsSourceAll(filterAll);
    const responseCollaborators = newsApi.getNewsCollaboratorsAll(filterAll);

    Promise.all([
      responseCategoryNews,
      responseFieldNews,
      responseSourceNews,
      responseCollaborators,
    ]).then((values) => {
      dataFilter.current = {
        categoryNews: values[0]?.PagedData?.Results ?? [],
        fieldNews: values[1]?.PagedData?.Results ?? [],
        sourceNews: values[2]?.PagedData?.Results ?? [],
        collaborators: values[3]?.PagedData?.Results ?? [],
      };
    });
  };

  const handleSetActionForm = (value) => {
    action.current = value;
  };

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await newsApi.updatNews({
        Ids: [values.Id],
        Value: values.Status === 0 ? 1 : 0,
        Field: TypeUpdate.STATUS,
      });
      fetchList();
      openNotification('Cập nhật thành công');
    } catch (error) {
      openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
    }
  };

  const handleDeleteSourceNew = async (id) => {
    try {
      setConfirmLoading(true);
      await newsApi.deleteHotNew(id);
      openNotification('Xóa tin nổi bật thành công');
      fetchList();
    } catch (error) {
      openNotification('Xóa tin nổi bật thất bại', '', NotificationType.ERROR);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />
      <div className={cx('top')}>
        <NewsListMenuSearch
          dataFilter={dataFilter.current}
          setOpenCollectionEditor={setOpenCollectionEditor}
          setActionForm={handleSetActionForm}
          setFilterNews={handleChangeFilterNews}
        />
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <NewsListTableData
          data={newsData}
          onClickShowRowDetail={handleOnClickShowRowDetail}
          setPagination={handleChangePagination}
          onClickEditOneRow={handleOnClickEditOneRow}
          setActionForm={handleSetActionForm}
          updateStatusNew={handleUpdateStatusNew}
          onClickEdit={(id) => {
            setPopupEditNews({
              Id: id,
              show: true,
            });
          }}
          deleteSourceNew={handleDeleteSourceNew}
        />
      </div>
      <CollectionNewsEditor
        dataFilter={dataFilter.current}
        action={action.current}
        data={dataDetail.current}
        open={openCollectionEditor}
        onCreate={onCreate}
        onCancel={() => {
          setOpenCollectionEditor(false);
        }}
      />
      <CollectionNewsDetail
        dataDetail={dataDetail.current}
        open={openCollectionNewsDetail}
        onCancel={() => {
          setOpenCollectionNewsDetail(false);
        }}
      />
      {(popupEditNews?.Id || popupEditNews?.Id === 0) && popupEditNews?.show ? (
        <PopupUpdateNews
          idNews={popupEditNews?.Id}
          onSuccess={() => {
            setPopupEditNews({
              Id: null,
              show: false,
            });
            fetchList();
          }}
          onCancel={() => {
            setPopupEditNews({
              Id: null,
              show: false,
            });
          }}
        />
      ) : null}
    </div>
  );
}

export default NewsListPage;

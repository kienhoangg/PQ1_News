import {
  MinusOutlined,
  PlusOutlined,
  PrinterOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Col, DatePicker, Row, Skeleton } from 'antd';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import classNames from 'classnames/bind';
import commonRender from 'common/commonRender';
import constant from 'common/constant';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import routes from 'config/configRoutes';
import FormVisitorComment from 'features/visitor/components/FormVisitorComment/FormVisitorComment';
import datetimeHelper from 'helpers/datetimeHelper';
import imageHelper from 'helpers/imageHelper';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FacebookIcon, FacebookShareButton } from 'react-share';
import styles from './PublishedNewsPostPage.module.scss';
import PublishedNewsPostPageCommentList from './PublishedNewsPostPageCommentList/PublishedNewsPostPageCommentList';

const cx = classNames.bind(styles);

PublishedDocumentPage.propTypes = {};

PublishedDocumentPage.defaultProps = {};

function PublishedDocumentPage(props) {
  let { id } = useParams();
  const [data, setData] = useState();
  const [fontSizeContainer, setFontSizeContainer] = useState(13);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState();
  const [resetCommentFields, setResetCommentFields] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [pagingIndexComment, setPagingIndexComment] = useState(1);
  const [dataComments, setDataComments] = useState([]);
  const [onResetDataComment, setOnResetDataComment] = useState(0);

  //Lấy dữ liệu chi tiết
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const params = { id };
        const response = await publishedNewsApi.getData(params);
        setData(response);
        setDateFilter(moment(response?.NewsPostDetail.PublishedDate));
      } catch (error) {
        console.log('Failed to fetch list: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, []);

  //Dữ liệu comment
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const body = {
          currentPage: pagingIndexComment,
          newsPostId: id,
          pageSize: 10,
        };
        const response = await publishedNewsApi.getDataComments(body);
        setDataComments(response?.PagedData);
      } catch (error) {
        console.log('Failed to fetch list: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, [pagingIndexComment, onResetDataComment]);

  function handleOnChangeIndexPaging(index) {
    setPagingIndexComment(index);
  }

  function handleChangeFontSize(value) {
    setFontSizeContainer(fontSizeContainer + value);
  }

  function handleOnChangeDateFilter(date, dateString) {
    setDateFilter(date);
  }

  function onFinishComment(params) {
    const fetchSubmitComment = async (params) => {
      try {
        const { comment, name } = params;
        let body = {
          username: name,
          content: comment,
          newsPostId: id,
        };

        await publishedNewsApi.postVisitorComment(body);
        setResetCommentFields(!resetCommentFields);
        setOnResetDataComment(onResetDataComment + 1);
        commonRender.showNotifySuccess('Bình luận thành công');
      } catch (error) {
        console.log('Failed to fetch list: ', error);
      } finally {
        setLoadingSubmit(false);
      }
    };
    setLoadingSubmit(true);
    fetchSubmitComment(params);
  }

  return (
    <div className={cx('wrapper')}>
      <ScrollToTop />
      <Skeleton loading={loading} active>
        <div className={cx('menu-items')}>
          <Breadcrumb>
            {data?.CategoryParentNews?.Id && (
              <Breadcrumb.Item>
                <Link to={routes.publishedNewsPostFieldList}>
                  {data?.CategoryParentNews?.CategoryNewsName}
                </Link>
              </Breadcrumb.Item>
            )}

            <Breadcrumb.Item>
              <Link
                to={commonRender.renderLinkNewsCategoryDetail(
                  data?.NewsPostDetail?.CategoryNews?.Id
                )}
              >
                {data?.NewsPostDetail?.CategoryNews?.CategoryNewsName}
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={cx('menu-divider')}></div>
        </div>
        <div className={cx('document-container')}>
          {data && (
            <>
              <h3 className={cx('title')}>{data?.NewsPostDetail.Title}</h3>

              <div className={cx('info-extension')}>
                <Row gutter={8} justify='space-between'>
                  <Col>
                    <div className={cx('align-center')}>
                      {datetimeHelper.formatDatetimeToDateVN(
                        data?.NewsPostDetail.LastModifiedDate
                      )}
                    </div>
                  </Col>
                  <Col flex={1}>
                    <Row justify='end' align='middle'>
                      <div className={cx('font-size')}>
                        <div>Xem cỡ chữ</div>
                        <Button
                          icon={<MinusOutlined />}
                          size='small'
                          onClick={() => handleChangeFontSize(-1)}
                        ></Button>
                        <Button
                          icon={<PlusOutlined />}
                          size='small'
                          onClick={() => handleChangeFontSize(1)}
                        ></Button>
                      </div>
                      <div className={cx('print')}>
                        <Button
                          size='small'
                          icon={<PrinterOutlined />}
                          onClick={() => {
                            const url =
                              commonRender.renderLinkNewsDetailPrint(id);
                            window.open(url, '_blank');
                          }}
                        >
                          In trang
                        </Button>
                        <Button
                          size='small'
                          icon={<SoundOutlined />}
                          onClick={() => {
                            commonRender.showNotifyTodo();
                          }}
                        >
                          Đọc bài viết
                        </Button>
                      </div>
                      <div className={cx('share')}>
                        <FacebookShareButton
                          url={window.location.href}
                          // quote={'フェイスブックはタイトルが付けれるようです'}
                          // hashtag={'#hashtag'}
                          // description={'aiueo'}
                          // className='Demo__some-network__share-button'
                        >
                          <FacebookIcon size={24} />
                        </FacebookShareButton>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </div>

              <h3
                style={{ fontSize: fontSizeContainer }}
                className={cx('description')}
              >
                {data?.NewsPostDetail.Description}
              </h3>
              <div className={cx('avatar-content')}>
                <img
                  src={imageHelper.getLinkImageUrl(data?.NewsPostDetail.Avatar)}
                  alt=''
                  width={'80%'}
                />
                <div className={cx('avatar-title')}>
                  {data?.NewsPostDetail.AvatarTitle}
                </div>
              </div>

              <div className={cx('content')}></div>
              <div style={{ display: 'block' }}>
                <div
                  style={{ fontSize: fontSizeContainer }}
                  dangerouslySetInnerHTML={{
                    __html: data?.NewsPostDetail.Content,
                  }}
                ></div>
              </div>
              <div className={cx('collaborator')}>
                {data?.NewsPostDetail?.Collaborator?.Name}
              </div>

              {/* TODO: Lượt xem chi tiết bài viết */}
              {/* <Row className={cx('content-footer')} justify='space-between'>
                            <Col>{605} Lượt xem</Col>
                            <Col>{data?.NewsPostDetail?.SourceName}</Col>
                        </Row> */}
            </>
          )}
        </div>
      </Skeleton>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className={cx('comment')}>
          <div className={cx('comment-title')}>
            Ý kiến bạn đọc{' '}
            <span>({dataComments ? dataComments.RowCount : 0})</span>
          </div>
          <div className={cx('comment-list')}>
            {dataComments && (
              <>
                <PublishedNewsPostPageCommentList
                  data={dataComments.Results}
                  pagingIndex={dataComments.CurrentPage}
                  total={dataComments.RowCount}
                  onChangeIndexPaging={handleOnChangeIndexPaging}
                />
              </>
            )}
          </div>
          <div className={cx('divider')}></div>
          <FormVisitorComment
            onFinish={onFinishComment}
            resetFields={resetCommentFields}
            submitLoading={loadingSubmit}
          />
        </div>

        <Skeleton loading={loading} active>
          <div className={cx('document-relative')}>
            <div className={cx('document-relative-label')}>Các bài khác</div>
            <div className={cx('document-relative-divider')}></div>

            {data?.NewsRelatives &&
              data?.NewsRelatives.map((item) => {
                return (
                  <div key={item.Id} className={cx('document-relative-item')}>
                    <div className={cx('document-relative-icon')}></div>
                    <Link
                      reloadDocument
                      to={commonRender.renderLinkNewsDetail(item.Id)}
                    >
                      {item.Title}
                    </Link>
                    <span className={cx('document-relative-date')}>
                      {datetimeHelper.formatDateToDateVN(item.PublishedDate)}
                    </span>
                  </div>
                );
              })}
          </div>
          <div className={cx('divider')}></div>
          <Row align='end'>
            <Col>
              <Link
                to={commonRender.renderLinkNewsCategory(
                  data?.CategoryParentNews?.Id
                )}
              >
                Xem thêm >>
              </Link>
            </Col>
          </Row>
          <Row align='end' style={{ marginTop: 8 }}>
            <Col>
              {dateFilter && (
                <DatePicker
                  defaultValue={dateFilter}
                  format={constant.DATE_FORMAT_VN}
                  onChange={handleOnChangeDateFilter}
                />
              )}
              <Button style={{ marginLeft: 8 }}>
                <Link
                  to={commonRender.renderLinkNewsField(
                    data?.CategoryParentNews?.Id,
                    dateFilter
                  )}
                >
                  Xem
                </Link>
              </Button>
            </Col>
          </Row>
        </Skeleton>
      </div>
    </div>
  );
}

export default PublishedDocumentPage;

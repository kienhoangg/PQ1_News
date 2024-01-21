import { CloudDownloadOutlined, MinusOutlined, PlusOutlined, PrinterOutlined, SoundOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Divider, Row, Skeleton } from 'antd';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import classNames from 'classnames/bind';
import commonFunc from 'common/commonFunc';
import commonRender from 'common/commonRender';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import datetimeHelper from 'helpers/datetimeHelper';
import imageHelper from 'helpers/imageHelper';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FacebookIcon, FacebookShareButton } from 'react-share';
import styles from './PublishedPublicInformationDetailPage.module.scss';

const cx = classNames.bind(styles);

PublishedPublicInformationDetailPage.propTypes = {};

PublishedPublicInformationDetailPage.defaultProps = {};

function PublishedPublicInformationDetailPage(props) {
    let { id } = useParams();
    const [data, setData] = useState();
    const [fontSizeContainer, setFontSizeContainer] = useState(13);
    const [loading, setLoading] = useState(true);

    //Lấy dữ liệu chi tiết
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await publishedNewsApi.getDataPublicInformationCategoriesDetailPage(id);
                setData(response);
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, []);

    function handleChangeFontSize(value) {
        setFontSizeContainer(fontSizeContainer + value);
    }

    return (
        <div className={cx('wrapper')}>
            <ScrollToTop />
            <Skeleton loading={loading} active>
                {data ? (
                    <>
                        <div className={cx('menu-items')}>
                            <div className={cx('title-container')}>
                                <Link to={commonRender.renderLinkPublishedPublicInformationListPage(data?.PublicInformationCategory?.Id)} className={cx('title')}>
                                    {data?.PublicInformationCategory?.Title}
                                </Link>
                                <span className={cx('right')}></span>
                            </div>
                            <div style={{ border: '1px solid #0066b3', marginBottom: 8 }}></div>
                        </div>
                        <div className={cx('document-container')}>
                            {data && (
                                <>
                                    <h3 className={cx('title')}>{data?.Title}</h3>
                                    <div className={cx('time')}>{datetimeHelper.formatDatetimeToDateVN(data?.LastModifiedDate)}</div>

                                    <div className={cx('content')}></div>
                                    <div style={{ display: 'block' }}>
                                        <div
                                            style={{ fontSize: fontSizeContainer }}
                                            dangerouslySetInnerHTML={{
                                                __html: data?.Content,
                                            }}
                                        ></div>
                                    </div>
                                </>
                            )}
                        </div>
                        <Divider></Divider>
                        {data?.FileAttachment && data.FileAttachment !== '' && (
                            <>
                                {data.FileAttachment.split(';;').map((item, index) => {
                                    return (
                                        <>
                                            <div className={cx('file')}>
                                                <div className={cx('file-item')}>
                                                    <a href={imageHelper.getLinkImageUrl(item)} target={'_blank'} rel='noreferrer' download={true}>
                                                        <CloudDownloadOutlined style={{ marginRight: 4 }} />
                                                        <span>{commonFunc.getNameFileByPath(item)}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <h3>Không có thông tin</h3>
                    </>
                )}
            </Skeleton>
        </div>
    );
}

export default PublishedPublicInformationDetailPage;

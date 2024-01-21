import { Skeleton } from 'antd';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import classNames from 'classnames/bind';
import imageHelper from 'helpers/imageHelper';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PublishedNewsPostPrintPage.module.scss';

const cx = classNames.bind(styles);

PublishedDocumentPrintPage.propTypes = {};

PublishedDocumentPrintPage.defaultProps = {};

function PublishedDocumentPrintPage(props) {
    let { id } = useParams();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    //Lấy dữ liệu chi tiết
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const params = { id };

                const response = await publishedNewsApi.getData(params);
                setData(response);
                if (response) {
                    setTimeout(() => {
                        window.print();
                    }, 1500);
                }
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Skeleton loading={loading} active>
                <div className={cx('document-container')}>
                    {data && (
                        <>
                            <h3 className={cx('title')}>{data?.NewsPostDetail.Title}</h3>
                            <h3 style={{ fontSize: 13 }} className={cx('description')}>
                                {data?.NewsPostDetail.Description}
                            </h3>
                            <div className={cx('avatar-content')}>
                                <img src={imageHelper.getLinkImageUrl(data?.NewsPostDetail.Avatar)} alt='' width={'80%'} />
                                <div className={cx('avatar-title')}>{data?.NewsPostDetail.AvatarTitle}</div>
                            </div>

                            <div className={cx('content')}></div>
                            <div style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: data?.NewsPostDetail.Content }}></div>
                        </>
                    )}
                </div>
            </Skeleton>
        </div>
    );
}

export default PublishedDocumentPrintPage;

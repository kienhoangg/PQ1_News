import { Pagination, Skeleton } from 'antd';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import classNames from 'classnames/bind';
import commonRender, { commonRenderTable } from 'common/commonRender';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublishedNewsListCategoryPageItem from '../PublishedNewsFieldListPage/PublishedNewsListCategoryPageItem/PublishedNewsListCategoryPageItem';
import styles from './PublishedNewsCategoryDetailPage.module.scss';

const cx = classNames.bind(styles);

function PublishedNewsCategoryDetailPage() {
    let { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [dataPageFullPage, setDataPageFullPage] = useState();
    const dataPage = useRef(null);
    const dataTotal = useRef(1);

    const [pagingIndex, setPagingIndex] = useState(1);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const params = { currentPage: pagingIndex, id: id };
                const response = await publishedNewsApi.getCategoryDetailDataPage(params);
                setDataPageFullPage(response?.PagedData.Results);
                if (Array.isArray(response?.PagedData?.Results) && response.PagedData.Results.length > 0) {
                    dataPage.current = response.PagedData.Results[0].CategoryNews;
                    dataTotal.current = response?.PagedData.RowCount;
                }
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHome();
    }, [pagingIndex]);

    function handleOnChangeIndexPaging(params) {
        setPagingIndex(params);
    }

    return (
        <div className={cx('wrapper')}>
            <ScrollToTop />
            <Skeleton loading={loading} active>
                <>
                    {dataPage.current && (
                        <>
                            <div key={dataPage.current?.Id} className={cx('category-container')}>
                                <div className={cx('title-container')}>
                                    <Link to={commonRender.renderLinkNewsCategoryDetail(dataPage.current?.Id)} className={cx('title')}>
                                        {dataPage.current?.CategoryNewsName}
                                    </Link>
                                    <span className={cx('right')}></span>
                                </div>
                                <div style={{ border: '1px solid #0066b3', marginLeft: 8 }}></div>

                                {Array.isArray(dataPageFullPage) &&
                                    dataPageFullPage.map((dataItem, index) => {
                                        return (
                                            <div key={index}>
                                                <PublishedNewsListCategoryPageItem data={dataItem} isFirst={true} />
                                                <div className={cx('divider')}></div>
                                            </div>
                                        );
                                    })}
                                <Pagination
                                    className={cx('paging')}
                                    defaultCurrent={pagingIndex}
                                    total={dataTotal.current}
                                    showTotal={() => commonRenderTable.showTableTotalPagination(dataTotal.current ?? 0)}
                                    onChange={handleOnChangeIndexPaging}
                                    pageSizeOptions={[]}
                                    showSizeChanger={false}
                                />
                            </div>
                        </>
                    )}
                </>
            </Skeleton>
        </div>
    );
}

export default PublishedNewsCategoryDetailPage;

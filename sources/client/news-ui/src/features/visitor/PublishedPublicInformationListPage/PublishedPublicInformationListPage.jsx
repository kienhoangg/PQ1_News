import { Pagination, Skeleton } from 'antd';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import classNames from 'classnames/bind';
import commonRender, { commonRenderTable } from 'common/commonRender';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublishedPublicInformationPageItem from '../PublishedPublicInformationPage/PublishedPublicInformationPageItem/PublishedPublicInformationPageItem';
import styles from './PublishedPublicInformationListPage.module.scss';

const cx = classNames.bind(styles);

PublishedPublicInformationListPage.propTypes = {};

PublishedPublicInformationListPage.defaultProps = {};

function PublishedPublicInformationListPage(props) {
    let { id } = useParams();
    const [dataPage, setDataPage] = useState();
    const [loading, setLoading] = useState(true);

    const [pagingIndex, setPagingIndex] = useState(1);

    //Dữ liệu thông tin công khai
    useEffect(() => {
        const fetchHome = async () => {
            try {
                const params = {
                    publicInformationCategoryId: id,
                    currentPage: pagingIndex,
                    pageSize: 10,
                };
                const response = await publishedNewsApi.getDataPublicInformationCategoriesListPage(params);
                setDataPage(response?.PagedData);
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
                    <div className={cx('category-container')}>
                        <div className={cx('title-container')}>
                            {Array.isArray(dataPage?.Results) && dataPage?.Results.length > 0 && (
                                <>
                                    <Link to={commonRender.renderLinkPublishedPublicInformationListPage(dataPage?.Results[0].PublicInformationCategory.Id)} className={cx('title')}>
                                        {dataPage?.Results[0].PublicInformationCategory.Title}
                                    </Link>
                                    <span className={cx('right')}></span>
                                </>
                            )}
                        </div>
                        <div style={{ border: '1px solid #0066b3', marginLeft: 8, marginBottom: 8 }}></div>

                        {Array.isArray(dataPage?.Results) &&
                            dataPage.Results.map((dataItem, index) => {
                                dataItem.Description = '';
                                dataItem.Description = '';

                                return (
                                    <>
                                        <PublishedPublicInformationPageItem key={dataItem.Id} data={dataItem} isFirst={index === 0} />
                                        <div className={cx('divider')}></div>
                                    </>
                                );
                            })}

                        <Pagination
                            style={{ marginLeft: 8 }}
                            className={cx('paging')}
                            defaultCurrent={pagingIndex}
                            total={dataPage?.RowCount}
                            showTotal={() => commonRenderTable.showTableTotalPagination(dataPage?.RowCount ?? 0)}
                            onChange={handleOnChangeIndexPaging}
                            pageSizeOptions={[]}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            </Skeleton>
        </div>
    );
}

export default PublishedPublicInformationListPage;

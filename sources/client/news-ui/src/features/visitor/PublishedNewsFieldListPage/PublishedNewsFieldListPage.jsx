import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PublishedNewsFieldListPage.module.scss';
import classNames from 'classnames/bind';
import { Breadcrumb, Skeleton } from 'antd';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import { Link } from 'react-router-dom';
import commonRender from 'common/commonRender';
import PublishedNewsListCategoryPageItem from './PublishedNewsListCategoryPageItem/PublishedNewsListCategoryPageItem';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

const cx = classNames.bind(styles);

PublishedNewsFieldListPage.propTypes = {
    data: PropTypes.object,
};

PublishedNewsFieldListPage.defaultProps = {};

function PublishedNewsFieldListPage(props) {
    const [dataPage, setDataPage] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const params = {};
                const response = await publishedNewsApi.getFieldsDataListPage(params);
                setDataPage(response);
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHome();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <ScrollToTop />
            <Skeleton loading={loading} active>
                <>
                    {Array.isArray(dataPage) &&
                        dataPage.map((item) => {
                            return (
                                <div key={item.Id} className={cx('category-container')}>
                                    <div className={cx('title-container')}>
                                        <Link to={commonRender.renderLinkNewsCategory(item.Id)} className={cx('title')}>
                                            {item.Title}
                                        </Link>
                                        <span className={cx('right')}></span>
                                    </div>
                                    <div style={{ border: '1px solid #0066b3', marginLeft: 8, marginBottom: 8 }}></div>

                                    {Array.isArray(item?.NewsPosts) &&
                                        item.NewsPosts.map((dataItem, index) => {
                                            return (
                                                <>
                                                    <PublishedNewsListCategoryPageItem key={dataItem.Id} data={dataItem} isFirst={index === 0} />
                                                    <div className={cx('divider')}></div>
                                                </>
                                            );
                                        })}
                                </div>
                            );
                        })}
                </>
            </Skeleton>
        </div>
    );
}

export default PublishedNewsFieldListPage;

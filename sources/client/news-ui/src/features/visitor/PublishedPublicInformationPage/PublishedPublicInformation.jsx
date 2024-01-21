import { Skeleton } from 'antd';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import classNames from 'classnames/bind';
import commonRender from 'common/commonRender';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PublishedPublicInformation.module.scss';
import PublishedPublicInformationPageItem from './PublishedPublicInformationPageItem/PublishedPublicInformationPageItem';

const cx = classNames.bind(styles);

PublishedPublicInformation.propTypes = {
    data: PropTypes.object,
};

PublishedPublicInformation.defaultProps = {};

function PublishedPublicInformation(props) {
    const [dataPage, setDataPage] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const params = {};
                const response = await publishedNewsApi.getDataPublicInformationCategoriesPage(params);
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
                                        <Link to={commonRender.renderLinkPublishedPublicInformationListPage(item.Id)} className={cx('title')}>
                                            {item.Title}
                                        </Link>
                                        <span className={cx('right')}></span>
                                    </div>
                                    <div style={{ border: '1px solid #0066b3', marginLeft: 8, marginBottom: 8 }}></div>

                                    {Array.isArray(item?.PublicInformations) &&
                                        item.PublicInformations.map((dataItem, index) => {
                                            dataItem.Description = '';
                                            dataItem.Description = '';

                                            return (
                                                <>
                                                    <PublishedPublicInformationPageItem key={dataItem.Id} data={dataItem} isFirst={index === 0} />
                                                    <div className={cx('divider')}></div>
                                                </>
                                            );
                                        })}

                                    <Link to={commonRender.renderLinkPublishedPublicInformationListPage(item.Id)} className={cx('see-more')}>
                                        Xem thêm >>
                                    </Link>
                                </div>
                            );
                        })}
                </>
            </Skeleton>
        </div>
    );
}

export default PublishedPublicInformation;

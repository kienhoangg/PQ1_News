import { Divider } from 'antd';
import advertisementApi from 'apis/AdvertisementApi';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './AdvertisementCategoryPage.module.scss';
import AdvertisementCategoryPageSearch from './AdvertisementCategoryPageSearch/AdvertisementCategoryPageSearch';
import AdvertisementCategoryTableData from './AdvertisementCategoryTableData/AdvertisementCategoryTableData';

const cx = classNames.bind(styles);

AdvertisementCategoryPage.propTypes = {};

AdvertisementCategoryPage.defaultProps = {};

function AdvertisementCategoryPage(props) {
    const [newsData, setNewsData] = useState({});

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const params = {
                    _page: 1,
                    _limit: 10,
                };
                const response = await advertisementApi.getAdvertisementCategoryAll(params);
                setNewsData(response);
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            }
        };
        fetchProductList();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <AdvertisementCategoryPageSearch />
            </div>
            <Divider style={{ margin: '0' }} />
            <div className={cx('table-data')}>
                <AdvertisementCategoryTableData data={newsData} />
            </div>
        </div>
    );
}

export default AdvertisementCategoryPage;

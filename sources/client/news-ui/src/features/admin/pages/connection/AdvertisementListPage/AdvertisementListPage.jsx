import { Divider } from 'antd';
import advertisementApi from 'apis/advertisementApi';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './AdvertisementListPage.module.scss';
import AdvertisementListPageSearch from './AdvertisementListPageSearch/AdvertisementListPageSearch';
import AdvertisementListTableData from './AdvertisementListTableData/AdvertisementListTableData';

const cx = classNames.bind(styles);

AdvertisementListPage.propTypes = {};

AdvertisementListPage.defaultProps = {};

function AdvertisementListPage(props) {
    const [newsData, setNewsData] = useState({});

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const params = {
                    _page: 1,
                    _limit: 10,
                };
                const response = await advertisementApi.getAdvertisementAll(params);
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
                <AdvertisementListPageSearch />
            </div>
            <Divider style={{ margin: '0' }} />
            <div className={cx('table-data')}>
                <AdvertisementListTableData data={newsData} />
            </div>
        </div>
    );
}

export default AdvertisementListPage;

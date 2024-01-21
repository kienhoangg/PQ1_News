import homeApi from 'apis/published/homeApi';
import classNames from 'classnames/bind';
import FooterSection from 'features/Home/components/FooterSection/FooterSection';
import Banner from 'layouts/components/Banner/Banner';
import Navbar from 'layouts/components/Navbar/Navbar';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
import styles from './DefaultLayout.module.scss';
// import { addView } from 'features/Home/homeSlice';

const cx = classNames.bind(styles);

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

DefaultLayout.defaultProps = {};

function DefaultLayout({ children }) {
    const [layoutData, setLayoutData] = useState();
    const [loading, setLoading] = useState(true);
    const homeRedux = useSelector((state) => state.home);

    useEffect(() => {
        const fetchLayout = async () => {
            try {
                const params = {};
                const response = await homeApi.getLayoutData(params);
                setLayoutData(response);
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLayout();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {/* <div>Lượt view: {viewCount}</div> */}
                <Banner />
                <Navbar isLoading={loading} menuDatas={layoutData} />
                <div className={cx('content')}>{children}</div>
                <FooterSection isLoading={homeRedux.loading} visitorOnline={homeRedux?.view} />
            </div>
        </div>
    );
}

export default DefaultLayout;

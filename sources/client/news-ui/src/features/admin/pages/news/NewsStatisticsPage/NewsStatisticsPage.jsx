import React from 'react';
import PropTypes from 'prop-types';
import styles from './NewsStatisticsPage.module.scss';
import classNames from 'classnames/bind';
import NewsStatisticsPageMenuSearch from './NewsStatisticsPageMenuSearch/NewsStatisticsPageMenuSearch';

const cx = classNames.bind(styles);

NewsStatisticsPage.propTypes = {};

NewsStatisticsPage.defaultProps = {};

function NewsStatisticsPage(props) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <NewsStatisticsPageMenuSearch />
            </div>
        </div>
    );
}

export default NewsStatisticsPage;

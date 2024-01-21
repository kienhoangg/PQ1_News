import React from 'react';
import PropTypes from 'prop-types';
import styles from './SearchPageItem.module.scss';
import classNames from 'classnames/bind';
import { Col, Row } from 'antd';
import datetimeHelper from 'helpers/datetimeHelper';
import { Link } from 'react-router-dom';
import imageHelper from 'helpers/imageHelper';

const cx = classNames.bind(styles);

SearchPageItem.propTypes = {
    avatar: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    href: PropTypes.string,
};

SearchPageItem.defaultProps = {};

function SearchPageItem(props) {
    const { avatar, title, date, description, href } = props;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left')}>
                <img src={imageHelper.getLinkImageUrl(avatar)} alt='avatar' />
            </div>
            <div className={cx('right')}>
                <Link className={cx('title')} to={href}>
                    {title}
                </Link>
                <div className={cx('date')}>{datetimeHelper.formatDateToDateVN(date)}</div>
                <div className={cx('description')}>{description}</div>
            </div>
        </div>
    );
}

export default SearchPageItem;

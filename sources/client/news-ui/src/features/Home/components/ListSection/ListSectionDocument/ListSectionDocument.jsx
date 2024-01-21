import React from 'react';
import PropTypes from 'prop-types';
import styles from './ListSectionDocument.module.scss';
import classNames from 'classnames/bind';
import datetimeHelper from 'helpers/datetimeHelper';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

ListSectionDocument.propTypes = {
    title: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    href: PropTypes.string,
};

ListSectionDocument.defaultProps = {};

function ListSectionDocument(props) {
    const { title, date, description, href } = props;

    return (
        <Link className={cx('wrapper')} to={href}>
            <div className={cx('title')}>
                <div className={cx('icon-dot')}></div>
                <div className={cx('title-text')}>{title}</div>
                <div className={cx('title-date')}>{datetimeHelper.formatDateToDateVN(date)}</div>
            </div>
            <div className={cx('content')}>{description}</div>
        </Link>
    );
}

export default ListSectionDocument;

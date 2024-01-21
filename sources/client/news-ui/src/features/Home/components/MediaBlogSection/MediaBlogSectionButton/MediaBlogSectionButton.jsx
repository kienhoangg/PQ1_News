import React from 'react';
import PropTypes from 'prop-types';
import styles from './MediaBlogSectionButton.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import imageHelper from 'helpers/imageHelper';

const cx = classNames.bind(styles);

MediaBlogSectionButton.propTypes = {
    href: PropTypes.string,
    label: PropTypes.string,
    imageName: PropTypes.any,
    size: PropTypes.string,
};

MediaBlogSectionButton.defaultProps = {};

function MediaBlogSectionButton(props) {
    const { href, label, imageName, size } = props;

    return (
        <Link className={cx(`btn-wrapper`, size)} underline='none' to={href}>
            <img src={imageName} alt='' />
            <span>{label}</span>
        </Link>
    );
}

export default MediaBlogSectionButton;

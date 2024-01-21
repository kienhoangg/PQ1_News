import React from 'react';
import PropTypes from 'prop-types';
import styles from './Templates.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

Templates.propTypes = {};

Templates.defaultProps = {};

function Templates(props) {
    return <div className={cx('wrapper')}>Templates</div>;
}

export default Templates;

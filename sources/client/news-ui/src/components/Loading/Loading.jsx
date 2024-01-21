import React from 'react';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);
Loading.propTypes = {};

function Loading(props) {
  return (
    <>
      {props.show ? (
        <div className={cx('loading-wrapper')}>
          <div className={cx('loading')}>
            <LoadingOutlined className={cx('loading-spin')} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Loading;

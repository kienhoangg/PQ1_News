import classNames from 'classnames/bind';
import Images from 'common/images';
import styles from './Banner.module.scss';

const cx = classNames.bind(styles);

Banner.propTypes = {};

function Banner(props) {
    return (
        // <div className={cx('news-banner')} style={{ backgroundImage: `url(${Images.BANNER_BG})` }}>
        <div className={cx('news-banner')}>
            <img src={Images.BANNER_BG} alt='background' />
        </div>
    );
}

export default Banner;

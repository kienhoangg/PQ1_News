import classNames from 'classnames/bind';
import styles from './BlogSectionShortList.module.scss';
import BlogSectionShortListItem from './BlogSectionShortListItem/BlogSectionShortListItem';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

BlogSectionShortList.propTypes = {
    listData: PropTypes.array,
    onHover: PropTypes.func,
};

function BlogSectionShortList(props) {
    const { listData, onHover } = props;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('divider')}></div>
            <div className={cx('items')}>
                {Array.isArray(listData) &&
                    listData.map((item) => {
                        return <BlogSectionShortListItem onHover={onHover} data={item} key={item?.Id} />;
                    })}
            </div>
        </div>
    );
}

export default BlogSectionShortList;

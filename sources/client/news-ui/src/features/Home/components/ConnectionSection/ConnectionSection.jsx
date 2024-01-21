import { Skeleton } from 'antd';
import classNames from 'classnames/bind';
import imageHelper from 'helpers/imageHelper';
import PropTypes from 'prop-types';
import Marquee from 'react-easy-marquee';
import styles from './ConnectionSection.module.scss';

const cx = classNames.bind(styles);

ConnectionSection.propTypes = {
    isLoading: PropTypes.bool,
    connectionSites: PropTypes.array,
    connectionConcern: PropTypes.array,
};

ConnectionSection.defaultProps = {
    isLoading: true,
    connectionSites: [],
    connectionConcern: [],
};

const fakeConnectionWebsite = [
    {
        Id: 1,
        ImageUrl: '/content/images/connect1.png',
        Title: 'Trường đào tạo đại học',
        Link: 'https://google.com',
    },
    {
        Id: 2,
        ImageUrl: '/content/images/connect2.png',
        Title: 'Trường đào tạo đại học',
        Link: 'https://google.com',
    },
    {
        Id: 3,
        ImageUrl: '/content/images/connect3.png',
        Title: 'Trường đào tạo đại học',
        Link: 'https://google.com',
    },
    {
        Id: 4,
        ImageUrl: '/content/images/connect4.png',
        Title: 'Trường đào tạo đại học',
        Link: 'https://google.com',
    },
];

const fakeConnectionConcern = [
    {
        Id: 1,
        ImageUrl: '/content/images/connect5.png',
        Title: 'Trường đào tạo đại học',
        Link: 'https://google.com',
    },
];

function ConnectionSection(props) {
    const { isLoading, connectionSites, connectionConcern } = props;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('section-connection')}>
                <div className={cx('connection-site')}>
                    <div className={cx('connection-title')}>
                        <div className={cx('connection-lable')}>Liên kết Website</div>
                        <div className={cx('connection-divider')}></div>
                    </div>
                    <div className={cx('connection-list')}>
                        {isLoading ? (
                            <>
                                <Skeleton.Input active block />
                            </>
                        ) : (
                            <>
                                {Array.isArray(connectionSites) && (
                                    <Marquee duration={connectionSites.length * 8000} height='130px' width='100%' axis='X' align='center' pauseOnHover={true} reverse={true}>
                                        {connectionSites.map((item, index) => {
                                            return (
                                                <a href={item?.Link} key={item}>
                                                    <img key={index} src={imageHelper.getLinkImageUrl(item.Avatar)} alt={item.Title} style={{ margin: '0 10px' }} />
                                                </a>
                                            );
                                        })}
                                    </Marquee>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('section-connection')}>
                <div className={cx('connection-site')}>
                    <div className={cx('connection-title')}>
                        <div className={cx('connection-lable')}>Doanh nghiệp</div>
                        <div className={cx('connection-divider')}></div>
                    </div>
                    <div className={cx('connection-list')}>
                        {isLoading ? (
                            <>
                                <Skeleton.Input active block />
                            </>
                        ) : (
                            <>
                                <Marquee duration={connectionConcern.length * 8000} height='130px' width='100%' axis='X' align='center' pauseOnHover={true} reverse={true}>
                                    {connectionConcern &&
                                        connectionConcern.map((item, index) => {
                                            return (
                                                <a href={item?.Link} key={item}>
                                                    <img key={index} src={imageHelper.getLinkImageUrl(item.Avatar)} alt={item.Title} style={{ margin: '0 10px' }} />
                                                </a>
                                            );
                                        })}
                                </Marquee>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConnectionSection;

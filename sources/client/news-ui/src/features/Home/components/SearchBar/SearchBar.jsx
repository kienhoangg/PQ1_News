import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SearchBar.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Col, Input, Row, Skeleton } from 'antd';
import routes from 'config/configRoutes';
import { useSelector } from 'react-redux';
import Marquee from 'react-easy-marquee';
import commonRender from 'common/commonRender';
import { envApiKeyWeather } from 'common/enviroments';

const { Search } = Input;
const cx = classNames.bind(styles);

SearchBar.propTypes = {
  userName: PropTypes.string,
};

SearchBar.defaultProps = {
  userName: 'admin',
};

function SearchBar(props) {
  const { userName } = props;
  const homeRedux = useSelector((state) => state.home);
  const [loading, setLoading] = useState(true);
  const [weatherValue, setWeatherValue] = useState(null);

  //Lấy thông tin thời tiết
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=21.69611&lon=104.8752392&appid&appid=${envApiKeyWeather}`;
        let dataWeather = await fetch(url).then((res) => res.json());
        console.log('dataWeather', dataWeather);
        setWeatherValue((dataWeather?.main?.temp - 273.15)?.toFixed(2));
      } catch (error) {
        console.log('Failed to fetch list: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className={cx('wrapper')}>
      <Row gutter={8} style={{ width: '100%' }}>
        <Col className={cx('col')} md={13} xs={24}>
          <Row align='middle'>
            <Search
              placeholder='Nhập từ khóa tìm kiếm'
              size='large'
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Row>
        </Col>
        <Col md={7} xs={24}>
          <div className={cx('btn-group')}>
            <Link className={cx('btn-item')} to={routes.publishedIntroduce}>
              Giới thiệu chung
            </Link>
            <Link className={cx('btn-item')} to={'/'}>
              Bộ máy nhà nước
            </Link>
            <Link className={cx('btn-item')} to={'/'}>
              Sơ đồ Website
            </Link>
          </div>
        </Col>
        <Col md={4} xs={24}>
          <div className={cx('weather')}>
            <div className={cx('weather-label')}>
              Xin chào, <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{userName}</span>
            </div>
            {/* <div className={cx('weather-label')}>Yên bái</div>
                        <div className={cx('weather-value')}>{weatherValue ? `${weatherValue} ℃` : ''}</div> */}
          </div>
        </Col>
      </Row>
      <Row gutter={8}>
        <div className={cx('news-hot')}>
          {homeRedux.loading ? (
            <>
              <Skeleton.Input active size='small' />
            </>
          ) : (
            <>
              {Array.isArray(homeRedux?.runPost) && (
                <Marquee
                  duration={homeRedux.runPost.length * 8000}
                  height='80px'
                  width='100%'
                  axis='X'
                  align='center'
                  pauseOnHover={true}
                  reverse={true}
                >
                  {homeRedux.runPost.map((item, index) => {
                    return (
                      <>
                        <Link
                          to={commonRender.renderLinkNewsDetail(item.Id)}
                          style={{ display: 'flex', alignItems: 'center', marginRight: '100px' }}
                        >
                          <span className={cx('news-hot-icon')}></span>
                          <span key={index} className={cx('news-hot-content')}>
                            {item.Title}
                          </span>
                        </Link>
                      </>
                    );
                  })}
                </Marquee>
              )}
            </>
          )}
        </div>
        <div className={cx('divider')}></div>
      </Row>
    </div>
  );
}

export default SearchBar;

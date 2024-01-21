import { Button, Form, Input, Modal, Radio, Row, Skeleton, Space } from 'antd';
import homeApi from 'apis/published/homeApi';
import classNames from 'classnames/bind';
import commonRender from 'common/commonRender';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import useWindowDimensions from 'customHooks/useWindowDimensions';
import { useEffect, useState } from 'react';
import { Bar, BarChart, LabelList, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './PublishedEvaluatePage.module.scss';

const cx = classNames.bind(styles);

PublishedEvaluatePage.propTypes = {};

PublishedEvaluatePage.defaultProps = {};

const dataChartDefault = [
    {
        Level: 1,
        name: 'Rất hài lòng',
        value: '0%',
        'Bình chọn': 0,
        fill: 'rgb(169,255,150)',
    },
    {
        Level: 2,
        name: 'Hài lòng',
        value: '0%',
        'Bình chọn': 0,
        fill: 'rgb(255,188,117)',
    },
    {
        Level: 3,
        name: 'Chấp nhận được',
        value: '0%',
        'Bình chọn': 0,
        fill: 'rgb(128,133,233)',
    },
    {
        Level: 4,
        name: 'Không hài lòng',
        value: '0%',
        'Bình chọn': 0,
        fill: 'rgb(241,92,128)',
    },
    {
        Level: 5,
        name: 'Không thể chấp nhận được',
        value: '0%',
        'Bình chọn': 0,
        fill: 'rgb(253,236,109)',
    },
];

function PublishedEvaluatePage(props) {
    const [evaluateData, setEvaluateData] = useState();
    const [loading, setLoading] = useState(true);

    const [openModelResult, setOpenModelResult] = useState(false);
    const [dataChartResult, setDataChartResult] = useState([]);
    const [dataChartTotalRate, setChartTotalRate] = useState({});

    const { height, width } = useWindowDimensions();

    function handleOnClickResult(id) {
        const fetchDataReport = async (id) => {
            try {
                const response = await homeApi.getRateReport(id);
                setChartTotalRate({
                    TotalRating: response?.TotalRating,
                    Title: response?.Title,
                });
                if (dataChartDefault.TotalRating === 0) {
                    setDataChartResult(dataChartDefault);
                } else {
                    let dataChart = [...dataChartDefault];

                    let satisfiedData = dataChart.find((x) => x.Level === 1);
                    let percentSatisfiedData = ((response.SatisfiedCount * 100) / response.TotalRating).toFixed(0);
                    satisfiedData['Bình chọn'] = parseInt(percentSatisfiedData);
                    satisfiedData.value = `${percentSatisfiedData}%`;

                    let happy = dataChart.find((x) => x.Level === 2);
                    let percentHappy = ((response.HappyCount * 100) / response.TotalRating).toFixed(0);
                    happy['Bình chọn'] = parseInt(percentHappy);
                    happy.value = `${percentHappy}%`;

                    let good = dataChart.find((x) => x.Level === 3);
                    let percentGood = ((response.OkCount * 100) / response.TotalRating).toFixed(0);
                    good['Bình chọn'] = parseInt(percentGood);
                    good.value = `${percentGood}%`;

                    let unHappy = dataChart.find((x) => x.Level === 4);
                    let percentUnHappy = ((response.UnHappyCount * 100) / response.TotalRating).toFixed(0);
                    unHappy['Bình chọn'] = parseInt(percentUnHappy);
                    unHappy.value = `${percentUnHappy}%`;

                    let unStatisfied = dataChart.find((x) => x.Level === 5);
                    let percentUnStatisfied = 100 - satisfiedData['Bình chọn'] - happy['Bình chọn'] - good['Bình chọn'] - unHappy['Bình chọn'];
                    unStatisfied['Bình chọn'] = parseInt(percentUnStatisfied);
                    unStatisfied.value = `${percentUnStatisfied}%`;

                    setDataChartResult(dataChart);
                }

                setOpenModelResult(true);
            } catch (error) {}
        };

        fetchDataReport(id);
    }

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const params = {};
                const response = await homeApi.getRateListData(params);
                setEvaluateData(response?.PagedData?.Results);
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHome();
    }, []);

    function handleSubmitForm(params) {
        const submitRate = async (params) => {
            try {
                const body = {
                    Id: params.Id,
                    Title: params.Title,
                    satisfiedCount: 0,
                    happyCount: 0,
                    okCount: 0,
                    notSatisfiedCount: 0,
                    unHappyCount: 0,
                };
                switch (params.rate) {
                    case 1:
                        body.satisfiedCount = 1;
                        break;
                    case 2:
                        body.happyCount = 1;
                        break;
                    case 3:
                        body.okCount = 1;
                        break;
                    case 4:
                        body.unHappyCount = 1;
                        break;
                    case 5:
                        body.notSatisfiedCount = 1;
                        break;
                    default:
                        body.satisfiedCount = 1;
                        break;
                }

                await homeApi.submitRating(body);
                commonRender.showNotifySuccess('Cảm ơn bạn đã bình chọn');
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            }
        };

        submitRate(params);
    }

    return (
        <div className={cx('wrapper')}>
            <ScrollToTop />
            <Row className={cx('banner')}>
                <div className={cx('banner-content')}>
                    <h3>Đánh giá sự phục vụ cơ quan nhà nước xã Đông Cuông</h3>
                </div>
            </Row>
            <Row className={cx('tutorial')}>
                <div>
                    Hướng dẫn: Lựa chọn phương án đánh giá và bấm vào nút "Ý kiến" tương ứng để đánh giá chất lượng phục vụ của các cơ quan chuyên môn. Xem tổng hợp kết quả đánh giá: Bấm vào nút "Kết
                    quả".
                </div>
            </Row>
            <Row className={cx('title')}>
                <h3>ĐÁNH GIÁ SỰ PHỤC VỤ CỦA CƠ QUAN HÀNH CHÍNH NHÀ NƯỚC</h3>
            </Row>
            <Skeleton loading={loading} active>
                {Array.isArray(evaluateData) &&
                    evaluateData.map((item, index) => {
                        const component = (
                            <Row className={cx('question')} key={index}>
                                <Form
                                    name={`form-${item.Id}`}
                                    onFinish={handleSubmitForm}
                                    initialValues={{
                                        Id: item.Id,
                                        Title: item.Title,
                                    }}
                                >
                                    <div className={cx('tutorial-title')}>
                                        {index + 1}. {item.Title}
                                    </div>
                                    <Form.Item
                                        name={`rate`}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn ít nhất một lựa chọn',
                                            },
                                        ]}
                                    >
                                        <Radio.Group size='small'>
                                            <Space direction='vertical'>
                                                <Radio value={1}>Rất hài lòng</Radio>
                                                <Radio value={2}>Hài lòng</Radio>
                                                <Radio value={3}>Chấp nhận được</Radio>
                                                <Radio value={4}>Không hài lòng</Radio>
                                                <Radio value={5}>Không thể chấp nhận được</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item hidden name={'Id'}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item hidden name={'Title'}>
                                        <Input />
                                    </Form.Item>
                                    <div className={cx('btn-group')}>
                                        <Button type='primary' size='small' htmlType='submit'>
                                            Bình chọn
                                        </Button>
                                        <Button type='primary' size='small' onClick={() => handleOnClickResult(item.Id)}>
                                            Kết quả
                                        </Button>
                                    </div>
                                </Form>
                            </Row>
                        );
                        return component;
                    })}
            </Skeleton>

            {/* Model kết quả*/}
            <Modal
                title='Kết quả đánh giá'
                centered
                open={openModelResult}
                onOk={() => setOpenModelResult(false)}
                onCancel={() => setOpenModelResult(false)}
                cancelButtonProps={{
                    style: {
                        display: 'none',
                    },
                }}
                // onCancel={() => setOpenModelResult(false)}
                width={900}
            >
                <div className={cx('result-container')}>
                    <div className={cx('result-title')}>ĐÁNH GIÁ CHẤT LƯỢNG PHỤC VỤ CỦA TỪNG CƠ QUAN CHUYÊN MÔN</div>
                    <div className={cx('result-description')}>
                        <div>Kết quả bình chọn</div>
                        <div>{dataChartTotalRate?.Title}</div>
                    </div>
                    <div className={cx('result-chart')}>
                        <BarChart width={width > 767 ? 800 : width - 16} height={300} data={dataChartResult} barSize={width > 767 ? 60 : 10}>
                            <XAxis dataKey='name' />
                            <YAxis padding={{ top: 20 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey='Bình chọn' fill='#8884d8'>
                                <LabelList dataKey='value' position='top' fill='#000' />
                            </Bar>
                        </BarChart>
                    </div>
                    <div className={cx('result-total')}>Tổng cộng có {dataChartTotalRate?.TotalRating} lượt bình chọn</div>
                </div>
            </Modal>
        </div>
    );
}

export default PublishedEvaluatePage;

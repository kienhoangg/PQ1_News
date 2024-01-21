import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './operatingDocumentsPage.scss';
import classNames from 'classnames/bind';
import { Button, DatePicker, Pagination, Select, Skeleton, Table } from 'antd';
import IconPDF from '../../../assets/icons/icon-pdf.png';
import axiosClient from 'apis/axiosClient';
import moment from 'moment';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import Marquee from 'react-easy-marquee';

OperatingDocumentsPage.propTypes = {};

OperatingDocumentsPage.defaultProps = {};

/**
 * Component hiển thị và tìm kiếm các văn bản
 * @param {*} props
 * @author TDBA (09/10/2022)
 */
function OperatingDocumentsPage(props) {
    const cx = classNames.bind(styles);

    const elListItemRunningRef = useRef(''); // Ref tham chiếu tới phần tử chưa danh sách item
    const scrollTo = useRef(0); // Lưu vị trí scroll
    const setIntervalRef = useRef(null); // Lưu tham chiếu tới setinterval để clear

    const [listNewDocument, setListNewDocument] = useState([]); // Danh cac van ban moi

    const [documentData, setDocumentData] = useState({
        data: [],
        totalInDB: 0,
    });
    const [dataPaging, setDataPaging] = useState(1); // State lưu dữ liệu paging
    const [indexNumber, setIndexNumber] = useState(''); // Số ký hiệu
    const [titleFilter, setTitleFilter] = useState(''); // Tiêu đề
    const [documentType, setDocumentType] = useState([]); // Danh sách dữ liệu "Loại văn bản"
    const [fieldOfDocument, setFieldOfDocument] = useState([]); // Danh sách dữ liệu "Lĩnh vực văn bản"
    const [agencyIssued, setAgencyIssued] = useState([]); // Danh sách dữ liệu "Cơ quan ban hành"
    const [signer, setSigner] = useState([]); // Danh sách dữ liệu "Người ký"
    const [dateFilter, setDateFilter] = useState({
        from: null,
        to: null,
    });

    const [loading, setLoading] = useState(true);

    /**
     * Column của bảng
     * @author TDBA (09/10/2022)
     */
    const COLUMN = [
        {
            title: 'Số/Ký hiệu',
            dataIndex: 'INDEX_NUMBER',
            key: 'INDEX_NUMBER',
            width: '16%',
        },
        {
            title: 'Trích yếu',
            dataIndex: 'DESCRIBE',
            key: 'DESCRIBE',
        },
        {
            title: 'Ngày ban hành',
            dataIndex: 'RELEASE_DATE',
            key: 'RELEASE_DATE',
            width: '16%',
        },
        {
            title: 'Tệp',
            dataIndex: 'FILE_URL',
            key: 'FILE_URL',
            width: '5%',
        },
    ];

    /**
     * Thêm dự kiện tự động scroll
     * @author TDBA (09/10/2022)
     */
    useEffect(() => {
        clearInterval(setIntervalRef.current);
        // setEventAutoScroll();
    }, []);

    // /**
    //  * Tạo event tự động scroll
    //  * @author TDBA (09/10/2022)
    //  */
    // const setEventAutoScroll = () => {
    //   setIntervalRef.current = setInterval(() => {
    //     elListItemRunningRef.current?.scrollTo(0, scrollTo.current);
    //     ++scrollTo.current;
    //   }, 100);
    // };

    /**
     * Thực hiện callApi lấy các dữ liệu cho dropdown Loại văn bản, Lĩnh vực văn bản, Cơ quan BH, Người ký
     * @author TDBA (15/10/2022)
     */
    useEffect(() => {
        callApiGetDataMaster();
    }, []);

    /**
     * Thực hiện callApi lấy dữ liệu bảng
     * @author TDBA (15/10/2022)
     */
    useEffect(() => {
        callApiGetDocumentByFilter();
    }, [dataPaging]);

    /**
     * Thực hiện callApi lấy các dữ liệu cho dropdown Loại văn bản, Lĩnh vực văn bản, Cơ quan BH, Người ký
     * @author TDBA (15/10/2022)
     */
    const callApiGetDataMaster = async () => {
        try {
            const res = await axiosClient.get('/home/documents/master');

            // Xét dữ liệu cho dropdown "Loại văn bản"
            setDocumentType(
                (res?.DocumentTypes || [])?.map((item) => ({
                    value: item?.Id,
                    label: item?.Title,
                }))
            );

            // Xét dữ liệu cho "Lĩnh vực văn bản"
            setFieldOfDocument(
                (res?.DocumentFields || [])?.map((item) => ({
                    value: item?.Id,
                    label: item?.Title,
                }))
            );

            // Xét dữ liệu cho "Cơ quan ban hành"
            setAgencyIssued(
                (res?.DocumentDepartments || [])?.map((item) => ({
                    value: item?.Id,
                    label: item?.Title,
                }))
            );

            // Xét dữ liệu cho "Người ký"
            setSigner(
                (res?.DocumentSignPersons || [])?.map((item) => ({
                    value: item?.Id,
                    label: item?.Title,
                }))
            );
        } catch (error) {}
    };

    const PAGE_SIZE = 20;

    /**
     * Lấy ID của item được chọn
     * @author TDBA (15/10/2022)
     */
    const getId = (listData = []) => {
        return listData?.find((item) => item?.isSelected)?.value || null;
    };

    /**
     * Thực hiện gọi API lấy danh sách văn bản
     * @author TDBA (15/10/2022)
     */
    const callApiGetDocumentByFilter = async () => {
        try {
            setLoading(true);
            let body = {
                keyword: indexNumber,
                title: titleFilter,
                pageSize: PAGE_SIZE,
                currentPage: dataPaging,
                direction: -1,
                orderBy: 'CreatedDate',
                fromDate: dateFilter?.from,
                toDate: dateFilter?.to,
                documentDepartmentId: getId(agencyIssued),
                documentFieldId: getId(fieldOfDocument),
                documentSignPersonId: getId(signer),
                documentTypeId: getId(documentType),
                status: 1,
            };

            const res = await axiosClient.post('/home/documents/filter', body);
            setDocumentData({
                data: res?.PagedData?.Results,
                totalInDB: res?.PagedData?.RowCount,
            });

            if (dataPaging === 1) {
                setListNewDocument(res?.PagedData?.Results);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    /**
     * Thực hiện convert lại dữ liệu cho bảng
     * @param {*} dataRaw Dữ liệu thô
     * @author TDBA (09/10/2022)
     */
    const convertDataTable = (dataRaw) => {
        return dataRaw?.map((item, index) => {
            return {
                ...item,
                key: index,
                INDEX_NUMBER: item?.Code,
                DESCRIBE: item?.Name,
                RELEASE_DATE: moment(item?.PublishedDate).format('DD/MM/YYYY'),
                FILE_URL: (
                    <a href={window.location.origin + '/' + item?.FilePath}>
                        <img className={cx('operating-documents-page__left__list-document__body__table__icon-pdf')} src={IconPDF}></img>
                    </a>
                ),
            };
        });
    };

    return (
        <div className={cx('operating-documents-page')}>
            <ScrollToTop />
            <div className={cx('operating-documents-page__left')}>
                <div className={cx('operating-documents-page__left__search-document')}>
                    <div className={cx('operating-documents-page__left__search-document__header')}>
                        <div className={cx('operating-documents-page__left__search-document__header__content')}>
                            <span>{'Văn bản điều hành'}</span>
                        </div>
                    </div>
                    <div className={cx('operating-documents-page__left__search-document__body')}>
                        {/* Input nhập số ký tự */}
                        <div className={cx('operating-documents-page__left__search-document__body__row')}>
                            <div className={cx('operating-documents-page__left__search-document__body__row__label')}>
                                <span>{'Số ký hiệu'}</span>
                            </div>

                            <div className={cx('operating-documents-page__left__search-document__body__row__input')}>
                                <input placeholder='Nhập số ký hiệu' onChange={(event) => setIndexNumber(event?.target?.value)} />
                            </div>
                        </div>

                        {/* Input nhập tiêu đề */}
                        <div className={cx('operating-documents-page__left__search-document__body__row')}>
                            <div className={cx('operating-documents-page__left__search-document__body__row__label')}>
                                <span>{'Trích yếu'}</span>
                            </div>

                            <div className={cx('operating-documents-page__left__search-document__body__row__input')}>
                                <input placeholder='Nhập từ khoá tìm kiếm' onChange={(event) => setTitleFilter(event?.target?.value)} />
                            </div>
                        </div>

                        {/* Input nhập  */}
                        <div className={cx('operating-documents-page__left__search-document__body__row')}>
                            <div className={cx('operating-documents-page__left__search-document__body__row__select')}>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__label')}>
                                    <span>{'Loại văn bản'}</span>
                                </div>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__dropdown')}>
                                    <Select
                                        allowClear
                                        placeholder={'--- Chọn loại văn bản ---'}
                                        options={documentType}
                                        onChange={(val) => {
                                            setDocumentType(
                                                documentType?.map((item) => ({
                                                    ...item,
                                                    isSelected: item?.value === val,
                                                }))
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={cx('operating-documents-page__left__search-document__body__row__select')}>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__label')}>
                                    <span>{'Lĩnh vực văn bản'}</span>
                                </div>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__dropdown')}>
                                    <Select
                                        allowClear
                                        placeholder={'--- Chọn lĩnh vực văn bản ---'}
                                        options={fieldOfDocument}
                                        onChange={(val) => {
                                            setFieldOfDocument(
                                                fieldOfDocument?.map((item) => ({
                                                    ...item,
                                                    isSelected: item?.value === val,
                                                }))
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={cx('operating-documents-page__left__search-document__body__row__select')}>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__label')}>
                                    <span>{'Cơ quan BH'}</span>
                                </div>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__dropdown')}>
                                    <Select
                                        allowClear
                                        placeholder={'--- Chọn cơ quan ban hành ---'}
                                        options={agencyIssued}
                                        onChange={(val) => {
                                            setAgencyIssued(
                                                agencyIssued?.map((item) => ({
                                                    ...item,
                                                    isSelected: item?.value === val,
                                                }))
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={cx('operating-documents-page__left__search-document__body__row__select')}>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__label')}>
                                    <span>{'Người ký'}</span>
                                </div>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__dropdown')}>
                                    <Select
                                        allowClear
                                        placeholder={'--- Chọn người ký ---'}
                                        options={signer}
                                        onChange={(val) => {
                                            setSigner(
                                                signer?.map((item) => ({
                                                    ...item,
                                                    isSelected: item?.value === val,
                                                }))
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={cx('operating-documents-page__left__search-document__body__row__select')}>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__label')}>
                                    <span>{'Từ ngày'}</span>
                                </div>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__dropdown')}>
                                    <DatePicker
                                        placeholder='Từ ngày'
                                        style={{ width: '100%' }}
                                        onChange={(res) =>
                                            setDateFilter({
                                                ...dateFilter,
                                                from: new Date(res?.toISOString()),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className={cx('operating-documents-page__left__search-document__body__row__select')}>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__label')}>
                                    <span>{'Đến ngày'}</span>
                                </div>
                                <div className={cx('operating-documents-page__left__search-document__body__row__select__dropdown')}>
                                    <DatePicker
                                        placeholder='Đến ngày'
                                        style={{ width: '100%' }}
                                        onChange={(res) =>
                                            setDateFilter({
                                                ...dateFilter,
                                                to: new Date(res?.toISOString()),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        type='primary'
                        style={{ width: '87px', height: '34px', borderRadius: 3 }}
                        onClick={() => {
                            callApiGetDocumentByFilter();
                        }}
                    >
                        {'Tìm kiếm'}
                    </Button>
                </div>
                <div className={cx('operating-documents-page__left__list-document')}>
                    <div className={cx('operating-documents-page__left__list-document__header')}>
                        <div className={cx('operating-documents-page__left__list-document__header__content')}>
                            <span>{'Tìm thấy '}</span>
                            <span
                                style={{
                                    color: 'red',
                                }}
                            >
                                {loading ? '-' : documentData?.totalInDB}
                            </span>
                            <span>{' văn bản.'}</span>
                        </div>
                    </div>
                    <div className={cx('operating-documents-page__left__list-document__body')}>
                        <Skeleton loading={loading} active>
                            <div className={cx('operating-documents-page__left__list-document__body__table')}>
                                <Table
                                    columns={COLUMN}
                                    dataSource={convertDataTable(documentData?.data)}
                                    pagination={false}
                                    onRow={(item) => ({
                                        onClick: () => window.location.replace('/documents/' + item?.Id),
                                    })}
                                />
                            </div>
                            <div className={cx('operating-documents-page__left__list-document__body__pagination')}>
                                <Pagination total={documentData?.totalInDB} showSizeChanger={false} defaultPageSize={20} current={dataPaging} onChange={(page) => setDataPaging(page)} />
                            </div>
                        </Skeleton>
                    </div>
                </div>
            </div>
            <div className={cx('operating-documents-page__right')}>
                <div className={cx('operating-documents-page__right__row')}>
                    <a href='/'>
                        <span>{'Văn bản chỉ đạo điều hành'}</span>
                    </a>
                    <div
                        className={cx('operating-documents-page__right__row__list-item-running')}
                        ref={elListItemRunningRef}
                        // onMouseEnter={() => clearInterval(setIntervalRef.current)}
                        // onMouseLeave={() => setEventAutoScroll()}
                    >
                        <Skeleton loading={loading} active>
                            <Marquee duration={listNewDocument?.length * 6000} height='100%' width='100%' axis='Y' pauseOnHover={true} reverse={true}>
                                {listNewDocument?.map((item) => (
                                    <div className={cx('operating-documents-page__right__row__list-item-running__item')} style={{ whiteSpace: 'break-spaces' }}>
                                        <a
                                            href={`/documents/${item?.Id}`}
                                            className={cx('operating-documents-page__right__row__list-item-running__item__href')}
                                            style={{ borderTop: '1px dotted #bbbcbf' }}
                                        >
                                            <span className={cx('operating-documents-page__right__row__list-item-running__item__href__dot')}></span>
                                            <span>{item?.Name}</span>
                                        </a>
                                    </div>
                                ))}
                            </Marquee>
                        </Skeleton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperatingDocumentsPage;

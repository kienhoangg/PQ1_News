import axiosClient from 'apis/axiosClient';
import classNames from 'classnames/bind';
import { NotificationType } from 'common/enum';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import { openNotification } from 'helpers/notification';
import { useRef, useState } from 'react';
import styles from './PublishedSuggestionBox.module.scss';

const cx = classNames.bind(styles);

PublishedSuggestionBox.propTypes = {};

PublishedSuggestionBox.defaultProps = {};

function PublishedSuggestionBox(props) {
  const DATA_FORM_DEFAULT = {
    fullName: '', // Họ và tên
    phoneNumber: '', // Số điện thoại
    address: '', // Địa chỉ
    email: '', // Email
    field: '', // Lĩnh vực
    title: '', // Tiêu đề
    content: '', // Nội dung
    fileUpload: '', // File cập nhật
  };
  const [dataForm, setDataForm] = useState(DATA_FORM_DEFAULT); // Dữ liệu form
  const [inputFile, setInputFile] = useState(new Date());
  const [warningInput, setWarningInput] = useState({
    fullName: false,
    phoneNumber: false,
    title: false,
    content: false,
  });
  const [fileName, setFileName] = useState('');
  const elInputFile = useRef();
  const formDataRef = useRef(new FormData());
  const elInputRef = useRef([]);
  const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb

  /**
   * THực hiện hành động khi chọn file
   * @author TDBA (16/10/2022)
   */
  const handleChoseFile = (event) => {
    setInputFile(new Date());
    if (event?.target?.files?.[0]) {
      formDataRef.current = new FormData();
      formDataRef.current?.delete('FileAttachment');
      formDataRef.current?.append('FileAttachment', event?.target?.files?.[0]);
      setFileName(event?.target?.files?.[0]?.name);
      if (event?.target?.files?.[0]?.size > LIMIT_UP_LOAD_FILE) {
        openNotification('File ảnh đã lớn hơn 2MB', '', NotificationType.ERROR);
      }
    }
  };

  /**
   * Thực hiện gọi api tạo câu hỏi
   * @author TDBA (16/10/2022)
   */
  const callApiCreateQuestion = async () => {
    try {
      const body = {
        ...(dataForm?.fullName || dataForm?.fullName === 0
          ? { FullName: dataForm?.fullName }
          : {}),
        ...(dataForm?.address || dataForm?.address === 0
          ? { Address: dataForm?.address }
          : {}),
        ...(dataForm?.phoneNumber || dataForm?.phoneNumber === 0
          ? { Phone: dataForm?.phoneNumber }
          : {}),
        ...(dataForm?.email || dataForm?.email === 0
          ? { Email: dataForm?.email }
          : {}),
        ...(dataForm?.title || dataForm?.title === 0
          ? { Title: dataForm?.title }
          : {}),
        ...(dataForm?.content || dataForm?.content === 0
          ? { Content: dataForm?.content }
          : {}),
      };

      formDataRef.current?.delete('JsonString');
      formDataRef.current?.append('JsonString', JSON.stringify(body));
      const res = await axiosClient.post('Feedbacks', formDataRef.current, {
        headers: {
          Prefer: 'code=200, example=200GetReturn2Record',
          'Content-Type': 'multipart/form-data',
        },
      });

      setDataForm(DATA_FORM_DEFAULT);
      elInputRef.current?.map((item) => (item.value = ''));
      formDataRef.current = new FormData();
      setFileName('');
      setWarningInput({
        fullName: false,
        phoneNumber: false,
        title: false,
        content: false,
      });

      openNotification('Gửi câu hỏi thành công', '', NotificationType.SUCCESS);
    } catch (err) {
      openNotification('Gửi câu hỏi thất bại', '', NotificationType.ERROR);
    }
  };

  /**
   * Validate dữ liệu trước khi gửi
   * @author TDBA (16/10/2022)
   */
  const onValidateDate = () => {
    if (dataForm?.fullName) {
      callApiCreateQuestion();
    } else {
      setWarningInput({
        fullName: dataForm?.fullName ? false : true,
      });
    }
  };

  return (
    <div className={cx('suggestion-box-page')}>
      <ScrollToTop />
      <div className={cx('suggestion-box-page__left')}></div>
      <div className={cx('suggestion-box-page__right')}>
        <div className={cx('suggestion-box-page__right__header')}>
          <div className={cx('suggestion-box-page__right__header__tag')}>
            <a href='/'>Hòm thư góp ý</a>
            <div></div>
          </div>
          <div
            className={cx('suggestion-box-page__right__header__description')}
          >
            Những ý kiến tâm huyết, xây dựng của bạn đọc sẽ được trân trọng
            chuyển tới Lãnh đạo tỉnh. Mời quý bạn đọc điền đầy đủ thông tin theo
            mẫu dưới đây để góp ý:
          </div>
        </div>
        <div className={cx('suggestion-box-page__right__body')}>
          <div className={cx('suggestion-box-page__right__body__top')}>
            <div className={cx('suggestion-box-page__right__body__top__item')}>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__label'
                )}
              >
                <b>Họ và tên </b>
                <span
                  style={{
                    color: 'red',
                  }}
                >
                  &nbsp;*
                </span>
              </div>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__input'
                )}
              >
                <input
                  ref={(ref) => (elInputRef.current[0] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      fullName: val,
                    });
                    if (!val) {
                      setWarningInput({
                        ...warningInput,
                        fullName: true,
                      });
                    } else {
                      setWarningInput({
                        ...warningInput,
                        fullName: false,
                      });
                    }
                  }}
                />
                {warningInput?.fullName ? (
                  <b
                    className={cx(
                      'suggestion-box-page__right__body__top__item__input__warning'
                    )}
                  >
                    Vui lòng nhập họ tên
                  </b>
                ) : null}
              </div>
            </div>

            <div className={cx('suggestion-box-page__right__body__top__item')}>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__label'
                )}
              >
                <b>Email </b>
              </div>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__input'
                )}
              >
                <input
                  ref={(ref) => (elInputRef.current[3] = ref)}
                  onChange={(event) =>
                    setDataForm({
                      ...dataForm,
                      email: event?.target?.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={cx('suggestion-box-page__right__body__top__item')}>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__label'
                )}
              >
                <b>Điện thoại </b>
              </div>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__input'
                )}
              >
                <input
                  ref={(ref) => (elInputRef.current[2] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      phoneNumber: val,
                    });
                  }}
                />
              </div>
            </div>

            <div className={cx('suggestion-box-page__right__body__top__item')}>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__label'
                )}
              >
                <b>Địa chỉ </b>
              </div>
              <div
                className={cx(
                  'suggestion-box-page__right__body__top__item__input'
                )}
              >
                <input
                  ref={(ref) => (elInputRef.current[1] = ref)}
                  onChange={(event) =>
                    setDataForm({ ...dataForm, address: event?.target?.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className={cx('suggestion-box-page__right__body__mid')}>
            <div className={cx('suggestion-box-page__right__body__mid__row')}>
              <div
                className={cx(
                  'suggestion-box-page__right__body__mid__row__label'
                )}
              >
                <b>Tiêu đề</b>{' '}
              </div>
              <div
                className={cx(
                  'suggestion-box-page__right__body__mid__row__input'
                )}
              >
                <input
                  ref={(ref) => (elInputRef.current[4] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      title: val,
                    });
                  }}
                />
              </div>
            </div>
            <div className={cx('suggestion-box-page__right__body__mid__row')}>
              <div
                className={cx(
                  'suggestion-box-page__right__body__mid__row__label'
                )}
              >
                <b>Nội dung</b>{' '}
              </div>
              <div
                className={cx(
                  'suggestion-box-page__right__body__mid__row__input'
                )}
              >
                <textarea
                  ref={(ref) => (elInputRef.current[5] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      content: val,
                    });
                  }}
                />
              </div>
            </div>
            <div className={cx('suggestion-box-page__right__body__mid__row')}>
              <div
                className={cx(
                  'suggestion-box-page__right__body__mid__row__label'
                )}
              >
                <b>Đính kèm</b>
              </div>
              <div
                className={cx(
                  'suggestion-box-page__right__body__mid__row__input'
                )}
              >
                <button onClick={() => elInputFile.current?.click()}>
                  Tải lên
                </button>
                {fileName ? (
                  <div
                    className={cx(
                      'suggestion-box-page__right__body__mid__row__input__cancel-upload-file'
                    )}
                  >
                    <button
                      onClick={() => {
                        setFileName('');
                        formDataRef.current?.delete('FileAttachment');
                      }}
                    >
                      Huỷ
                    </button>
                    <span>{fileName}</span>
                  </div>
                ) : null}

                <input
                  type='file'
                  ref={elInputFile}
                  key={inputFile}
                  onChange={handleChoseFile}
                  style={{
                    display: 'none',
                  }}
                />
              </div>
            </div>
          </div>
          <div className={cx('suggestion-box-page__right__body__bottom')}>
            <button onClick={() => onValidateDate()}>Gửi câu hỏi</button>
            <button
              onClick={() => {
                setDataForm(DATA_FORM_DEFAULT);
                elInputRef.current?.map((item) => (item.value = ''));
                formDataRef.current = new FormData();
                setWarningInput({
                  fullName: false,
                  phoneNumber: false,
                  title: false,
                  content: false,
                });
                setFileName('');
              }}
            >
              Nhập lại
            </button>
          </div>
        </div>
        <div className={cx('suggestion-box-page__right__footer')}></div>
      </div>
    </div>
  );
}

export default PublishedSuggestionBox;

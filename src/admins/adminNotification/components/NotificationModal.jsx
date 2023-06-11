import { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import {
  ModalOverlay,
  ModalContentBlock,
  ModalTitle,
  ModalSubTitle,
  ModalContentP,
  ModalContentInput,
  ModalContentTextarea,
  ModalButtonBlock,
  ModalHeader,
  ModalHeaderButton,
  ModalButton,
} from '../styledComponents/ModalComponents';
import { fetchReadNotificationInfoDetail, fetchUpdateNotification } from '../apis/postApi';

const NotificationModal = ({ id, handleModalCancelClick }) => {
  const [updatable, setUpdatable] = useState(false);
  const [contents, setContents] = useState({ title: '', content: '' });
  const firstInput = useRef(null);

  const handleUpdatable = () => {
    setUpdatable(true);
    if (!updatable) firstInput.current.focus();
  };

  const handleChangeContents = (e) => {
    const newContent = { ...contents };
    newContent[e.target.name] = e.target.value;
    setContents(() => newContent);
  };

  const { data, isLoading, error } = useQuery(
    ['admin', 'notification', 'detail', 'get'],
    () => fetchReadNotificationInfoDetail(id),
    {
      onSuccess(data) {
        setContents({ title: data.title, content: data.content });
      },
    }
  );

  const { mutate: updateNotification, error: updateError } = useMutation(
    async (id) => await fetchUpdateNotification(id, contents),
    {
      onError(updateError) {
        console.log(updateError);
      },
    }
  );

  if (isLoading) return <span>로딩중...</span>;
  if (error) return <span>An error has occurred: {error.message}</span>;

  if (updateError) return <span>An updateError has occurred: {updateError.message}</span>;

  return (
    <>
      <ModalOverlay
        onClick={() => {
          handleModalCancelClick();
        }}
      />
      <ModalContentBlock className='modal-content-block'>
        <ModalHeader className='modal-header'>
          <ModalTitle className='modal-title'>공지 정보</ModalTitle>
          <ModalHeaderButton
            className='modal-button-update'
            onClick={handleUpdatable}
            $purple
            $header
          >
            수정하기
          </ModalHeaderButton>
        </ModalHeader>

        <ModalSubTitle>관리자</ModalSubTitle>
        <ModalContentP>{data.Admin.name}</ModalContentP>
        <ModalSubTitle>제목</ModalSubTitle>
        <ModalContentInput
          value={contents.title}
          onChange={handleChangeContents}
          name='title'
          readOnly={!updatable}
          ref={firstInput}
        />
        <ModalSubTitle>내용</ModalSubTitle>
        <ModalContentTextarea
          value={contents.content}
          onChange={handleChangeContents}
          name='content'
          readOnly={!updatable}
        />

        <ModalButtonBlock className='modal-button-block'>
          <ModalButton
            className='modal-button-submit'
            onClick={() => {
              const result = confirm('수정하시겠습니까?');
              if (result) {
                updateNotification(id, contents);
                handleUpdatable();
                handleModalCancelClick();
              }
            }}
            $purple
          >
            수정
          </ModalButton>
          <ModalButton
            className='modal-button-ok'
            onClick={() => {
              handleModalCancelClick();
              setUpdatable(false);
            }}
          >
            확인
          </ModalButton>
        </ModalButtonBlock>
      </ModalContentBlock>
    </>
  );
};

export default NotificationModal;

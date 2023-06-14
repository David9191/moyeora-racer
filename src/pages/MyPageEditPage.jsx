import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import LoginContainer from '../logIn/LogInContainer';
import MyPageEditInput from '../myPage/styledComponents/MyPageEditInput';
import MyPageEditSelect from '../myPage/styledComponents/MyPageEditSelect';
import Button from '../components/Button';
const URL = process.env.REACT_APP_URL;

const MyPageEdit = () => {
  const [userName, setUserName] = useState('');
  const [userImg, setUserImg] = useState('');
  const [position, setPosition] = useState('');
  const [intro, setIntro] = useState('');
  const [phase, setPhase] = useState('');
  const [track, setTrack] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 수정하지 않고 넘길 때는 이전 값 넣어주기
  useEffect(() => {
    setUserName(mainProfileData.name);
    setUserImg(mainProfileData.UserDetail.img_path);
    setPosition(
      mainProfileData.UserDetail.position === '직책을 입력해주세요.'
        ? ''
        : mainProfileData.UserDetail.position
    );
    setTrack('트랙 및');
    setPhase('기수를 입력해주세요');
    setIntro(mainProfileData.UserDetail.comment);
    setIsOpen(mainProfileData.UserDetail.profile_public === 0 ? false : true);
  }, []);

  // 트랙과 기수 이벤트 핸들러
  const handleTrackChange = (e) => {
    const selectedTrack = e.target.value;
    setTrack(selectedTrack);
  };

  const handlePhaseChange = (e) => {
    const selectedPhase = e.target.value;
    setPhase(selectedPhase);
  };
  // 프로필 오픈 핸들러
  const handleIsOpenChange = (e) => {
    setIsOpen(e.target.checked);
  };

  // 기존 내 정보 가져오기
  const mainProfileDataQuery = useQuery('mainProfileData', () =>
    fetch(`${URL}/api/users/mypage`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
    }).then((response) => response.json())
  );

  const { data: mainProfileData } = mainProfileDataQuery;

  // 프로필 이미지 POST 뮤테이션 선언
  const uploadImageMutation = useMutation((formData) =>
    fetch(`${URL}/api/users/mypage/img/upload`, {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
  );

  // 내 정보 updatedData 로 수정하기
  const updateProfileMutation = useMutation((updatedData) =>
    fetch(`${URL}/api/users/mypage/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
      body: JSON.stringify(updatedData),
    }).then((response) => response.json())
  );

  // formData 로 이미지 업로드하고 이미지 링크 받기
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('img', file);

    try {
      const data = await uploadImageMutation.mutateAsync(formData);

      if (data) {
        const imageUrl = `${URL}/` + data.file_name;
        setUserImg(imageUrl);
        queryClient.invalidateQueries('mainProfileData');
      } else {
        console.log('이미지 업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    }
  };

  // 수정한 값이 담긴 state 를 모두 updatedData 객체에 담아 post 요청 보내기
  const handleSubmit = () => {
    const updatedData = {
      userName,
      userImg,
      position,
      intro,
      phase,
      track,
      profile_public: isOpen ? 1 : 0,
    };

    updateProfileMutation.mutate(updatedData, {
      onSuccess: () => {
        queryClient.invalidateQueries('mainProfileData');
        navigate('/mypage');
      },
      onError: (error) => {
        console.error('프로필 수정 오류:', error);
      },
    });
  };

  return (
    <LoginContainer>
      <ImageContainer>
        <ProfileImg src={userImg || mainProfileData.UserDetail.img_path} alt='프로필'></ProfileImg>
        <label htmlFor='imageUpload'>
          <input
            onChange={handleImageChange}
            id='imageUpload'
            type='file'
            style={{ display: 'none' }}
          />
        </label>
      </ImageContainer>
      <MyPageEditInput
        title='이름'
        type='text'
        name='userName'
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
      />
      <TrackPhaseContainer>
        <div className='track-container'>
          <MyPageEditSelect
            title='트랙'
            options={trackOptions}
            name='track'
            onChange={handleTrackChange}
            value={track}
          />
        </div>
        <div className='phase-container'>
          <MyPageEditSelect
            title='기수'
            options={phaseOptions}
            name='phase'
            onChange={handlePhaseChange}
            value={phase}
          />
        </div>
      </TrackPhaseContainer>
      <MyPageEditInput
        title='직함'
        type='text'
        placeholder={mainProfileData.UserDetail.position}
        name='position'
        onChange={(e) => setPosition(e.target.value)}
        value={position}
      />
      <IntroTextContainter>
        <h3>자기소개</h3>
        <textarea
          placeholder={mainProfileData.UserDetail.comment || '자기소개를 입력해주세요.'}
          onChange={(e) => setIntro(e.target.value)}
          value={intro}
        ></textarea>
      </IntroTextContainter>
      <CheckboxContainer>
        <input type='checkbox' id='isOpen' checked={isOpen} onChange={handleIsOpenChange} />
        <label htmlFor='currentlyEmployed'>프로필 공개</label>
      </CheckboxContainer>
      <ButtonContainer>
        <Button
          color='darkPurple'
          value='수정완료'
          onClick={() => {
            handleSubmit();
            navigate('/mypage');
          }}
        />
        <Button color='white' value='수정취소' onClick={() => navigate('/mypage')} />
      </ButtonContainer>
    </LoginContainer>
  );
};

export default MyPageEdit;

const ImageContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;

  img {
    width: 10rem;
    border-radius: 50%;
    top: 50%;
    left: 50%;
  }

  label {
    position: absolute;
    top: 41%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10rem;
    height: 10rem;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    opacity: 0;

    &:hover {
      filter: grayscale(0.3) brightness(110%);
      transition: all 0.2s ease-in-out;
      opacity: 0.5;
    }

    input[type='file'] {
      display: none;
    }
  }
`;

const ButtonContainer = styled.div`
  width: 20rem;
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ProfileImg = styled.img`
  width: 10rem;
  margin-bottom: 2rem;
  border-radius: 50%;
`;

const TrackPhaseContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .track-container {
    width: 68%;
  }
  .phase-container {
    width: 30%;
  }
`;

const IntroTextContainter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  h3 {
    font-family: 'Noto Sans KR';
    font-weight: 400;
    font-size: 1.7rem;
    line-height: 2rem;
    margin: 0;
    margin-right: 1.5rem;
    margin-bottom: 0.5rem;
  }
  textarea {
    border: 1px solid #d8e0e9;
    border-radius: 8px;
    width: 100%;
    height: 17rem;
    padding: 0.5rem 1rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;

    ::placeholder {
      padding-top: 0.3rem;
      font-size: 1.6rem;
      font-weight: 600;
      opacity: 0.35;
    }
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  input[type='checkbox'] {
    appearance: none;
    width: 2rem;
    height: 2rem;
    border: 2px solid #d8e0e9;
    border-radius: 4px;
    margin-right: 0.5rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s ease-in-out;

    &:checked {
      background-color: #5f3dc4;
      border-color: #5f3dc4;
    }
  }

  label {
    font-family: 'Noto Sans KR';
    font-weight: 400;
    font-size: 1.5rem;
  }
`;

const trackOptions = [
  { value: '트랙을 선택해 주세요', label: '트랙을 선택해 주세요' },
  { value: 'SW 트랙', label: 'SW 트랙' },
  { value: 'AI 트랙', label: 'AI 트랙' },
];
const phaseOptions = [
  { value: '기수', label: '기수' },
  { value: '1기', label: '1기' },
  { value: '2기', label: '2기' },
  { value: '3기', label: '3기' },
  { value: '4기', label: '4기' },
  { value: '5기', label: '5기' },
  { value: '6기', label: '6기' },
  { value: '7기', label: '7기' },
  { value: '8기', label: '8기' },
];

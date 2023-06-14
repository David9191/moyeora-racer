import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from 'react-query';
import LoginContainer from '../logIn/LogInContainer';
import MyPageEditInput from '../myPage/styledComponents/MyPageEditInput';
import MyPageEditSelect from '../myPage/styledComponents/MyPageEditSelect';
import Button from '../components/Button';
import optionsData from '../myPage/data/optionsData';
const URL = process.env.REACT_APP_URL;

const MyPageEdit = () => {
  const [eduName, setEduName] = useState('');
  const [program, setProgram] = useState('');
  const [startYear, setStartYear] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [content, setContent] = useState('');
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const navigate = useNavigate();

  // useMutation POST 요청 선언
  const createEduMutation = useMutation((eduData) =>
    fetch(`${URL}/api/educations/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
      body: JSON.stringify(eduData),
    })
  );

  // input 이벤트로 state 변경하는 핸들러
  const handleStartYearChange = (e) => {
    e.preventDefault();
    const selectedYear = e.target.value;
    setStartYear(selectedYear);
  };

  const handleStartMonthChange = (e) => {
    e.preventDefault();
    const selectedMonth = e.target.value;
    setStartMonth(selectedMonth);
  };

  const handleEndYearChange = (e) => {
    e.preventDefault();
    const selectedYear = e.target.value;
    setEndYear(selectedYear);
  };

  const handleEndMonthChange = (e) => {
    e.preventDefault();
    const selectedMonth = e.target.value;
    setEndMonth(selectedMonth);
  };

  const handleCurrentlyStudyingChange = (e) => {
    setIsCurrentlyStudying(e.target.checked);
    if (e.target.checked) {
      setEndYear('');
      setEndMonth('');
    }
  };

  // 년 월 빼고 사이에 대쉬 넣기, 6월 => 06 으로 바꾸기
  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = `${startYear.replace('년', '')}-${startMonth
      .replace('월', '')
      .padStart(2, '0')}`;

    let endDate = '';
    if (!isCurrentlyStudying) {
      endDate = `${endYear.replace('년', '')}-${endMonth.replace('월', '').padStart(2, '0')}`;
    }
    // eduData에 최종 값을 넣어주기
    const eduData = {
      edu_name: eduName,
      program,
      start_date: startDate,
      end_date: endDate,
      content,
    };
    // console.log(eduData)

    // Mutation POST 요청
    createEduMutation.mutate(eduData);
  };

  return (
    <LoginContainer>
      <MyPageEditInput
        title='교육기관'
        type='text'
        placeholder='교육기관을 입력해주세요'
        name='eduName'
        onChange={(e) => {
          e.preventDefault();
          setEduName(e.target.value);
        }}
        value={eduName}
      />

      <MyPageEditInput
        title='전공 / 과정'
        type='text'
        placeholder='전공 / 과정을 입력해주세요'
        name='program'
        onChange={(e) => {
          e.preventDefault();
          setProgram(e.target.value);
        }}
        value={program}
      />

      <StartEndDateContainer>
        <div className='startDateContainer'>
          <MyPageEditSelect
            title='시작년도'
            options={optionsData.StartYearOptions}
            name='시작년도'
            onChange={handleStartYearChange}
            value={startYear}
          />
          <MyPageEditSelect
            title='시작월'
            options={optionsData.StartMonthOptions}
            name='시작월'
            onChange={handleStartMonthChange}
            value={startMonth}
          />
        </div>
        <div className='endDateContainer'>
          <MyPageEditSelect
            title='종료년도'
            options={optionsData.EndYearOptions}
            name='종료년도'
            onChange={handleEndYearChange}
            value={endYear}
            disabled={isCurrentlyStudying}
          />
          <MyPageEditSelect
            title='종료월'
            options={optionsData.EndMonthOptions}
            name='종료월'
            onChange={handleEndMonthChange}
            value={endMonth}
            disabled={isCurrentlyStudying}
          />
        </div>
      </StartEndDateContainer>
      <CheckboxContainer>
        <input
          type='checkbox'
          id='currentlyStudying'
          checked={isCurrentlyStudying}
          onChange={handleCurrentlyStudyingChange}
        />
        <label htmlFor='currentlyStudying'>교육중</label>
      </CheckboxContainer>

      <IntroTextContainter value={content}>
        <h3>어떤 활동을 했나요?</h3>
        <textarea
          onChange={(e) => {
            setContent(e.target.value);
          }}
          placeholder='교육 내용 및 활동을 입력해주세요'
        ></textarea>
      </IntroTextContainter>

      <ButtonContainer>
        <Button
          color='darkPurple'
          value='수정완료'
          onClick={(e) => {
            handleSubmit(e);
            navigate('/mypage');
          }}
        />
        <Button
          color='white'
          value='수정취소'
          onClick={() => {
            navigate('/mypage');
          }}
        />
      </ButtonContainer>
    </LoginContainer>
  );
};

export default MyPageEdit;

const ButtonContainer = styled.div`
  width: 20rem;
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const StartEndDateContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .startDateContainer {
    width: 45%;
  }
  .endDateContainer {
    width: 45%;
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
    height: 7rem;
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

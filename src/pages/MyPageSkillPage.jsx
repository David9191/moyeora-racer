import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoginContainer from '../logIn/LogInContainer';
import MyPageEditInput from '../myPage/styledComponents/MyPageEditInput';
import MyPageEditSelect from '../myPage/styledComponents/MyPageEditSelect';
import Button from '../components/Button';

const MyPageEdit = () => {
  const [skill, setSkill] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [mySkillList, setMySkillList] = useState(['123', '235']);
  const [skillList, setSkillList] = useState([]); // 검색된 스킬 목록

  const navigate = useNavigate();

  useEffect(() => {
    fetchMySkillList();
  }, []);

  useEffect(() => {
    // 디바운싱은 여러 이벤트를 한번에 묶어서 처리 쓰로틀링은 setInterval
    const delayDebounceFn = setTimeout(() => {
      if (skill !== '') {
        fetchSkillList();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [skill]);

  const fetchMySkillList = async () => {
    try {
      const response = await fetch('http://15.164.221.244:5000/api/skills/myskill', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
        },
      });
      if (response) {
        const data = await response.json();
        setMySkillList(data);
      } else {
        throw new Error('Failed to fetch mySkillList');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSkillList = async () => {
    try {
      const response = await fetch(`http://15.164.221.244:5000/api/skills?keyword=${skill}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
        },
      });
      if (response) {
        const data = await response.json();
        if (data && data.length > 0) {
          const updatedList = data.map((item) => ({
            value: item.name,
            label: item.name,
          }));
          setSkillList(updatedList);
          setSelectedSkill(updatedList[0].value);
        } else {
          setSkillList([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSkillChange = (e) => {
    console.log(e.target);
    const selectedOption = e.target.value;
    console.log(selectedOption);

    setSelectedSkill(selectedOption);
  };

  const handleAddSkill = () => {
    if (selectedSkill !== '') {
      setMySkillList([...mySkillList, selectedSkill]);
      setSelectedSkill('');
    }
  };

  const handleRemoveSkill = (removedSkill) => {
    const updatedSkillList = mySkillList.filter((skill) => skill !== removedSkill);
    setMySkillList(updatedSkillList);
  };

  const handleUpdateSkill = async () => {
    try {
      const requestBody = {
        skillNames: mySkillList,
      };

      const response = await fetch('http://15.164.221.244:5000/api/skills/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response) {
        console.log('스킬 수정이 완료되었습니다.');
      } else {
        throw new Error('Failed to update skills');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LoginContainer>
      <MyPageEditInput
        title='스킬 검색'
        type='text'
        placeholder='스킬을 검색해보세요'
        name='skill'
        onChange={(e) => {
          e.preventDefault();
          setSkill(e.target.value);
        }}
        value={skill}
      />

      <MyPageEditSelect
        title='검색된 스킬 목록'
        options={skillList}
        name='track'
        onChange={handleSkillChange}
        value={selectedSkill}
      />
      <Button color='darkPurple' value='추가하기' onClick={handleAddSkill} />

      <SubTitle>{mySkillList.length === 0 ? '내 스킬이 비어있어요' : '내 스킬 목록'}</SubTitle>
      <SkillButtonContainer>
        {mySkillList.map((mySkill, index) => (
          <div className='badge' key={index} onClick={() => handleRemoveSkill(mySkill)}>
            {mySkill}
            <RemoveText className='remove-text'>x</RemoveText>
          </div>
        ))}
      </SkillButtonContainer>

      <ButtonContainer>
        <Button
          color='darkPurple'
          value='수정완료'
          onClick={() => {
            handleUpdateSkill();
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

const SubTitle = styled.h3`
  font-family: 'Noto Sans KR';
  font-weight: 600;
  font-size: 2rem;
  margin-top: 7rem;
`;

const ButtonContainer = styled.div`
  width: 20rem;
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const SkillButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  .badge {
    position: relative;
    background-color: #ffffff;
    border: 1px solid #b9b9b9;
    padding: 8px 20px 9px 20px;
    border-radius: 2rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    cursor: pointer;

    &:hover .remove-text {
      display: block;
    }
  }
`;

const RemoveText = styled.span`
  position: absolute;
  top: 46%;
  right: 0.8rem;
  transform: translateY(-50%);
  font-size: 1.5rem;
  font-weight: 600;
  color: #ee1e1e;
  display: none;
`;

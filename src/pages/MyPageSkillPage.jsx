import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoginContainer from '../logIn/LogInContainer';
import MyPageEditInput from '../myPage/styledComponents/MyPageEditInput';
import MyPageEditSelect from '../myPage/styledComponents/MyPageEditSelect';
import Button from '../components/Button';

const MyPageEdit = () => {
  const [skill, setSkill] = useState('');
  const [skillList, setSkillList] = useState([
    { value: '스킬을 선택해 주세요', label: '스킬을 선택해 주세요' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Next.js', label: 'Next.js' },
    { value: 'Nest.js', label: 'Next.js' },
  ]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [mySkillList, setMySkillList] = useState(['React', 'JavaScript', 'TypeScript']);
  const navigate = useNavigate();

  const handleSkillChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedSkill(selectedOption);
  };

  const handleAddSkill = () => {
    if (selectedSkill) {
      setMySkillList([...mySkillList, selectedSkill]);
      setSelectedSkill('');
    }
  };

  const handleRemoveSkill = (removedSkill) => {
    const updatedSkillList = mySkillList.filter((skill) => skill !== removedSkill);
    setMySkillList(updatedSkillList);
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

      <SubTitle>내 현재 스킬</SubTitle>
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
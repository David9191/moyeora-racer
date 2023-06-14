import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import * as Style from './styledComponents/MyPageProfileStyle';
import profileListData from './data/profileListData';

const URL = process.env.REACT_APP_URL;

const ProfileList = () => {
  const queryClient = useQueryClient();
  const [urlList, setUrlList] = useState([
    {
      name: '나의 Github',
      url: 'https://github.com/ziuss76',
    },
  ]);

  const navigate = useNavigate();

  // 현재 나의 스킬 불러오기
  const { data: mySkillList, isLoading: isSkillLoading } = useQuery(
    'mySkillList',
    fetchMySkillList
  );

  // 현재 나의 커리어 불러오기
  const { data: myCareerList, isLoading: isCareerLoading } = useQuery(
    'myCareerList',
    fetchMyCareerList
  );

  // 현재 나의 교육 불러오기
  const { data: myEduList, isLoading: isEduLoading } = useQuery('myEduList', fetchMyEduList);

  // 현재 나의 스킬 불러오기
  async function fetchMySkillList() {
    const response = await fetch(`${URL}/api/skills/myskill`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
    });
    return response.json();
  }

  // 현재 나의 커리어 불러오기
  async function fetchMyCareerList() {
    const response = await fetch(`${URL}/api/careers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
    });
    return response.json();
  }

  // 현재 나의 교육 불러오기
  async function fetchMyEduList() {
    const response = await fetch(`${URL}/api/educations`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
    });
    return response.json();
  }

  // 경력 삭제 요청 핸들러
  async function handleRemoveCareer(careerId) {
    const response = await fetch(`${URL}/api/careers/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
      body: JSON.stringify({ id: careerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete career');
    }
  }

  // 교육 삭제 요청 핸들러
  async function handleRemoveEdu(eduId) {
    const response = await fetch(`${URL}/api/educations`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
      body: JSON.stringify({ id: eduId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete edu');
    }
  }

  const removeCareerMutation = useMutation(handleRemoveCareer, {
    onSuccess: () => {
      queryClient.invalidateQueries('myCareerList');
    },
  });

  const removeEduMutation = useMutation(handleRemoveEdu, {
    onSuccess: () => {
      queryClient.invalidateQueries('myEduList');
    },
  });

  return (
    <Style.ListContainer>
      <ul>
        {profileListData.map((item, index) => (
          <li key={index}>
            <h4>{item.title}</h4>
            {index === 0 && !isSkillLoading && mySkillList.length > 0 ? (
              <SkillButtonContainer>
                {mySkillList.map((mySkill, index) => (
                  <div className='badge' key={index}>
                    {mySkill}
                  </div>
                ))}
              </SkillButtonContainer>
            ) : index === 1 && !isCareerLoading && myCareerList.length > 0 ? (
              <CareerButtonContainer>
                {myCareerList.map((myCareer, index) => (
                  <div className='badge' key={index}>
                    <H5>{`${myCareer.company_name} ${myCareer.position} ㅣ ${myCareer.content} ㅣ ${myCareer.totalWorkingDate}`}</H5>
                    <RemoveText
                      className='remove-text'
                      onClick={() => removeCareerMutation.mutate(myCareer.id)}
                    >
                      x
                    </RemoveText>
                  </div>
                ))}
              </CareerButtonContainer>
            ) : index === 2 && !isEduLoading && myEduList.length > 0 ? (
              <CareerButtonContainer>
                {myEduList.map((myEdu, index) => (
                  <div className='badge' key={index}>
                    {myEdu.end_date === '' ? (
                      <H5>{`${myEdu.name} ${myEdu.program} ㅣ ${myEdu.description} ㅣ ${myEdu.start_date} ~ 교육중`}</H5>
                    ) : (
                      <H5>{`${myEdu.name} ${myEdu.program} ㅣ ${myEdu.description} ㅣ ${myEdu.start_date} ~ ${myEdu.end_date}`}</H5>
                    )}
                    <RemoveText
                      className='remove-text'
                      onClick={() => removeEduMutation.mutate(myEdu.id)}
                    >
                      x
                    </RemoveText>
                  </div>
                ))}
              </CareerButtonContainer>
            ) : index === 3 && urlList.length > 0 ? (
              <SkillButtonContainer>
                {urlList.map((url, index) => (
                  <div className='badge' key={index}>
                    <a href={url.url} target='_blank' rel='noopener noreferrer' key={index}>
                      {url.name}
                    </a>
                  </div>
                ))}
              </SkillButtonContainer>
            ) : (
              <p className='list-content'>{item.content}</p>
            )}
            <button
              className='list-button'
              onClick={() => {
                navigate(item.url);
              }}
            >{`+ ${item.title} 추가`}</button>
          </li>
        ))}
      </ul>
    </Style.ListContainer>
  );
};

export default ProfileList;

const SkillButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 2rem 0;

  .badge {
    position: relative;
    background-color: #ffffff;
    border: 1px solid #b9b9b9;
    padding: 8px 20px 9px 20px;
    border-radius: 2rem;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const CareerButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 2rem 0;

  .badge {
    position: relative;
    background-color: #ffffff;
    border: 1px solid #b9b9b9;
    padding: 5px 22px 6px 22px;
    margin-bottom: 1.2rem;
    border-radius: 2rem;
    font-size: 1.5rem;
    cursor: pointer;

    &:hover .remove-text {
      display: block;
    }
  }
`;

const H5 = styled.h5`
  font-weight: 400;
  font-size: 1.7rem;
  color: #424242;
  line-height: 3rem;
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

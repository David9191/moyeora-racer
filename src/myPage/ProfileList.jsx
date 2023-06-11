import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import * as Style from './styledComponents/MyPageProfileStyle';

const ProfileList = () => {
  const navigate = useNavigate();
  const profileListData = [
    {
      title: '스킬',
      content: '내 전문성을 보여줄 수 있는 스킬을 등록해 보세요.',
      url: '/mypage/skill',
    },
    {
      title: '경력',
      content: '지금 하고 있는 일, 혹은 이전에 한 일을 알려주세요.',
      url: '/mypage/career',
    },
    {
      title: '교육',
      content: '현재 혹은 이전에 다녔던 학교, 부트캠프 등 교육 기관을 입력해주세요.',
      url: '/mypage/education',
    },
    {
      title: '링크',
      content: '깃헙, 블로그, SNS등 다양한 링크로 나를 표현해보세요.',
      url: '/mypage/link',
    },
  ];
  const [mySkillList, setMySkillList] = useState(['React', 'JavaScript', 'TypeScript']);

  useEffect(() => {
    fetchMySkillList();
  }, []);

  // console.log(mySkillList);

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
  const [myEduList, setMyEduList] = useState([
    {
      eduName: '멋쟁이토끼처럼',
      program: '챗GPT 스쿨',
      startYear: '2022년',
      startMonth: '9월',
      endYear: '2023년',
      endMonth: '2월',
      isCurrentlyStudying: false,
    },
  ]);
  const [myCareerList, setMyCareerList] = useState([
    {
      companyName: '당근마켓',
      position: '프론트엔드 개발자',
      startYear: '2022년',
      startMonth: '6월',
      endYear: 'null',
      endMonth: 'null',
      isCurrentlyEmployed: true,
    },
  ]);
  const [urlList, setUrlList] = useState([
    {
      name: '지우쓰의 Github',
      url: 'https://github.com/ziuss76',
    },
  ]);
  return (
    <Style.ListContainer>
      <ul>
        {profileListData.map((item, index) => (
          <li key={index}>
            <h4>{item.title}</h4>
            {index === 0 && mySkillList.length > 0 ? (
              <SkillButtonContainer>
                {mySkillList.map((mySkill, index) => (
                  <div className='badge' key={index}>
                    {mySkill}
                  </div>
                ))}
              </SkillButtonContainer>
            ) : index === 1 && myCareerList.length > 0 ? (
              <SkillButtonContainer>
                {myCareerList.map((myCareer, index) => (
                  <div className='careerinfo' key={index}>
                    {myCareer.isCurrentlyEmployed ? (
                      <H5>{`${myCareer.companyName} ${myCareer.position} ㅣ ${myCareer.startYear} ${myCareer.startMonth} ~ 재직중`}</H5>
                    ) : (
                      <H5>{`${myCareer.companyName} ${myCareer.position} ㅣ ${myCareer.startYear} ${myCareer.startMonth} ~ ${myCareer.endYear} ${myCareer.endMonth}`}</H5>
                    )}
                  </div>
                ))}
              </SkillButtonContainer>
            ) : index === 2 && myEduList.length > 0 ? (
              <SkillButtonContainer>
                {myEduList.map((myEdu, index) => (
                  <div className='eduinfo' key={index}>
                    {myEdu.isCurrentlyStudying ? (
                      <H5>{`${myEdu.eduName} ${myEdu.program} ㅣ ${myEdu.startYear} ${myEdu.startMonth} ~ 현재 진행중`}</H5>
                    ) : (
                      <H5>{`${myEdu.eduName} ${myEdu.program} ㅣ ${myEdu.startYear} ${myEdu.startMonth} ~ ${myEdu.endYear} ${myEdu.endMonth}`}</H5>
                    )}
                  </div>
                ))}
              </SkillButtonContainer>
            ) : index === 3 && urlList.length > 0 ? (
              <SkillButtonContainer>
                {urlList.map((url, index) => (
                  <div className='badge' key={index}>
                    <a href={url.url} target='_blank' key={index}>
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

const H5 = styled.h5`
  font-weight: 400;
  font-size: 1.7rem;
  color: #424242;
  line-height: 3rem;
`;

import styled from 'styled-components';
import SearchResultBar from '../search/components/SearchResultBar';
import { Wrapper } from '../search/styledComponents/pageCommonStyle';
import RankingContent from '../search/components/RankingContent';
import SearchResultProfile from '../search/components/SearchResultProfile';
import { useState } from 'react';
import RegisterQuestion from '../search/components/RegisterQuestion';
import profileData from '../search/components/searchProfile.json';
import SearchResultQnA from '../search/components/SearchResultQnA';
import SearchResultPost from '../search/components/SearchResultPost';
import postData from '../community/data/getResData';
const SearchPage = () => {
  const [menu, setMenu] = useState(1);
  const handleMenu = (menu) => {
    setMenu(menu);
  };
  //menu === 1 ?전체보기(프로필 5개, 게시물 10개, 레이서 Q&A 10개)
  //menu === 2? 프로필
  //menu === 3? 게시물
  //menu === 4? 레이서 Q&A
  const slicePfofileData = profileData.slice(0, 3);
  const slicePostData = postData.slice(0, 5);

  return (
    <>
      <SearchResultBar receiveMenu={handleMenu} />
      <Container>
        {menu === 1 ? (
          <Wrapper style={{ marginTop: '22rem' }}>
            <div>
              <SearchResultProfile data={slicePfofileData} receiveMenu={handleMenu} />
              <SearchResultPost data={slicePostData} receiveMenu={handleMenu} />
              <SearchResultQnA data={slicePostData} receiveMenu={handleMenu} />
            </div>
            <RankingContent />
          </Wrapper>
        ) : menu === 2 ? (
          <ProfileWrapper style={{ marginTop: '22rem' }}>
            <SearchResultProfile data={profileData} />
          </ProfileWrapper>
        ) : menu === 3 ? (
          <Wrapper style={{ marginTop: '22rem' }}>
            <SearchResultPost data={postData} />
            <RankingContent />
          </Wrapper>
        ) : (
          <Wrapper style={{ marginTop: '22rem' }}>
            <SearchResultQnA data={postData} />
            <RegisterQuestion />
          </Wrapper>
        )}
      </Container>
    </>
  );
};
export default SearchPage;
const Container = styled.div`
  width: 100%;
  background: #f0f1f3;
`;

const ProfileWrapper = styled.div`
  width: 1024px;
  height: 100%;
  display: flex;
  margin-top: 6rem;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
`;

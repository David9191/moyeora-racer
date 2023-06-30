import { useState } from 'react';
import styled from 'styled-components';
import { categories } from '../community/categoryData';
import Category from '../community/Category';
import SearchBar from '../community/SearchBar';
import PostList from '../community/PostList';
import RecommendPost from '../community/RecommendPost';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
const BASE_URL = process.env.REACT_APP_URL;

const CommunityPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0].id
  );
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async () => {
    const response = await fetch(
      `${BASE_URL}/api/boards/${selectedCategoryId}?page=0&size=100`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem('userToken')}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('게시글을 불러오는데 실패했습니다.');
    }

    const result = await response.json();
    return result.objArr;
  };

  const { data, isLoading, isError, error } = useQuery(
    ['posts', selectedCategoryId],
    fetchPosts,
    {
      // 페이지네이션을 위한 query key 변경
      getNextPageParam: (lastPage, allPages) => {
        // 현재 페이지가 마지막 페이지가 아니라면 다음 페이지 번호를 반환하고,
        // 마지막 페이지라면 null을 반환하여 페이지네이션을 종료.
        return lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : null;
      }
    }
  );

  if (isError) {
    return (
      <Status>
        {error.message}⚠️
        <div>
          모여라레이서는 회원 전용 서비스입니다! <br />
          혹시 로그인을 깜빡하셨나요?
          <Link to="/login">
            <Button value="로그인하기" color="darkPurple" />
          </Link>
        </div>
      </Status>
    );
  }

  if (isLoading) {
    return <Status>Loading...⏳</Status>;
  }

  return (
    <CommunityContainer>
      <Category
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
      <PostContainer>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <RecommendPost
          searchTerm={searchTerm}
          selectedCategoryId={selectedCategoryId}
          data={data}
        />
        <PostList
          selectedCategoryId={selectedCategoryId}
          data={data}
          searchTerm={searchTerm}
        />
      </PostContainer>
    </CommunityContainer>
  );
};

export default CommunityPage;

const CommunityContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;

  max-width: 1024px;
  padding-top: 60px;
  margin: 0 auto;
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 38px 20px 0;
  max-width: 738px;
  width: 100%;
`;

export const Status = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  font-size: 1.6rem;
  color: #424242;
  background-color: #f2f0fa;

  div {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 600;
    line-height: 3.4rem;
    padding-top: 12px;
    color: #47424b;
  }
`;

import * as Style from './styledComponents/MyPagePostStyle';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
const URL = process.env.REACT_APP_URL;

const MyPostList = () => {
  const navigate = useNavigate();
  const [myPostListData, setMyPostListData] = useState([
    {
      title: '미쳐버린 제목',
      content:
        '유익함이 폭발한다 개발자라면 이제는 꼭 알아야 하는 내용ㅋㅋ 이걸 모르는 개발자가 타이어보다 싸다! 유익함이 폭발한다 개발자라면 이제는 꼭 알아야 하는 내용ㅋㅋ 이걸 모르는 개발자가 타이어보다 싸다! 유익함이 폭발한다 개발자라면 이제는 꼭 알아야 하는 내용ㅋㅋ 이걸 모르는 개발자가 타이어보다 싸다!',
      comment_cnt: 5,
      like_cnt: 60,
      view_cnt: 100,
    },
    {
      title: '맛깔나는 제목',
      content:
        '재미가 폭발한다 개발자라면 이제는 꼭 맛봐야 하는 내용ㅋㅋ 이걸 모르는 개발자가 신발보다 싸다! 재미가 폭발한다 개발자라면 이제는 꼭 맛봐야 하는 내용ㅋㅋ 이걸 모르는 개발자가 신발보다 싸다! 재미가 폭발한다 개발자라면 이제는 꼭 맛봐야 하는 내용ㅋㅋ 이걸 모르는 개발자가 신발보다 싸다!',
      comment_cnt: 5,
      like_cnt: 60,
      view_cnt: 100,
    },
    {
      title: '정신나간 제목',
      content:
        '멋짐이 폭발한다 개발자라면 이제는 꼭 배워야 하는 내용ㅋㅋ 이걸 모르는 개발자가 키보드보다 싸다! 멋짐이 폭발한다 개발자라면 이제는 꼭 배워야 하는 내용ㅋㅋ 이걸 모르는 개발자가 키보드보다 싸다! 멋짐이 폭발한다 개발자라면 이제는 꼭 배워야 하는 내용ㅋㅋ 이걸 모르는 개발자가 키보드보다 싸다!',
      comment_cnt: 5,
      like_cnt: 60,
      view_cnt: 100,
    },
  ]);

  // 유저가 쓴 글 가져오기
  // const myPostListDataQuery = useQuery('myPostListData', () =>
  //   fetch(`${URL}/api/users/mypage/board`, {
  //     headers: {
  //       Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
  //     },
  //   }).then((response) => response.json())
  // );

  // const myPostListData = myPostListDataQuery.data;

  // mainProfileData (유저 프로필 정보) 가져오기
  const mainProfileDataQuery = useQuery('mainProfileData', () =>
    fetch(`${URL}/api/users/mypage`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
      },
    }).then((response) => response.json())
  );

  const mainProfileData = mainProfileDataQuery.data;

  // const handleViewPostDetail = (id) => {
  //   navigate(`/community/${id}`);
  // };

  // onClick={handleViewPostDetail(item.id)} 이거 <li> 안에 넣기

  return (
    <Style.ListContainer>
      <h2>내 게시물 {myPostListData.length}</h2>
      <ul>
        {myPostListData.map((item, index) => (
          <li key={index}>
            <div className='profile-container'>
              <img src={mainProfileData.UserDetail.img_path} alt='프로필'></img>
              <div className='profile-info'>
                <h3>{mainProfileData.name}</h3>
                <p>{mainProfileData.UserDetail.position}</p>
              </div>
            </div>
            <div className='content-container'>
              <h4>{item.title}</h4>
              <p>{item.content}</p>
            </div>

            <div className='comment-like-view-container'>
              <p>댓글 {item.comment_cnt}</p>
              <div>
                <p>좋아요 {item.like_cnt}</p>
                <p>조회 {item.view_cnt} </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Style.ListContainer>
  );
};

const MyPageProfile = ({ mainProfileData }) => {
  return (
    <Style.PostContainer>
      <MyPostList mainProfileData={mainProfileData} />
    </Style.PostContainer>
  );
};

export default MyPageProfile;

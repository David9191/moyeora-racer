import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContainer from '../logIn/LogInContainer';
import Headline from '../logIn/Headline';
import LoginInput from '../logIn/LogInInput';
import LoginButton from '../logIn/LogInButton';
import OrLineText from '../logIn/OrLine';
import LittleText from '../logIn/LittleText';
import SigninAccordion from '../signIn/SignInAccordion';
import { useMutation } from 'react-query';

const Signin = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLittleText, setShowLittleText] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const signinMutation = useMutation(async () => {
    const url = 'http://15.164.221.244:5000/api/users/register';
    const data = {
      name: userName,
      email: email,
      password: password,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log(responseData);

    if (response.ok) {
      return responseData;
    } else {
      throw new Error(responseData.message);
    }
  });

  const handleSignin = async () => {
    // 이메일 형식 및 비밀번호 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      setErrorMessage('이메일과 비밀번호 형식을 확인해 주세요!');
      return;
    }
    await signinMutation.mutateAsync();
  };

  useEffect(() => {
    if (errorMessage) {
      setShowLittleText(true);
      const timer = setTimeout(() => {
        setErrorMessage('');
        setShowLittleText(false);
      }, 1500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [errorMessage]);

  if (signinMutation.isSuccess) {
    navigate('/login');
  }

  return (
    <LoginContainer>
      <Headline title='엘리스 갱스터 회원 가입 🕶️' />
      <LoginButton color='white' value='구글계정으로 시작하기' />
      <OrLineText text='또는' />
      <SigninAccordion>
        <LoginInput
          title='이름'
          type='text'
          placeholder='이름 입력'
          name='userName'
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
        <LoginInput
          title='이메일'
          type='text'
          placeholder='이메일 입력'
          name='userEmail'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <LoginInput
          title='비밀번호'
          type='password'
          placeholder='영문, 숫자 포함 8자 이상'
          name='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <LoginButton color='darkPurple' value='회원가입' onClick={handleSignin} />
      </SigninAccordion>

      {showLittleText ? (
        <LittleText wiggle text={errorMessage} />
      ) : (
        <LittleText
          wiggle
          text='이미 회원이신가요? 로그인하기'
          onClick={() => {
            navigate('/login');
          }}
        />
      )}
    </LoginContainer>
  );
};

export default Signin;

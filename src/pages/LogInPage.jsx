import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import LoginContainer from '../logIn/LogInContainer';
import Headline from '../logIn/Headline';
import LoginInput from '../logIn/LogInInput';
import LoginButton from '../logIn/LogInButton';
import OrLineText from '../logIn/OrLine';
import LittleText from '../logIn/LittleText';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showLittleText, setShowLittleText] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginMutation.mutateAsync();
  };

  useEffect(() => {
    if (sessionStorage.getItem('userToken')) {
      navigate('/community/post/free');
    }
  }, [navigate]);

  useEffect(() => {
    if (message) {
      setShowLittleText(true);
      const timer = setTimeout(() => {
        setMessage('');
        setShowLittleText(false);
      }, 1500);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowLittleText(false);
    }
  }, [message]);

  const loginMutation = useMutation(
    async () => {
      const url = 'http://15.164.221.244:5000/api/users/login';
      const data = {
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
      return responseData; // 토큰 반환
    },
    {
      onSuccess: (data) => {
        const { token, message: responseMessage } = data;
        if (responseMessage === '로그인에 성공하셨습니다!') {
          sessionStorage.setItem('userToken', token);
          navigate('/community/post/free');
        } else {
          setMessage(responseMessage);
        }
      },
    }
  );

  return (
    <LoginContainer>
      <Headline title='로그인' />
      <LoginInput
        title='이메일'
        type='text'
        placeholder='이메일 입력'
        name='userEmail'
        onChange={(e) => {
          e.preventDefault();
          setEmail(e.target.value);
        }}
        value={email}
      />
      <LoginInput
        title='비밀번호'
        type='password'
        placeholder='비밀번호 입력'
        name='password'
        onChange={(e) => {
          e.preventDefault();
          setPassword(e.target.value);
        }}
        value={password}
      />
      <LoginButton color='darkPurple' value='이메일로 계속하기' onClick={handleLogin} />
      <OrLineText text='또는' />
      <LoginButton color='white' value='구글계정으로 로그인' />
      {showLittleText ? (
        <LittleText wiggle text={message} />
      ) : (
        <Link to='/quiz'>
          <LittleText wiggle text='아직 회원이 아니신가요? 3초 만에 가입하기' />
        </Link>
      )}
    </LoginContainer>
  );
};

export default Login;

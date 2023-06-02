import styled from 'styled-components';

const LoginButton = ({ value, color }) => {
  let ButtonComponent;

  switch (color) {
    case 'darkPurple':
      ButtonComponent = DarkPurpleButton;
      break;
    case 'lightPurple':
      ButtonComponent = LightPurpleButton;
      break;
    case 'white':
      ButtonComponent = WhiteButton;
      break;
    default:
      ButtonComponent = DarkPurpleButton;
      break;
  }

  return (
    <div>
      <ButtonComponent color={color}>{value}</ButtonComponent>
    </div>
  );
};

export default LoginButton;

const BaseButton = styled.button`
  display: inline-block;
  width: 35.2rem;
  height: 48px;
  margin-top: 2.5rem;
  border-radius: 1.2rem;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  text-align: center;

  color: ${({ color }) => (color === 'white' ? '#242424' : '#ffffff')};

  background: ${({ color }) =>
    color === 'darkPurple' ? '#7353ea' : color === 'lightPurple' ? '#d6c9ff' : '#ffffff'};

  &:hover {
    background: ${({ color }) =>
      color === 'darkPurple' ? '#5e3de4' : color === 'lightPurple' ? '#c5b4fc' : '#f1f1f1'};
    cursor: pointer;
  }

  &:active {
    background: ${({ color }) =>
      color === 'darkPurple' ? '#532eda' : color === 'lightPurple' ? '#b39cfc' : '#eaeaea'};
  }
`;
const DarkPurpleButton = styled(BaseButton)``;
const LightPurpleButton = styled(BaseButton)``;
const WhiteButton = styled(BaseButton)`
  border: 1px solid #424242;
  padding: 8px 21px 9px 21px;
`;

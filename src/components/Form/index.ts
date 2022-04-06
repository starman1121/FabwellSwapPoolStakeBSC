import styled from 'styled-components';

//   min-height: calc(100vh - ${(props) => props.theme.topBarSize * 2}px);
export const Form = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top:  0px;
  padding-bottom: 3px;
  position: relative;
  width: 100%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
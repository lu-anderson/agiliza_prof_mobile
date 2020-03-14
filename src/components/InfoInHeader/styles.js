import styled from 'styled-components/native';

import colors from '../../Pages/colors'

export const Container = styled.View`
  flex-direction: row;  
  height: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${props => (props.color ? props.color : colors.primary)};
  padding: 5px;
`;

export const Text = styled.Text`
    color: #FFF;
    font-size: 12px;
`

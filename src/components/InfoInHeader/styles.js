import styled from 'styled-components/native';

import colors from '../../Pages/colors'

export const Container = styled.View`
  flex-direction: row;  
  height: 30px;
  background-color: ${colors.danger};
  padding: 5px;
`;

export const Text = styled.Text`
    color: #FFF;
    font-size: 12px;
`

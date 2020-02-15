import styled from 'styled-components/native';

import colors from '../colors'

export const Container = styled.View`  
  background-color: #f2f2f2;
`;



export const SectionRow = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom-width: 0.5;
    border-bottom-color: #f2f2f2;
    padding: 10px;
    height: 80px;
    width: 100%;
    background-color: #FFF;
    z-index: 2;
`

export const ContainerIcon = styled.View`
    align-items: center;
    flex-direction: row;
`

export const Text = styled.Text`
    margin-left: 15px;
    font-size: 16px;
    color: ${colors.danger}
`

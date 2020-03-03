import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const ViewSubTitle = styled.View`
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  flex-direction: column;
`

export const View = styled.View`
  align-items: flex-start;
  justify-content: center;
  flex: 2;
  flex-direction: column;
`

export const ContainerDiaries = styled.View`
    margin: 5px;
    padding: 5px;
    border-left-width: 10px;
    border-bottom-left-radius: 5;
    border-top-left-radius: 5;
    
    border-left-color: ${props => props.color};
` 

export const ContainerSubTitle = styled.View`
    flex: 1;
`

export const AlignRowSubTitle = styled.View`
    flex: 1;
    flex-direction: row;
`

export const SubTitle = styled.View`
  margin-left: 5px;
  border-radius: 5;
  height: 20px;
  width: 100px;
`

export const Line = styled.View`
    width: 90%;
    margin: 5px 15px;
    border: 0.5px;
    border-color: #D2D2D2;
`

export const DateText = styled.Text`
    font-size: 20;
`
export const Text = styled.Text`    
    font-size: 16;
    color: #6c757d;
`

export const ContainerHeaderText = styled.View`
    margin-top: 20px;
    flex: 1;
    align-items: center;
` 
export const HeaderText = styled.Text`    
    font-size: 20;
    font-weight: bold;
`

export const TextSubTitle = styled.Text`
    flex: 1;
    margin: 5px;
    font-size: 16;

`

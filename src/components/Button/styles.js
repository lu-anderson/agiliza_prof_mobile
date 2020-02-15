import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: ${props => {switch(props.size){
    case 'small':
      return 100
    case 'medium':
      return 150;
    case 'large':
      return 300
    default :
      return 150      
  }}};
  height: 50;
  margin: 5px;
  border-radius: 5px;
  background: ${props => (props.color ? props.color : 'transparent')};
`;

export const Text = styled.Text`
  font-size: 20;
  color: ${props => (props.color ? props.color : '#000')};
`;

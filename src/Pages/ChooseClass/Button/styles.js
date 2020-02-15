import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40;
  margin: 5px;
  border-radius: 5px;
  background: ${props => (props.color ? props.color : 'transparent')};
`;

export const Text = styled.Text`
  font-size: 20;
  color: ${props => (props.color ? props.color : '#000')};
`;

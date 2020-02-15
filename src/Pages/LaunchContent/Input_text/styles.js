import styled from 'styled-components/native';
import colors from '../../colors'

function setColorStatus(status){
	if(status === 'savedInRealm'){
		return colors.secondary
	}else if(status === 'savedInMongo'){
		return colors.warning
	}else if(status === "savedInSigEduca"){
		return colors.sucess
	}else{
		return colors.primary
	}
}

export const Input = styled.TextInput`
  width: 100%;
  border: 1px;
  border-color: ${props => setColorStatus(props.status)};
  border-radius: 5;
`;

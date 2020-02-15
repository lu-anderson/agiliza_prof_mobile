import styled from 'styled-components/native';

import colors from '../colors'

export const ScrollView = styled.ScrollView``

export const Container = styled.View`
	flex: 1;
`

export const ContainerLogo = styled.View`
	margin-top: 50px;
	flex: 1;
	align-items: center;
	justify-content: flex-end;
`

export const ContainerInputs = styled.View`
	flex: 2;
	margin-top: 40px;
	padding: 0 50px;
`

export const InputArea = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-bottom: 5px;
	border: 1px;
	border-color: ${colors.primary};
	border-radius: 10px;
	padding-left: 20px;
` 

export const Input = styled.TextInput`
	flex: 1;
`

export const ContainerIcon = styled.TouchableOpacity`
	padding-right: 10px;
`



export const Logo = styled.Image`
	width: 155;
	height: 120;
`

export const Button = styled.TouchableOpacity`
	background-color: ${colors.primary};
	margin-top: 10px;
	border-radius: 10px;
	height: 55px;
	align-items: center;
	justify-content: center;
`

export const Text = styled.Text`
	color: #fff;
	font-size: 20px;
`

export const ErrorText = styled.Text`
	color: ${colors.danger};
	font-size: 12;
`


export const Loading = styled.ActivityIndicator.attrs({
	color: colors.primary
})`
	margin-top: 10px;
`
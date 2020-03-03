import React, {useState} from 'react'
import logoBlue from '../../imgs/logoBlue.png'

import {saveUser} from '../../_services/auth'
import api from '../../_services/api'

import Icon from 'react-native-vector-icons/FontAwesome'
  
import { 
	ScrollView,
	Container, 
	ContainerLogo,
	ContainerInputs,
	InputArea,
	ContainerIcon,
	Logo,
	Input,
	Button,
	Text,
	Loading,
	ErrorText
} from './styles';

const Login = props => {
	
	const [login, setLogin] = useState()
	
	const [password, setPassword] = useState()

	const [loading, setLoading] = useState(false)

	const [error, setError] = useState("")

	const [showPassword, setShowPassword] = useState({
		icon: 'eye-slash',
		show: false,
	})

	function changeShowPassword(){
		if(showPassword.show){
			setShowPassword({
				icon: 'eye-slash',
				show: !showPassword.show,
			})
		}else{
			setShowPassword({
				icon: 'eye',
				show: !showPassword.show,
			})
		}
	}

	async function submit(){
		setLoading(true)
		try {
			const {data} = await api.post('/auth', {
				loginSigEduca: login,
				passwordSigEduca: password
			})
			await saveUser(data.token)
			setLoading(false)
			props.navigation.push('ChooseWhatToDo')	
		} catch (error) {
			console.log('error')
			console.log(error.response.data)
			if(error.response.data.userError){
				setError(error.response.data.userError)
			}
			if(error.response.data.passwordError){
				setError(error.response.data.passwordError)
			}			
			setLoading(false)			
		}		
		
	}

	return (
		<ScrollView keyboardShouldPersistTaps="handled">
		<Container>
			<ContainerLogo>
				<Logo 
					source={logoBlue}
					resizeMode="contain"
			
				/>
			</ContainerLogo>
			<ContainerInputs>
				<InputArea>
					<Input 
						keyboardType="numeric"
						placeholderTextColor={'black'}
						placeholder="Login do SigEduca"
						value={login}
						onChangeText={setLogin}
					/>					
				</InputArea>
				<InputArea>
					<Input 
						placeholderTextColor={'black'}
						placeholder="Senha do SigEduca"
						secureTextEntry = {!showPassword.show}
						value={password}
						onChangeText={setPassword}
					/>
					<ContainerIcon
						onPress={changeShowPassword}
					>
						<Icon 
								name={showPassword.icon}
								size={25} 
								color="black"
						/>
					</ContainerIcon>
				</InputArea>
				{!!error && <ErrorText>{error}</ErrorText>}
				

				{loading ?
					<Loading size="large"/>
				:
					<Button
						onPress={submit}
					>
						<Text>
							Entrar
						</Text>
					</Button>
				}
			</ContainerInputs>			
		</Container>
		</ScrollView>
)}


Login.navigationOptions  = () => ({
	headerRight: null,
	headerLeft: null
});

export default Login

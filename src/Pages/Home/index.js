import React, {useEffect} from 'react'

import {Conteiner, ConteinerBtnLogin} from './styles'
import Button from '../../components/Button'
const Home = props => {


	useEffect(() => {
		if(props.userLogged){
			props.requestClassesInRealm()
			props.navigation.navigate('ChooseWhatToDo')
		}
	}, [])

	return (
		<Conteiner>		
			<Button 
				size="medium"
				color="#007bff"
				onClick={() => props.navigation.navigate('Login')}
			>
				Login
			</Button>

			<Button 
				size="medium"
				color="#007bff"
				onClick={() => props.navigation.navigate('Register')}
			>
				Cadastre-se
			</Button>
		</Conteiner>
	)
}

Home.navigationOptions = props => ({
  	headerRight: () => (
		<ConteinerBtnLogin>
			<Button 
				size="small"
				color="#fff"
				onClick={() => props.navigation.push('Login')}
			>
				Login
			</Button>
		</ConteinerBtnLogin>    
  	),
});

export default Home

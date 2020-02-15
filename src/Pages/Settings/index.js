import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {View, TouchableOpacity} from 'react-native'

import {
	Container,
	SectionRow,
	ContainerIcon,
	Text
} from './styles'

import {singOut} from '../../_services/auth'

const Settings = props => {

	async function callSingOut(){
		await singOut()
		props.navigation.navigate('Home')
	}
	

	return (
		<Container style={{elevation: 0}}>
			<SectionRow style={{elevation: 5}}>				
				<ContainerIcon>					
					<Text>
						65 996743426
					</Text>
				</ContainerIcon>
				<Icon name="whatsapp" size={30} color="#28a745"/>				
			</SectionRow>
			<SectionRow onPress={callSingOut} style={{elevation: 5}}>
				<ContainerIcon>					
					<Text>
						Sair
					</Text>
				</ContainerIcon>
				<Icon name="logout" size={30} color="#dc3545"/>
			</SectionRow>
			
		</Container>
	)
}

Settings.navigationOptions = props => ({	
	headerRight:  () => <View style={{padding: 10, flex: 1}}>
							<TouchableOpacity onPress={ () => props.navigation.goBack()}>
								<Icon name="menu-open" size={30} color="#FFF"/>
							</TouchableOpacity>
						</View>
})

export default Settings

/*<ReactNativeSettingsPage>
			<SectionRow text='Configurações'>
				<NavigateRow
					text='Sair'
					iconName='sign-out'
					onPressCallback={callSingOut} />
			</SectionRow>
		</ReactNativeSettingsPage>*/
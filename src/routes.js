import React, {useEffect, useState} from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import {View, ActivityIndicator, StatusBar} from 'react-native'

import {setNavigator} from './_services/navigation'

import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ChooseWhatToDo from './Pages/ChooseWhatToDo'
import ChooseClass from './Pages/ChooseClass'
import LaunchPresence from './Pages/LaunchPresence'
import LaunchEvaluation from './Pages/LaunchEvaluation'
import LaunchContent from './Pages/LaunchContent'
import ShowResume from './Pages/ShowResume'
import Settings from './Pages/Settings'

import Logo from './components/Logo'
import HeaderRigth from './components/HeaderRigth'
import HeaderTitle from './components/HeaderTitle'

import { isAuthenticated } from './_services/auth'

const AuthLoading = props => {

  

  useEffect(() => {

    async function auth(){
     
      const loged = await isAuthenticated()          
      
      props.navigation.navigate(loged ? 'Aplication': 'Home' )
    }    
    auth()
  }, [])
  
  return(
    <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
  )
}


const AppNavigator = createStackNavigator(
  {
    ChooseWhatToDo,
    ChooseClass,
    LaunchPresence,
    LaunchEvaluation,
    ShowResume,
    LaunchContent,
    Settings
  },
  {
    initialRouteName: 'ChooseWhatToDo',
    defaultNavigationOptions: ({ navigation }) => ( {      
      headerStyle: {   
        backgroundColor: '#007bff',
      },
      headerTitleStyle: {
        flex: 1,
      },
      
      headerTitle: <HeaderTitle route={navigation.getParam('headerTitle')}/>,
      headerLeft: () =>  <Logo onPress={() => navigation.navigate('ChooseWhatToDo')}/>,
      headerRight: () => <HeaderRigth onPress={() => navigation.push('Settings')}/>
    }),
    headerMode: 'float',
    headerLayoutPreset: 'left'
  },  
)

const AppAuth = createStackNavigator(
  {
    Home,
    Login,
    Register
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ( {      
      headerStyle: {   
        backgroundColor: '#007bff',
      },     
      headerLeft: () =>  <Logo onPress={() => navigation.navigate('Home')}/>,
      headerRight: () => <HeaderRigth onPress={() => navigation.push('Settings')}/>
    }),
  }, 
  
)


const AppSwith = createSwitchNavigator(
  {
    AuthLoading,
    AppAuth,
    Aplication: AppNavigator
  },
  {
    initialRouteName: 'AuthLoading'    
  }

)

const Navigation = createAppContainer(AppSwith)


export default App = () => { 
  return ( 
    <>    
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />
      <Navigation ref={nav => {
         setNavigator(nav)
        }}/>
    </>  
  )
}





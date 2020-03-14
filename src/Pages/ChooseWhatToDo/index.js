import React, {useRef, useEffect, useState} from 'react'
import BackgroundFetch from "react-native-background-fetch"
import {useNetInfo} from "@react-native-community/netinfo"

import Sync from '../../utils/Sync'

import Toast from 'react-native-easy-toast';

import {HeaderText} from '../globalStyles'
import {Container, ContainerBtns, ContainerText, ContainerScroll, Loading} from './styles'
import ModalLoading from './ModalLoading'
import Button from '../../components/Button'
import colors from '../colors'

import getRealm from '../../offline/realm'
import api from '../../_services/api'
import InfoInHeader from '../../components/InfoInHeader';

function setColorStatus(status){
	if(status === 'savedInRealm'){
		return colors.secondary
	}else if(status === 'savedInMongo'){
		return colors.warning
	}else if(status === "errorNotSaved"){
		return colors.danger
	}
}

let MyHeadlessTask = async (event) => {
    // Get task id from event {}:
    let taskId = event.taskId;
    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);
  
    // Perform an example HTTP request.
    // Important:  await asychronous tasks when using HeadlessJS.
    await Sync()
    console.log('[BackgroundFetch HeadlessTask]');
    console.log('DEU CERTOOOOOOOOOOOOOOOO')
  
    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish(taskId);
  }
  
  // Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

const ChooseWhatToDo = (props) => {
    const netInfo = useNetInfo()  
    const toastRef = useRef() 
    let saved = props.navigation.getParam('saved')   
    let idParam = props.navigation.getParam('id')
    
    const [user, setUser] = useState("")
    const [loading, setLoading] = useState(false)
    const [isInternet, setIsInternet] = useState(true)

    useEffect(() => {
        setLoading(true)

        BackgroundFetch.configure({
            minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
            // Android options
            forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default           
          }, async (taskId) => {
            console.log(taskId)
            console.log('Luanderson task')
            console.log(new Date())
            console.log("[js] Received background-fetch event: ", taskId);
            console.log('Call sync data')
            await Sync()
            console.log('after call sync data')
            // Required: Signal completion of your task to native code
            // If you fail to do this, the OS can terminate your app
            // or assign battery-blame for consuming too much background-time
            BackgroundFetch.finish(taskId);
          }, (error) => {
            console.log("[js] RNBackgroundFetch failed to start");
          });

        

        (async function getClassesInApi(){            
            try {               
                const realm = await getRealm()
                const userInRealm = realm.objects('User')
                setUser(userInRealm[0].name)
                const classes = realm.objects('Classes')
                if(classes.length === 0 || classes === undefined){
                    const {data} = await api.get('/classes')
                    realm.write(() =>{                   
                        for (let index = 0; index < data.length; index++) {
                            const classe = {
                                id: data[index]._id,
                                school: data[index].school,
                                displayText: data[index].displayText,
                                segment: data[index].segment,
                                students: JSON.stringify(data[index].students),
                                diaries: JSON.stringify(data[index].diaries),
                                diariesOfContent: JSON.stringify(data[index].diariesOfContents)
                            }
                            realm.create('Classes', classe, 'modified')
                        }
                    })
                }
            } catch (error) {
                console.log(error)
                console.log(error.response.data)
            }            
        })();
        
        (async function callSyncData(){           
            await Sync()            
        })();

        setTimeout(() => {
            setLoading(false)
        }, 2000)
        console.log('Montou')
        console.log(new Date())
    }, [])    

    

    useEffect(() => {
        if(saved === 'savedInRealm'){
            setTimeout(() => {
                toastRef.current.show('Salvo com sucesso (offline)', 1500)
            }, 300)            
        }

        if(saved === 'savedInMongo'){
            setTimeout(() => {
                toastRef.current.show('Salvo com sucesso (online)', 1500)
            }, 300)            
        }

        if(saved === 'errorNotSaved'){
            setTimeout(() => {
                toastRef.current.show('Erro ao salvar diários', 1500)
            }, 300)            
        }        
    },[idParam]) 

    return (        
        <Container >
            {!netInfo.isInternetReachable &&
                <InfoInHeader color={colors.danger}>Você está offline, os dados serão salvos quando conectar</InfoInHeader>
            } 
            <ContainerScroll>     
                <ContainerText style={{elevation: 5}}>
                    <HeaderText ellipsizeMode="tail" numberOfLines={1}>Olá {user},</HeaderText>
                    <HeaderText ellipsizeMode="tail" numberOfLines={1}> o que deseja fazer hoje?</HeaderText>
                    <HeaderText>Tipo {netInfo.type}</HeaderText>
                    <HeaderText>Tem conexão? {netInfo.isInternetReachable.toString()}</HeaderText>                  
                </ContainerText>  
                     
                <ContainerBtns  style={{elevation: 1}}>                   
                    <Button 
                        size="large"
                        color="#007bff"
                        textColor="#FFF"
                        onClick={() => props.navigation.push('ChooseClass', {headerTitle: 'Lançar Presença', route: 'LaunchPresence'})}
                    >
                        Lançar Presença
                    </Button>

                    <Button 
                        size="large"
                        color="#007bff"
                        textColor="#FFF"
                        onClick={() => props.navigation.push('ChooseClass', {headerTitle: 'Lancar Conteúdo', route: 'LaunchContent'})}
                    >
                        Lançar Conteúdo
                    </Button>
                    
                    <Button 
                        size="large"
                        color="#007bff"
                        textColor="#FFF"
                        onClick={() => props.navigation.push('ChooseClass', {headerTitle: 'Lançar Avaliação', route: 'LaunchEvaluation'})}
                    >
                        Lançar Avaliação
                    </Button>

                    <Button 
                        size="large"
                        color="#007bff"
                        textColor="#FFF"
                        onClick={() => props.navigation.push('ChooseClass', {headerTitle: 'Exibir Resumo', route: 'ShowResume'})}
                    >
                        Exibir resumo
                    </Button>   
                </ContainerBtns>            
                <Toast 
                    ref={toastRef} 
                    style={{backgroundColor: setColorStatus(saved)}}
                    position='top'
                    positionValue={30}
                />             
            </ContainerScroll>
            <ModalLoading visible={loading}/>
        </Container>
    )
}
export default ChooseWhatToDo
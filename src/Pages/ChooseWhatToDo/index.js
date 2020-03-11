import React, {useRef, useEffect, useState} from 'react'
import BackgroundFetch from "react-native-background-fetch"
import {useNetInfo} from "@react-native-community/netinfo"

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


const ChooseWhatToDo = (props) => {
    const netInfo = useNetInfo();   
    const toastRef = useRef() 
    let saved = props.navigation.getParam('saved')   
    let idParam = props.navigation.getParam('id')
    
    const [user, setUser] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        BackgroundFetch.configure({
            minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
            // Android options
            forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default           
          }, async (taskId) => {
            console.log(taskId)
            console.log('Luanderson task')
            console.log(new Date())
            console.log("[js] Received background-fetch event: ", taskId);
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
            let apiAvailable = await verifyIfApiAvailable()
            if(apiAvailable){                
                await syncData()  
            }            
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

    async function verifyIfApiAvailable(){
        try {
            const {data} = await api.get('/')
            if (data.OK){
                console.log('Api avaliable')
                return true
            }
        } catch (error) {
            console.log('Api not avaliable')
            return false
        }        
    }

    async function getDiariesForSaveInMongo(){
        const realm = await getRealm()
        
        const classesInRealm = realm.objects('Classes')

        let diariesForSaveInMongo = []

        classesInRealm.map(classe => {             
            const diariesInRealm = JSON.parse(classe.diaries)

            let diaries = []
            diariesInRealm.map(diary => {                    
                if(diary.status === 'savedInRealm'){
                    diaries.push({
                        ...diary, status: 'savedInMongo'                            
                    })
                }
            })

            if(diaries.length !== 0){
                diariesForSaveInMongo.push({
                    classId: classe.id,
                    diaries
                })
            }               
        })
        return diariesForSaveInMongo        
    }

    async function getDiariesOfContentsForSaveInMongo(){
        const realm = await getRealm()
        
        const classesInRealm = realm.objects('Classes')

        let diariesOfContentsForSaveInMongo = []

        classesInRealm.map(classe => {     
            const diariesOfContentsInRealm = JSON.parse(classe.diariesOfContent)

            let diariesOfContents = []
            diariesOfContentsInRealm.map(diary => {                    
                if(diary.status === 'savedInRealm'){
                    diariesOfContents.push({
                        ...diary, status: 'savedInMongo'                            
                    })
                }
            })

            if(diariesOfContents.length !== 0){
                diariesOfContentsForSaveInMongo.push({
                    classId: classe.id,
                    diariesOfContents
                })
            }               
        })
        return diariesOfContentsForSaveInMongo        
    }
    
    async function storeDiariesInMongo(diariesForStore){
        try {
            //VERIFICAR SE PRECISA ATUALIZAR OU ARMAZENAR UM NOVO DIÁRIO
                       
            const {data} = await api.post('/diaries', {
                diariesForStore
            })
            return data.msg
        } catch (error) {
            console.log('Error')
            console.log(error.response.data)
        }        
    }

    async function storeDiariesOfContentsInMongo(diariesOfContentsForStore){
        try {
            //VERIFICAR SE PRECISA ATUALIZAR OU ARMAZENAR UM NOVO DIÁRIO  
            const {data} = await api.post('/diariesOfContents', {
                diariesOfContentsForStore
            })
            return data
        } catch (error) {
            console.log('Error')
            console.log(error.response.data)
        }        
    }

    async function updateStatusOfDiariesInRealm(classesWithDiariesForUpdate, status, finished){
        try {
            const realm = await getRealm()     

            const classesInRealm = realm.objects('Classes')    

            classesWithDiariesForUpdate.map(classe => {                    
                const indexOfClass = classesInRealm.findIndex(val => val.id === classe.classId)                
                const diariesInRealm = JSON.parse(classesInRealm[indexOfClass].diaries)
               
                classe.diaries.map(diary => {
                    const indexOfDiary = diariesInRealm.findIndex(val => val.date === diary.date)
                   
                    diariesInRealm[indexOfDiary].status = status
                    diariesInRealm[indexOfDiary].finished = finished
                    
                    realm.write(() => {
                        classesInRealm[indexOfClass].diaries = JSON.stringify(diariesInRealm)
                    })
                })
            })
        } catch (error) {
            console.log('Erro in updateStatusOfDiariesInRealm')
            console.log(error)
        }        
    }

    async function updateStatusOfDiariesOfContentsInRealm(classesWithDiariesOfContentsForUpdate, status, finished){
        try {
            const realm = await getRealm()     
            console.log(classesWithDiariesOfContentsForUpdate)
            const classesInRealm = realm.objects('Classes')    
            classesWithDiariesOfContentsForUpdate.map(classe => {                    
                const indexOfClass = classesInRealm.findIndex(val => val.id === classe.classId)         
                const diariesOfContentsInRealm = JSON.parse(classesInRealm[indexOfClass].diariesOfContent)
               
                classe.diariesOfContents.map(diary => {
                    console.log(diary)
                    const indexOfDiary = diariesOfContentsInRealm.findIndex(val => val.date === diary.date)
                    console.log(indexOfDiary)
                    console.log(diariesOfContentsInRealm[indexOfDiary].status)
                    diariesOfContentsInRealm[indexOfDiary].status = status
                    diariesOfContentsInRealm[indexOfDiary].finished = finished
                    
                    realm.write(() => {
                        classesInRealm[indexOfClass].diariesOfContent = JSON.stringify(diariesOfContentsInRealm)
                    })
                })
            })
        } catch (error) {
            console.log('Erro in updateStatusOfDiariesOfContentsInRealm')
            console.log(error)
        }        
    }

    async function getDiariesWithStatusSavedInSigEducaInMongo(){
        try {
            const {data} = await api.get('/diaries/saveInSigEduca')
            return data
        } catch (error) {
            console.log('Erro in getDiariesWithStatusSavedInSigEducaInMongo')
            console.log(error)
        }
    }

    async function getDiariesOfContentsWithStatusSavedInSigEducaInMongo(){
        try {
            const {data} = await api.get('/diariesOfContents/savedInSigEduca')
            return data
        } catch (error) {
            console.log('Error in getDiariesOfContentsWithStatusSavedInSigEducaInMongo')
            console.log(error)
        }
    }   

    async function setTagFinishedWithTrueOfDiaries(classesWithDiariesForUpdate){
        try {
            await api.put('/diaries/setFinishedWithTrue', {
                diariesForUpdate: classesWithDiariesForUpdate
            })
        } catch (error) {
            console.log('Erro in setTagFinishedWithTrueOfDiaries')
            console.log(error)
        }
    }

    async function setTagFinishedWithTrueOfDiariesOfContents(classesWithDiariesOfContentsForUpdate){
        try {
            await api.put('/diariesOfContents/setFinishedWithTrue', {
                diariesOfContentsForUpdate: classesWithDiariesOfContentsForUpdate
            })
        } catch (error) {
            console.log('Erro in setTagFinishedWithTrueOfDiariesOfContents')
            console.log(error)
        }
    }

    async function syncData(){
        console.log('Synchronizing data')
        try {   
            const diariesForSaveInRealm = await getDiariesWithStatusSavedInSigEducaInMongo()         
            if(diariesForSaveInRealm.length !== 0){
                console.log('Exist diaries for save in realm')
                await updateStatusOfDiariesInRealm(diariesForSaveInRealm, 'savedInSigEduca', true) 
                await setTagFinishedWithTrueOfDiaries(diariesForSaveInRealm)
            }
                            
            const diariesForSaveInMongo = await getDiariesForSaveInMongo()
            if(diariesForSaveInMongo.length !== 0){
                console.log('Exist diaries for save in mongo') 
                const data = await storeDiariesInMongo(diariesForSaveInMongo)                                  
                await updateStatusOfDiariesInRealm(data.diariesSaved, 'savedInMongo', false)
            } 
            
            const diariesOfContentsForSaveInRealm = await getDiariesOfContentsWithStatusSavedInSigEducaInMongo()
            if(diariesOfContentsForSaveInRealm.length !== 0){
                console.log('Exist diariesOfContents for save in realm')
                await updateStatusOfDiariesOfContentsInRealm(diariesOfContentsForSaveInRealm, 'savedInSigEduca', true)
                await setTagFinishedWithTrueOfDiariesOfContents(diariesOfContentsForSaveInRealm)
            }

            const diariesOfContentsForSaveInMongo = await getDiariesOfContentsForSaveInMongo()
            if(diariesOfContentsForSaveInMongo.length !== 0){
                console.log('Exist diariesOfContents for save in mongo')
                const data = await storeDiariesOfContentsInMongo(diariesOfContentsForSaveInMongo)
                await updateStatusOfDiariesOfContentsInRealm(data.diariesOfContentsSaved, 'savedInMongo', false)
            }

        } catch (error) {
            console.log('Erro in syncData')
            console.log(error)
        }
    }

    return (        
        <Container >
            {!netInfo.isInternetReachable &&
                <InfoInHeader/>
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
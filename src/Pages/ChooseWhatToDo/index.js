import React, {useRef, useEffect, useState} from 'react'
import {useNetInfo} from "@react-native-community/netinfo"

import Toast from 'react-native-easy-toast';

import {HeaderText} from '../globalStyles'
import {Container, ContainerBtns, ContainerText, ContainerScroll, Loading} from './styles'
import Button from '../../components/Button'
import colors from '../colors'

import getRealm from '../../offline/realm'
import api from '../../_services/api'

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
    const [existDataForSaveInMongo, setExistDataForSaveInMong] = useState(false)
    const [dataForSaveInMongo, setDataForSaveInMongo] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
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
        })() 
        
        syncData()
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


        (async function getDiariesForSaveInMongo(){
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

            if(diariesForSaveInMongo.length !== 0){
                setExistDataForSaveInMong(true)
            }
            setDataForSaveInMongo(diariesForSaveInMongo)        
        })()
    },[idParam]) 
    
    async function storeDataInMongo(){
        try {
            //VERIFICAR SE PRECISA ATUALIZAR OU ARMAZENAR UM NOVO DIÁRIO
            setLoading(true)            
            const {data} = await api.post('/diaries', {
                diariesForStore: dataForSaveInMongo
            })
            setLoading(false)
            setExistDataForSaveInMong(false)
            return data.msg
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

    async function getDiariesWithStatusSavedInSigEducaInMongo(){
        try {
            const {data} = await api.get('/diaries/saveInSigEduca')
            return data
        } catch (error) {
            console.log('Erro in getDiariesWithStatusSavedInSigEducaInMongo')
            console.log(error)
        }
    }

    async function setTagFinishedWithTrue(classesWithDiariesForUpdate){
        try {
            await api.put('/diaries/setFinishedWithTrue', {
                diariesForUpdate: classesWithDiariesForUpdate
            })
        } catch (error) {
            console.log('Erro in setTagFinishedWithTrue')
            console.log(error)
        }
    }

    async function syncData(){
        try {  
            const dataForSaveInRealm = await getDiariesWithStatusSavedInSigEducaInMongo()
            if(dataForSaveInRealm.length !== 0){
                console.log('Exist data for save in realm')
                await updateStatusOfDiariesInRealm(dataForSaveInRealm, 'savedInSigEduca', true) 
                await setTagFinishedWithTrue(dataForSaveInRealm)
            }
            
            if(existDataForSaveInMongo){
                const data = await storeDataInMongo() 
                console.log('Exist data for save in mongo')              
                await updateStatusOfDiariesInRealm(data.diariesSaved, 'savedInMongo', false)
            }            
        } catch (error) {
            console.log('Erro in syncData')
            console.log(error)
        }
    }

    return (        
        <Container > 
            <ContainerScroll>     
                <ContainerText style={{elevation: 5}}>
                    <HeaderText ellipsizeMode="tail" numberOfLines={1}>Olá {user},</HeaderText>
                    <HeaderText ellipsizeMode="tail" numberOfLines={1}> o que deseja fazer hoje?</HeaderText>
                    <HeaderText>Tipo {netInfo.type}</HeaderText>
                    <HeaderText>Tem conexão? {netInfo.isInternetReachable.toString()}</HeaderText>
                </ContainerText>  
                     
                <ContainerBtns  style={{elevation: 1}}>
                    {existDataForSaveInMongo &&                     
                        (
                            !loading ?   
                            <Button 
                                    size="large"
                                    color={colors.danger}
                                    textColor="#FFF"
                                    onClick={() => syncData()}
                            >
                                Sincronizar dados
                            </Button>
                            : 
                            <Loading size="large"/>
                        )
                    }

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
        </Container>
    )
}
export default ChooseWhatToDo
import React, {useRef, useEffect, useState} from 'react'
import {Text, View } from 'react-native'
import {useNetInfo} from "@react-native-community/netinfo";

import Toast from 'react-native-easy-toast';


import {HeaderText} from '../globalStyles'
import {Container, ContainerBtns, ContainerText, ContainerScroll} from './styles'
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

function studentsFormated(students){
    const regex = /\d+/
    
    return students.map(students => {
        const result = regex.exec(students.aluno)
        return {
                id: result[0],
                name: students.aluno.substring(10)
            }		
    })
}

const ChooseWhatToDo = (props) => {
    const netInfo = useNetInfo();   
    const toastRef = useRef() 
    let saved = props.navigation.getParam('saved')   
    let idParam = props.navigation.getParam('id')
    
    const [user, setUser] = useState("")

    useEffect(() => {
        async function getClassesInApi(){
            try {
                const realm = await getRealm()
                const userInRealm = realm.objects('User')
                setUser(userInRealm[0].name)
                const classes = realm.objects('Classes')
                if(classes.length === 0 || classes === undefined){
                    const {data} = await api.get('app/turmas')
                    realm.write(() =>{                   
                        for (let index = 0; index < data.length; index++) {
                            const classe = {
                                id: data[index]._id,
                                school: data[index].escola,
                                displayText: data[index].textoFinalDasTurmas,
                                segment: data[index].segmento,
                                students: JSON.stringify(studentsFormated(data[index].alunos)),
                                diaries: JSON.stringify(data[index].diarios),
                                diariesOfContent: JSON.stringify([])
                            }

                            const resultado = realm.create('Classes', classe, 'modified')
                            console.log(resultado)
                        }
                    })
                }
            } catch (error) {
                console.log(error)
                console.log(error.response.data)
            }            
        }

        getClassesInApi()
    }, [])

    useEffect(() => {
        if(saved === 'savedInRealm'){
            setTimeout(() => {
                toastRef.current.show('Salvo com sucesso (offline)', 1000)
            }, 300)            
        }

        if(saved === 'savedInMongo'){
            setTimeout(() => {
                toastRef.current.show('Salvo com sucesso (online)', 1000)
            }, 300)            
        }

        if(saved === 'errorNotSaved'){
            setTimeout(() => {
                toastRef.current.show('Salvo com sucesso (online)', 1000)
            }, 300)            
        }
    },[idParam])    

    return (
        
        <Container > 
            <ContainerScroll>     
                <ContainerText>
                    <HeaderText ellipsizeMode="tail" numberOfLines={1}>Olá {user},</HeaderText>
                    <HeaderText ellipsizeMode="tail" numberOfLines={1}> o que deseja fazer hoje?</HeaderText>
                    
                </ContainerText>            
                <ContainerBtns>
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
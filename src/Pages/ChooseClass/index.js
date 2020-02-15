import React, {useEffect, useState} from 'react'

import { ContainerScroll,Container, HeaderText } from '../globalStyles'
import { Button, Text } from './styles'

import Modal from './ModalWorkload'
import getRealm from '../../offline/realm'

const ChooseClass = (props) => {
    const route = props.navigation.getParam('route')
    const headerTitle = props.navigation.getParam('headerTitle')

    const [classes, setClasses] = useState([])

    const [showModalWorkload, setShowModalWorkload] = useState({visible: false, classId: ''})

    useEffect(() => {

        async function getClassesInRealm(){   
            const realm = await getRealm()

            const classesInRealm = realm.objects('Classes')

            //console.log(classesInRealm)
            let classes = []

            classesInRealm.map(classClass => {
                classes.push({
                    id: classClass.id,
                    displayText: classClass.displayText
                })
            })

            //console.log(classes)
            setClasses(classes)
        }

        getClassesInRealm()

    }, [])

    function responseModal(workload){
        const classId = showModalWorkload.classId
        setShowModalWorkload({visible: false, classId: ''})
        props.navigation.push(route , {classId, workload, route, headerTitle})
    }

    return (
        <ContainerScroll>
            <Container>           
                <HeaderText>Escolha a Turma</HeaderText>                
                {classes.map( (classes) => (
                    <Button 
                        key={classes.id}
                        onPress={
                            () => route === 'LaunchPresence' ? 
                                setShowModalWorkload({visible: true, classId: classes.id}) :
                                props.navigation.push( route , {classId: classes.id, route, headerTitle})
                        }
                    >
                    <Text>{classes.displayText}</Text>
                </Button>    
                ))}                  
            </Container>
            <Modal 
                visible={showModalWorkload.visible}
                selectWorkLoad={responseModal}
                onRequestClose={() => setShowModalWorkload({visible: false, classId: ''})}
            />
        </ContainerScroll>
    )
}

export default ChooseClass
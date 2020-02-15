import React, {useEffect, useState} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import { FlatList, BackHandler, ActivityIndicator } from 'react-native';
import Button from './Button'
import ModalLaunchContent from './ModalLaunchContent'
import ModalBackHandler from './ModalBackHandler'
import ModalSelectDate from './ModalSelectDate'
import colors from '../colors'

import { 
    Container, 
    Text, 
    ContainerText, 
    ContainerPresence, 
    Line, 
    ContainerName, 
    ContainerSafe, 
    ContainerBtns,
    SelectDate,
    ContainerIcon
} from './styles'
import CheckBox from './Checkbox'

import getRealm from '../../offline/realm'

import * as util from '../../utils'

const CheckBoxs = ({checkes, togglePresence}) => {
    if(checkes !== undefined){
        return (
            checkes.map(checkbox => {
                return (
                    <CheckBox
                        key = {checkbox.id}
                        checked={!checkbox.presence}
                        whenToToggle = {() => togglePresence(checkbox.id)}
                    />
                )
            })
        )
    }else{
       return <Text />
    }    
}

const Item = React.memo(function Item({numberOfCheckbox, name, idStudent, numberOfPresence, callTogglePresence}){
        function innitialCheckes(){
            let checkes = []
            let presences = 0
            let cont = 0
    
            if(numberOfPresence === undefined){
                presences = numberOfCheckbox
            }else{
                presences = numberOfPresence
            }
    
            for (let index = 0; index < numberOfCheckbox; index++) {
                if( cont < presences){
                    checkes.push({
                        id: index + 1,
                        presence: true
                    })
                }else{
                    checkes.push({
                        id: index + 1,
                        presence: false
                    }) 
                }
                cont++                      
            }
            return checkes
        } 

        const [checkes, setCheckes] = useState(innitialCheckes())
        const [totalOfRenders, setTotalOfRenders] = useState(0)

        useEffect(() => {
            const presences = contNumberOfPresence()
            
            if(totalOfRenders !== 0){
                callTogglePresence(idStudent, presences)
            }
            setTotalOfRenders(totalOfRenders + 1)
        }, [checkes])

        function contNumberOfPresence(){
            let numberOfPresence = 0
            for (let index = 0; index < checkes.length; index++) {
                if (checkes[index].presence){
                    numberOfPresence++
                }                
            }
            return numberOfPresence
        }

        function togglePresence(id){
            const newCheckes = [...checkes]
            const newCheckes2 = newCheckes.map(element => {
                if(element.id !== id){
                    return element
                }
                return {
                    ...element,
                    presence: !element.presence
                }
            })
            setCheckes(newCheckes2)
        }        

        function toggleAllPresences(){
            let newCheckes = [...checkes]
            newCheckes = newCheckes.map(element => {               
                return {
                    ...element,
                    presence: !element.presence
                }
            })            
            setCheckes(newCheckes)
        }
        return (
            <ContainerPresence>
                <ContainerName onPress={()=> toggleAllPresences()}>
                    <Text>{name}</Text>
                </ContainerName> 
                {checkes.length === numberOfCheckbox &&
                    <CheckBoxs
                        checkes={checkes}
                        togglePresence={ (id) => togglePresence(id)}
                    />                        
                }
            </ContainerPresence>
        )
})



const LaunchPresence = (props) => {  
    const idClass = props.navigation.getParam('classId')
    const workload =props.navigation.getParam('workload') 
    const today = new Date

    const [students, setStudents] = useState([])

    const [textClassDisplay, setTextClassDisplay] = useState('')

    const [diaries, setDiaries] = useState([])

    useEffect(() => {
        console.log('use diaries')
    }, [diaries])

    const [loading, setLoading] = useState(true)

    const [date, setDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate())) 
    
    const [showModalLaunchContent, setShowModalLaunchContent] = useState(false)
    const [showModalBackHandler, setShowModalBackHandler] = useState(false)
    const [showModalSelectDate, setShowModalSelectDate] = useState(false)
    const [content, setContent] = useState('')


    const [blockBtnContent, setBlockBtnContent] = useState(false)    

    function getStudentsForLaunchPresence(diaries, date, students){
        const existDiary = diaries.findIndex(diary => diary.date.getTime() === date.getTime())

        if(existDiary === -1){
            return students
        }else{
            return diaries[existDiary].students
        }
    }   
    
    function verifyIfContentIsLaunched(diariesOfContent, date){
        const existDiaryOfContent = diariesOfContent.findIndex(diary => diary.date.getTime() === date.getTime())

        if(existDiaryOfContent !== -1){
            setBlockBtnContent(true)
        }else{
            setBlockBtnContent(false)
        }
    }   

    function onBackPress() {
        setShowModalBackHandler(true)
        return true
    }

    function setDiariesWithDateStringToDateObject(diaries) {
        let newDiaries = []

        for (let index = 0; index < diaries.length; index++) {
            newDiaries.push({
                ...diaries[index],
                date: new Date(diaries[index].date),
                
            })            
        }

        return newDiaries
    }

    useEffect(() => {
        async function getDataInRealm(){
            try {
                const realm = await getRealm()

                const classClass = realm.objectForPrimaryKey('Classes', idClass)

                const diariesInRealm = JSON.parse(classClass.diaries)

                const diariesWithDateObject = setDiariesWithDateStringToDateObject(diariesInRealm)
                
                const diariesOfContentInRealm = JSON.parse(classClass.diariesOfContent)

                const diariesOfContentWithDateObject = setDiariesWithDateStringToDateObject(diariesOfContentInRealm) 

                verifyIfContentIsLaunched(diariesOfContentWithDateObject, date)

                const students = getStudentsForLaunchPresence(diariesWithDateObject, date, JSON.parse(classClass.students))

                setDiaries(diariesWithDateObject)
                setStudents(markPresenceToAllStudents(students, workload))
                setLoading(false)
                setTextClassDisplay(classClass.displayText) 
                
                realm.close()
                
            } catch (error) {
                console.log(error)
            }            
        }

        getDataInRealm()
        

    }, [date])

    useEffect(() => {        

        BackHandler.addEventListener('hardwareBackPress', onBackPress)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }
    },[])

    function togglePresence(idStudent, numberOfPresence) {
        setStudents(markPresence(students, idStudent, numberOfPresence))
    } 

    function markPresence(students, idStudent, numberOfPresence) {
        return students.map((student) => {
            if ( student.id !== idStudent) { 
                return student
            }
            return {
                ...student,
                presence: numberOfPresence
            }
        })
    }

    function markPresenceToAllStudents(students, workload){
        let studentsWithPresence = []
        students.map(student => {
            
          if(student.presence === undefined){
            studentsWithPresence = [...studentsWithPresence, {
              id: student.id,
              name: student.name,
              presence: workload
            }]
          }else {
            let newPresence = student.presence > workload ? workload : student.presence
            studentsWithPresence.push({
              id: student.id,
              name: student.name,
              presence: newPresence
            })
          }
          
       })    
        return studentsWithPresence
    }


    function saveDiary(diaries, newDiary){
        const indexDiary = diaries.findIndex(diary => diary.date === newDiary.date)

        if(indexDiary !== -1){
            return diaries.map((diary, index) => {
                if(index === indexDiary){
                    return newDiary
                }else{
                    return diary
                }
            })
        }else{
            return diaries = [...diaries, newDiary]
        }
    }
    
    async function saveDiaryInRealm(diary, idClass){
        try {
            const realm = await getRealm()
    
            const classe = realm.objectForPrimaryKey('Classes', idClass)	
            
            const diaries = JSON.parse(classe.diaries)
        
            const newDiaries = saveDiary(diaries, diary)
        
            realm.write(() => {
                classe.diaries = JSON.stringify(newDiaries)
            })
            //realm.close()
            
        } catch (error) {
            console.log('Erro in saveDiaryInRealm')
            console.log('Parans')
            console.log('diary', diary)
            console.log('idClass', idClass)
            console.log(error)
        }        
    }

    async function finalizarLancarPresenca(){
        const diary = {
            date,
			students,
            workload,
            status: 'savedInRealm'
        }

        //Verificar se esta online e então mandar uma requisição para salvar online
        await saveDiaryInRealm(JSON.parse(JSON.stringify(diary)), idClass)
        await props.navigation.navigate('ChooseWhatToDo', {saved: 'savedInRealm', id: Math.random()})
    }


    async function addDiaryOfContentInRealm(newDiariesOfContent, idClass){
        const realm = await getRealm()
        console.log('addDiaryOfContentInRealm')
        const classe = realm.objectForPrimaryKey('Classes', idClass)

        const diariesOfContentInRealm = JSON.parse(classe.diariesOfContent)

        const diariesOfContent = [...diariesOfContentInRealm, ...newDiariesOfContent]
    
        realm.write(() => {
            classe.diariesOfContent = JSON.stringify(diariesOfContent)
        })

        realm.close()
    }


    function responseModalContent(response){
        const newDiariesOfContent = [{
            date,
            content,
            status: "savedInRealm"
        }]
        switch (response) {
            case 'save':
                addDiaryOfContentInRealm(newDiariesOfContent, idClass)
                setBlockBtnContent(true)
            case 'cancel':
                setShowModalLaunchContent(false)
            case 'close':
                setShowModalLaunchContent(false)
            default:
                break;
        }
    }

    async function responseModalBack(response){ 
        if(response === 'save'){
            setShowModalBackHandler(false)
            await finalizarLancarPresenca()
        }
        
        if(response === 'no'){
            setShowModalBackHandler(false)
            props.navigation.goBack()
        }

        if(response === 'close'){
            () => {}
        }
    }

    

    function setStringToDate(dateString){
        const stringCut = dateString.split('-')
        const stringToInt = stringCut.map(e => parseInt(e))
        let date = new Date(stringToInt[0], --stringToInt[1], stringToInt[2])
        return date
    }

    function responseModalSelectDate(day){        
        const date = setStringToDate(day.dateString)
        setDate(date)
        setShowModalSelectDate(false)
    }
    



    return (
        <ContainerSafe>
            <Container>
                <ContainerText>            
                    <Text>{textClassDisplay}</Text>
                    <SelectDate>
                        <Text>{util.setDateObjectToDateStringWithWeekDay(date)}</Text>
                        <ContainerIcon
                            onPress={() => setShowModalSelectDate(true)}
                        >
                            <Icon 
                                name="calendar"
                                size={25} 
                                color="#007bff"
                            />
                        </ContainerIcon>
                    </SelectDate>
                    
                </ContainerText>
                <Line/>
            </Container> 
            {loading ?  
                <ActivityIndicator size="large" color="#007bff"/>
                : 
                <FlatList 
                    style={{flex: 6}}
                    data={students}
                    renderItem={({item}) => 
                        <Item 
                            name={item.name}
                            numberOfCheckbox={workload} 
                            idStudent={item.id}
                            numberOfPresence={item.presence} 
                            callTogglePresence={togglePresence}                
                        />
                    }
                    keyExtractor={item => item.id}                
                />
            }
           
            <ContainerBtns>
                <Button 
                    size="small" 
                    color={`${blockBtnContent ? colors.sucess: colors.primary}`} 
                    textColor="#FFF" 
                    onClick={() => setShowModalLaunchContent(true)}
                    disabled={blockBtnContent || loading}
                >
                    Lançar Conteúdo
                </Button>
                <Button 
                    size="medium" 
                    color={colors.primary} 
                    textColor="#FFF" 
                    onClick={async () => await finalizarLancarPresenca()}
                    disabled={loading}
                >
                    Finalizar
                </Button>
            </ContainerBtns> 
            <ModalLaunchContent 
                visible={showModalLaunchContent}
                content={content}
                setContent={setContent}
                responseModalContent={responseModalContent}
            />
            <ModalBackHandler
                visible={showModalBackHandler}
                responseModalBack={responseModalBack}
            />

            <ModalSelectDate 
                visible={showModalSelectDate}
                responseModalSelectDate={responseModalSelectDate}
                diaries={diaries}
            />
               
        </ContainerSafe>
    )
} 

export default LaunchPresence

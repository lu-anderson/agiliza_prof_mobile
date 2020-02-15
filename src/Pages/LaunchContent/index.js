import React, {useState, useRef, useEffect} from 'react'


import {Keyboard, ActivityIndicator} from 'react-native'
import { Calendar, LocaleConfig} from 'react-native-calendars'

import getRealm from '../../offline/realm'

import InputText from './Input_text'

import { Container,Text, ContainerInputContent, ContainerCalendar, ContainerInputs,
	Line,
	ContainerBtns
} from './styles';
import Button from '../../components/Button'

import colors from '../colors'

LocaleConfig.locales['pt'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar','Abril','Mai','Jun','Jul.','Ago','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

const ItemOfInputToLaunchContent = ({date, scrollRef, sizeKeyboard, getContent, contentsEmpyts}) => {
	const dayNames = ['domingo','segunda','terça','quarta','quinta','sexta','sábado']
	const [positionY, setPositionY] = useState(0)
	const [content, setContent] = useState('')

	const Day = date.date.getDate() < 10 ? `0${date.date.getDate()}` : date.date.getDate()
	const Month = date.date.getMonth() + 1 < 10 ? `0${date.date.getMonth()+1}` : date.date.getMonth() + 1

	const showFeira = date.date.getDay() !== 0 && date.date.getDay() !== 6 ? '-feira': ''
	return (
		<ContainerInputContent			
			onLayout={event => {
				setPositionY(event.nativeEvent.layout.y)
			}}		
		>
			<Text>{`${Day}/${Month}/${date.date.getFullYear()} - ${dayNames[date.date.getDay()]}${showFeira}`}</Text>
			<InputText 
				value={date.content && date.status !== undefined ? date.content : content }
				onChangeText={(text) => {setContent(text); getContent(text, date.date)}}
				onFocus={() => {
					scrollRef.current.scrollTo({x: 0,
					y: positionY + sizeKeyboard,
					animated: true})
				}}
				onEndEditing={() => {}
					//getContent(content, date.date)
				}

				editable={date.status !== undefined ? false : true}
				status={date.status}
				defaultValue={date.content}				
			/>
			{date.status === 'savedInRealm' &&
				<Text style={{color: colors.secondary}}>Conteúdo registrado (Offline)</Text>
			}

			{date.status === 'savedInMongo' &&
				<Text style={{color: colors.warning}}>Conteúdo registrado (Online)</Text>
			}

			{date.status === 'savedInSigEduca' &&
				<Text style={{color: colors.sucess}}>Conteúdo salvo no SigEduca</Text>
			}


		</ContainerInputContent>
	)
}


function setColorStatus(status){
	if(status === 'savedInRealm'){
		return colors.secondary
	}else if(status === 'savedInMongo'){
		return colors.warning
	}else if(status === "savedInSigEduca"){
		return colors.sucess
	}else{
		return colors.primary
	}
}

function setMarkedDayInCalendarWithDateObject(date, status, selected){
	const Day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
	const Month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth() + 1
	const todayFormated = `${date.getFullYear()}-${Month}-${Day}`
	
	return {[todayFormated]: {selected: selected, selectedColor: setColorStatus(status)}}		
}

function setInnitialStateForCalendar(diariesOfContent){
	const date = new Date()
	const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()) 

	let datesCalendar = {}

	let existDiaryToday = diariesOfContent.findIndex(diary => diary.date.getTime() === today.getTime())

	if(existDiaryToday === -1){
		datesCalendar = setMarkedDayInCalendarWithDateObject(new Date(), '', true)
	}	

	for (let index = 0; index < diariesOfContent.length; index++) {
		let dateObject = 
			setMarkedDayInCalendarWithDateObject(diariesOfContent[index].date, diariesOfContent[index].status, true)

		datesCalendar = {
			...datesCalendar, 
			...dateObject
		}		
	}

	return datesCalendar
}

function setInnitialStateForInputsObjects(diariesOfContent){
	let date = new Date()
	const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()) 

	let existDiaryToday = diariesOfContent.findIndex(diary => diary.date.getTime() === today.getTime())

	let inputsObjetcs = []
	if(existDiaryToday === -1){
		inputsObjetcs.push(
			{
				date: new Date(date.getFullYear(), date.getMonth(), date.getDate())
			}
		)
	}	

	for (let index = 0; index < diariesOfContent.length; index++) {		
		inputsObjetcs.push({
			date: diariesOfContent[index].date,
			content: diariesOfContent[index].content,
			status: diariesOfContent[index].status
		})
		
	}

	

	return sortDates(inputsObjetcs)
}

function setStringToDate(dateString){
	const stringCut = dateString.split('-')
	const stringToInt = stringCut.map(e => parseInt(e))
	let date = new Date(stringToInt[0], --stringToInt[1], stringToInt[2])
	return date
}

function sortDates(arrayOfDates){
	function compare(a,b) {
		return a.date > b.date;
	}		
	return arrayOfDates.sort(compare)
}

function setMarkedDayInCalendarWithDateCalendarObject(date = new Date(), status){
		
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

function LaunchContent({navigation}) {
	const idClass = navigation.getParam('classId')
	const [datesCalendar, setDatesCalendar] = useState({})
	
	const [diaries, setDiaries] = useState([])
	
	const [loading, setLoading] = useState(true)
	
	const [existEmpytContent, setExistEmpytContent] = useState(false)
	

	
	const [heightKeyboard, setHeightKeyboard] = useState(0)

	

	const scrollRef = useRef(null) 
	
	useEffect(() => {
		async function getDiariesInRealm(){
            const realm = await getRealm()

            
            const classes = realm.objectForPrimaryKey('Classes', idClass)
            
            
            const diariesOfContentInRealm = JSON.parse(classes.diariesOfContent)
            
            const diariesOfContentWithDateObject = setDiariesWithDateStringToDateObject(diariesOfContentInRealm) 
			
			console.log(diariesOfContentWithDateObject)

			setDiaries(setInnitialStateForInputsObjects(diariesOfContentWithDateObject))
			setDatesCalendar(setInnitialStateForCalendar(diariesOfContentWithDateObject))
			setLoading(false)
        }

        getDiariesInRealm()


		Keyboard.addListener('keyboardDidShow', (e) => {
			setHeightKeyboard(e.endCoordinates.height)
		})

		Keyboard.addListener('keyboardDidHide', (e) => {
			setHeightKeyboard(e.endCoordinates.height)
		})
		

		return () => {
			Keyboard.removeAllListeners('keyboardDidShow', (e) => {
				setHeightKeyboard(e.endCoordinates.height)
			})
	
			Keyboard.removeAllListeners('keyboardDidHide', (e) => {
				setHeightKeyboard(e.endCoordinates.height)
			})
		}
	}, [])

	function addDateToLaunchContent(calendarDay) {
		let newDatesCalendar = Object.assign({}, datesCalendar)
		
		if(newDatesCalendar[calendarDay.dateString] !== undefined){
			if(newDatesCalendar[calendarDay.dateString].selectedColor !== colors.primary){
				newDatesCalendar[calendarDay.dateString] = 
					{selected: true, selectedColor: newDatesCalendar[calendarDay.dateString].selectedColor}				
			}else{
				delete newDatesCalendar[calendarDay.dateString]
			}
			
		}else{
			newDatesCalendar[calendarDay.dateString] = {selected: true, selectedColor: colors.primary}
		}

		setDatesCalendar(newDatesCalendar)

		let newDiaries = [...diaries]

		const date = setStringToDate(calendarDay.dateString)

		let existDiary = newDiaries.findIndex(diary => diary.date.getTime() === date.getTime())

		if(existDiary === -1){
			newDiaries.push({
				date: date
			})
		}else if(newDiaries[existDiary].status !== undefined){
		}else{
			newDiaries.splice(existDiary, 1)
		}

		
		sortDates(newDiaries)		
		setDiaries(newDiaries)
	}

	function addContentInState(content, date){
		console.log('content')
		console.log(content)
		let newDiaries = [...diaries]
		let indexDiary = newDiaries.findIndex(diary => diary.date.getTime() === date.getTime())
		newDiaries[indexDiary].content = content
		
		setDiaries(newDiaries)
	}

	async function addDiaryOfContentInRealm(newDiariesOfContent, idClass){
        const realm = await getRealm()

        const classe = realm.objectForPrimaryKey('Classes', idClass)

        const diariesOfContentInRealm = JSON.parse(classe.diariesOfContent)

        const diariesOfContent = [...diariesOfContentInRealm, ...newDiariesOfContent]
    
        realm.write(() => {
            classe.diariesOfContent = JSON.stringify(diariesOfContent)
        })

        realm.close()
    }
	
	async function salvar(){
		Keyboard.dismiss()

		let contentsEmpyts = []		

		let diariesToSave = []

		for (let index = 0; index < diaries.length; index++) {

			if(diaries[index].status === undefined && (diaries[index].content === '' || diaries[index].content === undefined)){
				contentsEmpyts.push(1)
			}

			if(diaries[index].status === undefined){
				diariesToSave.push(diaries[index])
			}		
		}

		if(contentsEmpyts.length !== 0){
			setExistEmpytContent(true)
		}else{
			diariesToSave = diariesToSave.map(diary => {
				return diary =  {
					...diary,
					status:'savedInRealm'
				}
			})
			await addDiaryOfContentInRealm(diariesToSave, idClass)
			navigation.goBack()
		}	
	}

	return (
		<Container ref={scrollRef} 
			keyboardShouldPersistTaps="handled"			
		> 
			<ContainerCalendar>
				<Calendar					
					markedDates = {datesCalendar}
					onDayPress = {(day) => addDateToLaunchContent(day)}
				/>
			</ContainerCalendar>			
			<Line/> 
			{loading ?  
                <ActivityIndicator size="large" color="#007bff"/>
                : 
				<ContainerInputs>
					{diaries.map(diary => 
						<ItemOfInputToLaunchContent 
							key={`${diary.date.getDate()}/${diary.date.getMonth()}`} 
							date={diary} 
							scrollRef={scrollRef}
							sizeKeyboard={heightKeyboard}
							getContent={(content, date) => addContentInState(content, date)}
						/>)
					}   
				</ContainerInputs>
			}
			<ContainerBtns>
			{existEmpytContent && 
				<Text style={{color: colors.danger}}>Por favor preencha todos os campos</Text>
			}
			<Button 
				size="small" 
				color="#007bff" 
				textColor="#FFF"
				onClick={diaries.length !== 0 ? async ()=> await salvar(): navigation.goBack}
			>
				{diaries.length !== 0 ? 'Salvar' : 'Voltar'}
			</Button>
			</ContainerBtns>
		</Container>
	)
}



export default LaunchContent



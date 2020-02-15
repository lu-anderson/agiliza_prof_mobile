import React, {useEffect, useState} from 'react'

import {Calendar} from 'react-native-calendars'

import { Container,
		Modal,
		ContainerModal,
} from './styles'

import colors from '../../colors'


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

function setInnitialStateForCalendar(diaries){
	const date = new Date()
	const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()) 

	let datesCalendar = {}

	let existDiaryToday = diaries.findIndex(diary => diary.date.getTime() === today.getTime())

	if(existDiaryToday === -1){
		datesCalendar = setMarkedDayInCalendarWithDateObject(new Date(), '', true)
	}	

	for (let index = 0; index < diaries.length; index++) {
		let dateObject = 
			setMarkedDayInCalendarWithDateObject(diaries[index].date, diaries[index].status, true)

		datesCalendar = {
			...datesCalendar, 
			...dateObject
		}		
	}

	return datesCalendar
}

const ModalSelectDate = ({visible, responseModalSelectDate, diaries}) => {
	const [dates, setDatesCalendar] = useState()

	useEffect(() => {
		setDatesCalendar(setInnitialStateForCalendar(diaries))
	}, [diaries])

	function blockSelectDateExist(calendarDay) {
		let newDatesCalendar = Object.assign({}, dates)
		
		if(newDatesCalendar[calendarDay.dateString] === undefined || newDatesCalendar[calendarDay.dateString].selectedColor === colors.primary){
			responseModalSelectDate(calendarDay)	
		}
	}
	
	
	return (
      	<>
			<Modal
				animationType="fade"      
				transparent={true}
				visible={visible}
				onRequestClose={() => {}}
			>
				<Container>
					<ContainerModal>
						<Calendar 
							onDayPress={blockSelectDateExist}
							markedDates={dates}
						/>
					</ContainerModal>					
				</Container>
			</Modal>
    	</>
    );  
}

export default ModalSelectDate
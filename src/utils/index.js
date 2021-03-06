const dayNames = ['domingo','segunda','terça','quarta','quinta','sexta','sábado']

export function setDateObjectToDateString(date){
    const Day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const Month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth() + 1
    
    return `${Day}/${Month}/${date.getFullYear()}`    
}

export function setDateObjectToDateStringWithWeekDay(date){
    const Day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const Month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth() + 1
    
    const showFeira = date.getDay() !== 0 && date.getDay() !== 6 ? '-feira': ''

    return `${Day}/${Month}/${date.getFullYear()} - ${dayNames[date.getDay()]}${showFeira}`    
}



export function addArrayInArray(originalArray, arrayToAdd){
    return [...originalArray, ...arrayToAdd] 
}

export function updateItemInArray(originalArray, itemToUpdate, index){
    originalArray.map((item, i) => {
        if(i !== index){
            return item
        }else{
            return itemToUpdate
        }
    })
}

import {useNetInfo} from "@react-native-community/netinfo"

export async function apiAvailable(){
    const netInfo = useNetInfo()

    let available = false

    try {
        if(netInfo.isInternetReachable){
            const {data} = await api.get('/')
            console.log(data.OK)
            if (data.OK){
                available = true
            }
        }
    } catch (error) {
        available = false
        console.log('Erro in connect api')
        console.log(error)
    }finally{
        return available
    }

}
import React, {useEffect, useState} from 'react'
import getRealm from '../../offline/realm'

import  * as util from '../../utils'

import {
    Container, 
    Text, 
    Line, 
    SubTitle, 
    ContainerSubTitle,
    AlignRowSubTitle,
    TextSubTitle,
    ContainerDiaries,
    View,
    ViewSubTitle,
    HeaderText,
    ContainerHeaderText,
    DateText
} from './styles'

import colors from '../colors'


function sortDates(arrayOfDates){
    function compare(a,b) {
        return a.date > b.date;
    }		
    return arrayOfDates.sort(compare)
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

const ShowResume = (props) => {
    const idClass = props.navigation.getParam('classId')
    const [diaries, setDiaries] = useState([])
    const [diariesOfContent, setDiariesOfContent] = useState([])

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
        console.log(diariesOfContent)
    }, [diariesOfContent])

    useEffect(() => {
        async function getDiariesInRealm(){
            const realm = await getRealm()

            
            const classes = realm.objectForPrimaryKey('Classes', idClass)

            const diariesInRealm = JSON.parse(classes.diaries)
            
            const diariesOfContentInRealm = JSON.parse(classes.diariesOfContent)

            const diariesWithDateObject = setDiariesWithDateStringToDateObject(diariesInRealm)
            const diariesOfContentWithDateObject = setDiariesWithDateStringToDateObject(diariesOfContentInRealm)  

            sortDates(diariesWithDateObject)
            sortDates(diariesOfContentWithDateObject)            
            

            setDiariesOfContent(diariesOfContentWithDateObject)
            setDiaries(diariesWithDateObject)
        }

        getDiariesInRealm()
    }, [])


    return(
        <Container> 
            <ContainerSubTitle>
                <AlignRowSubTitle>
                    <ViewSubTitle>
                        <SubTitle  style={{backgroundColor: colors.secondary}}/>
                    </ViewSubTitle>
                    <View>
                        <TextSubTitle>Aguardando Conexão com internet</TextSubTitle>
                    </View>                    
                </AlignRowSubTitle>
                <AlignRowSubTitle>
                    <ViewSubTitle>
                        <SubTitle  style={{backgroundColor: colors.warning}}/>
                    </ViewSubTitle>
                    <View>
                        <TextSubTitle>Sincronizando com o SigEduca</TextSubTitle>
                    </View>
                </AlignRowSubTitle>
                <AlignRowSubTitle>
                    <ViewSubTitle>
                        <SubTitle  style={{backgroundColor: colors.sucess}}/>
                    </ViewSubTitle>
                    <View>
                        <TextSubTitle>Salvo no SigEduca</TextSubTitle>
                    </View>
                </AlignRowSubTitle>
            </ContainerSubTitle>   
            <Line />
            <ContainerHeaderText>
                <HeaderText>                
                    Presenças 
                </HeaderText>              
            </ContainerHeaderText>
            {diaries.map(diary => {
                return (
                    <React.Fragment key={diary.date}>
                        <ContainerDiaries color={colors.sucess}>
                            <DateText>{util.setDateObjectToDateStringWithWeekDay(diary.date)}</DateText>                        
                        </ContainerDiaries>
                        <Line />
                    </React.Fragment>
                )
            })}

            <ContainerHeaderText>
                <HeaderText>                
                    Conteúdos 
                </HeaderText>              
            </ContainerHeaderText>
            {diariesOfContent.map(diary => {
                return (
                    <React.Fragment  key={diary.date}>
                        <ContainerDiaries                           
                            color={setColorStatus(diary.status)}
                        >
                            <DateText>{util.setDateObjectToDateStringWithWeekDay(diary.date)}</DateText>                        
                            <Text>{diary.content}</Text>                        
                        </ContainerDiaries>
                        <Line />
                    </React.Fragment>
                )
            })}
        </Container>
    )
}


export default ShowResume
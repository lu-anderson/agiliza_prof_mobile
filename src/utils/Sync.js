import NetInfo from "@react-native-community/netinfo"

import getRealm from '../offline/realm'
import api from '../_services/api'

export default function Sync(){ 
    
    async function verifyIfApiAvailable(){ 
        try {
            const state = await NetInfo.fetch()
            if(state.isInternetReachable){
                const {data} = await api.get('/')
                if(data.OK){
                    console.log('Api avaliable')
                    return true
                }else{
                    console.log('Api not avaliable')
                    return false
                } 
            }else{
                console.log('User Offline')
                return false
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

    async function startSync(){
        let apiAvailable = await verifyIfApiAvailable()
        if(apiAvailable){                
            await syncData()  
        }
    }
    return startSync()

}

    


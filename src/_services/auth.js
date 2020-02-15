import getRealm from '../offline/realm'


export async function getToken(){
    let token = ''
    const realm = await getRealm()

    const user = realm.objects('User')
    if(user.length !== 0){
        token = user[0].token    
        return token
    }else{       
        return null
    } 
    
    
}

export async function saveUser(userId, userName, token){
    const realm = await getRealm()

    const user = {
        id: userId,
        name: userName,
        token
    }

    realm.write(() => {
        realm.create('User', user, 'modified')
    })

    realm.close()
}

export async function singOut(){
    const realm = await getRealm()

    const user = realm.objects('User')
    const classes = realm.objects('Classes')
    realm.write(() => {
        realm.delete(user)
        realm.delete(classes)
    })
    realm.close()
}

export async function isAuthenticated(){
    const token = await getToken()
    if(token){
        return true
    }else{
        return false        
    }
}


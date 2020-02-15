import Realm from 'realm'

import Classes from './schemas/classes'
import User from './schemas/user'

export default function getRealm(){
    return Realm.open({
        schema: [Classes, User],
        schemaVersion: 5,
    })
}
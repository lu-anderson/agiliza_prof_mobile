export default class User {
    static schema = {
        name: 'User',
        primaryKey: 'id',
        properties: {
            id: {type: 'string', indexed: true},
            token: 'string',
            name: 'string'          
        }
    }
} 
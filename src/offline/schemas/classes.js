export default class Classes {
    static schema = {
        name: 'Classes',
        primaryKey: 'id',
        properties: {
            id: {type: 'string', indexed: true},
            students: 'string',
            school: 'string',
            displayText: 'string',
            segment: 'string',
            diaries: 'string',
            diariesOfContent: 'string'            
        }
    }
} 
const classes = [
    {
        id: '_id',
        school: 'escola',
        displayText: 'textoFinalDasTurmas',
        segment: 'segmento',
        students: JSON.stringify('[alunos]'),
        diaries: JSON.stringify('[diarios]'),
        diariesOfContent: [] //Atualmente esse campo não existe no MongoDB, por isso inicia com um []
    }
]

const user = {
    id: 'userId',
    name: 'userName',
    token: 'token'
}
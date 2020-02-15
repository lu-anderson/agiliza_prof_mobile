import React from 'react'
import { Container } from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Checkbox = ({checked, whenToToggle}) => {
    function toggle(){
        whenToToggle()
    }   
    return (
        <Container onPress={() => toggle()} checked={checked}>{checked ? 
            <Icon name="close" size={20} color="#FFF"/>: <Icon name="done" size={20} color="#FFF"/>}
        </Container>
        )
    
}

export default Checkbox

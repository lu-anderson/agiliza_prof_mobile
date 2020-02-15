import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {Container, Btn} from './styles'

const HeaderRigth = props =>
    <Container>
        <Btn onPress={ props.onPress ? () => props.onPress(): ()=> {}}>
            <Icon name="menu" size={30} color="#FFF"/>
        </Btn>
    </Container>
    

export default HeaderRigth;
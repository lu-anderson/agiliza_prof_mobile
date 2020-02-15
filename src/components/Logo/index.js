import React from 'react';
import logo from '../../imgs/logo.png';

import {Image, Container, Btn} from './styles'

const Logo = props =>
    <Container>
        <Btn underlayColor="transparent" onPress={ props.onPress ? () => props.onPress(): ()=> {}}>
            <Image source={logo}/>
        </Btn>
    </Container>
    

export default Logo;

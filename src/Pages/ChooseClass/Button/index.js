import React from 'react';
import {Container, Text} from './styles'

const Button = props =>  (
    <Container color={props.color} onPress={ props.onClick ? () => props.onClick(): ()=> {}} size={props.size}>
        <Text color={props.textColor}>{props.children}</Text>
    </Container>
)

export default Button;

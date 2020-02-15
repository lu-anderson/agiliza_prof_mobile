import React from 'react';
import {Container, Text} from './styles'

const Button = ({children, color, onClick, textColor, size, }) =>  (
    <Container color={color} onPress={ onClick ? () => onClick(): ()=> {}} size={size}>
        <Text color={textColor}>{children}</Text>
    </Container>
)

export default Button;

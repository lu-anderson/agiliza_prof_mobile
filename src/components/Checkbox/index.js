import React, {useState} from 'react';
import { Container, Icon } from './styles';

export default function Checkbox() {

    const [checked, setChecked] = useState(false);

    function toCheck(){
        setChecked(!checked)
    }
    return (
        <Container onPress={toCheck}>{checked ? 
            <Icon>X</Icon> : <Icon></Icon>}
        </Container>
    );
}

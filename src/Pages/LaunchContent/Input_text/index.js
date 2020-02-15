import React from 'react';

import {Input} from './styles';
const Input_text = ({value, onChangeText, onFocus, onEndEditing, status, editable, defaultValue}) => 
    <Input 
        value={value} 
        onChangeText={onChangeText}    
        multiline={true}
        placeholder="Insira o conteúdo aqui..." 
        onFocus={() => onFocus()}
        onEndEditing={() => onEndEditing()}
        status={status}
        defaultValue={defaultValue}
        editable={editable}
    
    />;

export default Input_text;

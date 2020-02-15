import React from 'react';

import {Input} from './styles';
const Input_text = ({value, onChangeText}) => 
    <Input value={value} onChangeText={onChangeText}  multiline={true} />;

export default Input_text;

import styled from 'styled-components/native'

export const Container = styled.TouchableOpacity`
    flex: 1;    
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: ${props => props.checked === false ? 'green' : 'red'} ;
background: ${props => props.checked === false ? 'green' : 'red'}
`

export const Icon = styled.Text`
    font-size: 10
`
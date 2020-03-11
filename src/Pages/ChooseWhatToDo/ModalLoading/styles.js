import styled from 'styled-components/native'


export const Text = styled.Text`
    font-size: 20px;
    color: white;
`


export const Modal = styled.Modal`
`

export const LauchModalBtn = styled.TouchableOpacity`    
`

export const Loading = styled.ActivityIndicator.attrs({
	color: "#007bff"
})``

export const Container = styled.View`
    flex: 1;
    width: 100%;  
    align-items: center;
    justify-content: center;
    background-color: rgba(10,23,55,0.85);
`



export const ContainerModal = styled.View`
    width: 250px;
    height: 100px;
    padding: 5px;
    border-radius: 10px;
    align-items: center;
`

export const ContainerInput = styled.SafeAreaView`
    flex-direction: row;
    padding: 5px;
    
`

export const Line = styled.View`
    margin: 5px;
    width: 100%;
    border: 0.5px;
    border-color: #D2D2D2;
`

export const ContainerBtns = styled.View`
    flex-direction: row;
` 
import styled from 'styled-components/native'

export const ContainerText = styled.View`    
    align-self: center;
    align-items: center;
    padding: 15px;
`

export const ContainerBtns = styled.View`
    flex: 1;
    margin-top: 50px;
    justify-content: flex-start;
    align-self: center;
`

export const ContainerScroll = styled.ScrollView`
    flex: 1;
`

export const Container = styled.View`
    flex: 1;
`

export const Loading = styled.ActivityIndicator.attrs({
	color: '#dc3545'
})`
	margin-top: 10px;
`
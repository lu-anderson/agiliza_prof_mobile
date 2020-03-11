import React from 'react'

import { Container,
		Modal,
		ContainerModal,
		Text,
		Loading
} from './styles'

import colors from '../../colors'


function setColorStatus(status){
	if(status === 'savedInRealm'){
		return colors.secondary
	}else if(status === 'savedInMongo'){
		return colors.warning
	}else if(status === "savedInSigEduca"){
		return colors.sucess
	}else{
		return colors.primary
	}
}


const ModalSelectDate = ({visible}) => {
	
	
	
	return (
      	<>
			<Modal
				animationType="fade"      
				transparent={true}
				visible={visible}
				onRequestClose={() => {}}
			>
				<Container>
					<ContainerModal>
						<Text>
							Sincronizando...
						</Text>
						<Loading size="large"/>
					</ContainerModal>					
				</Container>
			</Modal>
    	</>
    );  
}

export default ModalSelectDate
import React from 'react';
import { 
    Container,
	ContainerBlank, 
	Modal,
	ContainerModal,
} from './styles'
const ComponentModal = ({visible = false, children}) => {
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
                        {children}
					</ContainerModal>					
				</Container>
				<ContainerBlank></ContainerBlank>
			</Modal>
    	</>
    );  
}


export default ComponentModal
import React from 'react'

import { Container,
		Modal,
		Text,
		ContainerModal,
		ContainerBtns,
		Line,
} from './styles'
import Button from '../../../components/Button'

const ModalBackHandler= ({visible, responseModalBack}) => {
    return (
      	<>
			<Modal
				animationType="fade"      
				transparent={true}
				visible={visible}
				onRequestClose={() => responseModalBack('close')}
			>
				<Container>
					<ContainerModal>
					<Text>Deseja salvar?</Text>					
					<Line/>					
						<ContainerBtns>							
							<Button 
								size="small" 
								color="red" 
								textColor="#FFF"
								onClick={() => responseModalBack('no')}
							>
								Não
							</Button>
							<Button 
								size="small" 
								color="green" 
								textColor="#FFF"
								onClick={() => responseModalBack('save')}
							>
								Salvar
							</Button>
						</ContainerBtns>
					</ContainerModal>					
				</Container>
			</Modal>
    	</>
    );  
}

export default ModalBackHandler
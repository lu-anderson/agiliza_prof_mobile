import React  from 'react'

import { Container,
		ContainerBlank, 
		Modal,
		Text,
		ContainerModal,
		ContainerBtns,
		Line
} from './styles'
import Button from '../Button'

const ModalWorkload= ({visible, onRequestClose, selectWorkLoad}) => {

    return (
      	<>
			<Modal
				animationType="fade"      
				transparent={true}
				visible={visible}
				onRequestClose={onRequestClose}
			>
				<Container>
					<ContainerModal>
					<Text>Selecione a carga horária</Text>
						<Line />
						<ContainerBtns>
							<Button
								textColor="white"
								size="small"
								color="#007bff"
								onClick={() => {selectWorkLoad(1)}}
							>
								1
							</Button>
							<Button
								textColor="white"
								size="small"
								color="#007bff"
								onClick={() => {selectWorkLoad(2)}}
							>
								2
							</Button>
							<Button
								textColor="white"
								size="small"
								color="#007bff"
								onClick={() => {selectWorkLoad(3)}}
							>
								3
							</Button>
							<Button
								textColor="white"
								size="small"
								color="#007bff"
								onClick={() => {selectWorkLoad(4)}}
							>
								4
							</Button>
						</ContainerBtns>
					</ContainerModal>					
				</Container>
				<ContainerBlank></ContainerBlank>
			</Modal>
    	</>
    );  
}

export default ModalWorkload
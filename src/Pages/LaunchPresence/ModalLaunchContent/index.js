import React, { useState, useEffect } from 'react'


import Input_Text from './Input_text'

import { Container,
		ContainerBlank, 
		Modal,
		Text,
		SmallText,
		ContainerModal,
		ContainerBtns,
		Line,
		ContainerInput
} from './styles'
import Button from '../../../components/Button'

const ModalWorkload= ({visible, content, setContent, responseModalContent}) => {	
	const [empytContent, setEmpytContent] = useState(false)

	function save() {
		if(content === ''){
			setEmpytContent(true)
		}else{
			responseModalContent('save')
		}
	}

    return (
      	<>
			<Modal
				animationType="fade"      
				transparent={true}
				visible={visible}
				onRequestClose={() => responseModalContent('close')}
			>
				<Container>
					<ContainerModal>
					<Text>Lançando Conteúdo</Text>					
					<Line/>
					<ContainerInput>
						<Input_Text 
							value={content}
							onChangeText={setContent}
						/>
					</ContainerInput>
					{empytContent &&
						<SmallText>Preencha o conteúdo</SmallText>
					}
						<ContainerBtns>
							<Button 
								size="small" 
								color="red" 
								textColor="#FFF"
								onClick={() => responseModalContent('cancel')}
							>
								Cancelar
							</Button>
							<Button 
								size="small" 
								color="green" 
								textColor="#FFF"
								onClick={save}
							>
								Salvar
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
import React from 'react'

import Input_text from '../../components/Input_text'
import Checkbox from '../../components/Checkbox'
import Button from '../../components/Button'

import { ContainerScroll,
    Container,
    ContainerHeaderText, 
    HeaderText, 
    ContainerInputs, 
    Label } from '../globalStyles';

import { Text, ContainerCheckBox, TextTerm, ContainerTextTerm} from './styles'




const Register = () =>
    <ContainerScroll>
        <Container>
            <ContainerHeaderText>
                <HeaderText>Cadastre-se</HeaderText>
            </ContainerHeaderText> 

            <ContainerInputs>
                <Label>Nome</Label>
                <Input_text />

                 <Label>Login do SigEduca</Label>
                <Input_text />   

                 <Label>Senha do SigEduca</Label>
                <Input_text />            

                <Label>Email</Label>
                <Input_text />

                <Label>Celular</Label>
                <Input_text />
            </ContainerInputs>       
           
            <ContainerCheckBox>
                <Checkbox/>
                <Text>Professor(a) de unidocência? (Pedagogo(a))</Text>
            </ContainerCheckBox> 
            <ContainerInputs>
                <Label>Escolas</Label>
                <Input_text />               
            </ContainerInputs> 

            <ContainerTextTerm>
                <TextTerm>
                Ao clicar em cadastrar você autoriza a usarmos suas credenciais
                de login para fazer os lançamentos de avaliação na plataforma
                SigEduca do Governo de Mato Grosso.
                </TextTerm>
            </ContainerTextTerm>

            <Button 
                size="medium"
                color="#007bff"
                textColor="#FFF" 
                onClick={() => {}}
            >
                Cadastrar
            </Button>            
        </Container>
    </ContainerScroll>

Register.navigationOptions  = () => ({
	headerRight: null
});

export default Register;



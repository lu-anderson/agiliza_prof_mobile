import React from 'react'

import { Container, Text } from './styles';

export default function InfoInHeader({children, color}) {
  return (
    <Container color={color}>
        <Text>
            {children}
        </Text>
    </Container>
  );
}

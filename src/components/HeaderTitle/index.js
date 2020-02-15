import React from 'react';

import { Container, Route } from './styles';

export default function HeaderTitle(props) {
  return (
    <Container>
        <Route>{props.route}</Route>
    </Container>
  );
}

import React from 'react';
import { createGlobalStyle } from 'styled-components'

import AppContainer from './AppContainer';

const GlobalStyle = createGlobalStyle`
  body {
    color: #5D6A7E;
    font-family: Inter;
    font-size: 12px;
    line-height: 16px;
  }

  * {
    margin: 0;
    padding: 0;
  }
`

function App() {
  return (
    <>
    <GlobalStyle />
    <AppContainer />
    </>
  );
}

export default App;
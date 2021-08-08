import React, { useState, useCallback } from 'react';
import AudioPlayer from './AudioPlayer';
import Transcript from './Transcript';
import transcriptJSON from '../../transcript.json';
import { cleanWordTimings } from '../utils';
import Controls from './Controls';
import { createGlobalStyle } from 'styled-components'

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
    <AudioPlayer
      src="https://zenprospect-production.s3.amazonaws.com/uploads/phone_call/uploaded_content/59e106639d79684277df770d.wav"
    >
      <Controls />
      <Transcript
        paraTimings={cleanWordTimings(transcriptJSON.word_timings)}
      />
    </AudioPlayer>
    </>
  );
}

export default App;
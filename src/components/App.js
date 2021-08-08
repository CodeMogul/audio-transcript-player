import React, { useState, useCallback } from 'react';
import { createGlobalStyle } from 'styled-components'

import AudioPlayer from './AudioPlayer';
import Controls from './Controls';
import Transcript from './Transcript';
import TranscriptProgress from './TranscriptProgress';

import transcriptJSON from '../transcript.json';
import { cleanWordTimings } from '../utils';

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
  const cleanedWordTimings = cleanWordTimings(transcriptJSON.word_timings);
  return (
    <>
    <GlobalStyle />
    <AudioPlayer
      src="https://zenprospect-production.s3.amazonaws.com/uploads/phone_call/uploaded_content/59e106639d79684277df770d.wav"
    >
      <Controls />
      <TranscriptProgress
        paraTimings={cleanedWordTimings}
      />
      <Transcript
        paraTimings={cleanedWordTimings}
      />
    </AudioPlayer>
    </>
  );
}

export default App;
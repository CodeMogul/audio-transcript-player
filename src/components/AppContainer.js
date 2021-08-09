import React, { useState, useEffect } from 'react';

import UrlInputs from './UrlInputs';
import AudioPlayer from './AudioPlayer';
import Controls from './Controls';
import Transcript from './Transcript';
import TranscriptProgress from './TranscriptProgress';
import { cleanWordTimings } from '../utils';

const defaultUrls = {
  audioUrl: 'https://zenprospect-production.s3.amazonaws.com/uploads/phone_call/uploaded_content/59e106639d79684277df770d.wav',
  transcriptUrl: 'transcript.json',
};

export default function AppContainer() {
  const [urls, setUrls] = useState(defaultUrls);
  const [paraTimings, setParaTimings] = useState([]);

  useEffect(() => {
    if (!urls.transcriptUrl) return;
    fetch(urls.transcriptUrl)
      .then(res => res.json())
      .then(data => setParaTimings(cleanWordTimings(data.word_timings)));
  }, [urls.transcriptUrl])

  return (
    <>
      <UrlInputs onSubmit={setUrls} defaultValues={defaultUrls} />
      <AudioPlayer src={urls.audioUrl}>
        <Controls />
        <TranscriptProgress paraTimings={paraTimings} />
        <Transcript paraTimings={paraTimings} />
      </AudioPlayer>
    </>
  )
}

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inRange } from '../utils';

import { useAudioPlayer } from './AudioPlayer';

const TranscriptContainer = styled.section`
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 600px;

  article {
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 24px;
    min-height: 42px;
  }

  article.active {
    background: #EDF7FF;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  article h5 {
    font-weight: 600;
    padding-left: 10px;
    padding-right: 10px;
  }

  article p {
    padding-left: 10px;
    padding-right: 10px;
  }

  article p span {
    cursor: pointer;
  }

  article p span.active, article p span:hover  {
    background: #cde5f8;
  }

  article:nth-child(even) {
    padding-left: 70px
  }

  article:nth-child(odd) h5 {
    color: #1991EB;
  }

  article:nth-child(odd) p {
    border-left: 1px solid #1991EB;
  }

  article:nth-child(even) h5 {
    color: #02C797;
  }

  article:nth-child(even) p {
    border-left: 1px solid #02C797;
  }
`;


function TranscriptPara({
  wordTimings,
  currentTime,
}) {
  const startTimeHeading = ("0" + wordTimings[0].startTime.toFixed(2)).slice(-5);

  const paragraph = wordTimings.map((timing, index) => (
    <span
      key={index}
      className={currentTime && inRange(currentTime, timing.startTime, timing.endTime) ? 'active' : undefined}
      data-start-time={timing.startTime}
      data-word={timing.word}
    >{timing.word} </span>
  ));

  return (
    <article className={currentTime ? 'active' : undefined}>
      <h5>{startTimeHeading}</h5>
      <p>{paragraph}</p>
    </article>
  );
}

// Memoizing Transcription Para to rerender only the one that is currently active
const MemoisedTranscriptPara = React.memo(TranscriptPara);

export default function Transcript({ paraTimings }) {
  const audioPlayer = useAudioPlayer();

  const onClick = useCallback((e) => {
    const { dataset } = e.target;
    audioPlayer.seek(dataset.startTime);
  }, []);

  const paragraphs = paraTimings.map((wordTimings, index) => {
    const isActivePara = inRange(
      audioPlayer.currentTime,
      wordTimings[0].startTime,
      wordTimings[wordTimings.length - 1].endTime,
    );

    return (
      <MemoisedTranscriptPara
        key={index}
        wordTimings={wordTimings}
        // NOTE: currentTime is passed only to activePara, thus avoiding re-renders of other paragraphs
        currentTime={isActivePara ? audioPlayer.currentTime : undefined}
      />
    );
  })

  return (
    <TranscriptContainer onClick={onClick}>
      {paragraphs}
    </TranscriptContainer>
  )
}

Transcript.propTypes = {
  paraTimings: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        word: PropTypes.string.isRequired,
      }),
    ),
  )
}

Transcript.defaultProps = {
  paraTimings: [],
}


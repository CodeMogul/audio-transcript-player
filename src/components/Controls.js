import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAudioPlayer } from './AudioPlayer';
import LeftSeekIcon from '../icons/LeftSeek';
import RightSeekIcon from '../icons/RightSeek';
import PauseIcon from '../icons/Pause';
import PlayIcon from '../icons/Play';

const StyledControlsContainer = styled.section`
  height: 30px;
  background: #E8EEF4;
  display: flex;
  align-items: center;
  padding: 12px 20px;

  button {
    border: none;
    background: inherit;
    outline: none;
    margin-left: 6px;
    margin-right: 6px;
    color: inherit;
    cursor: pointer;
  }

  button:hover {
    color: #1991EB;
  }

  button svg {
    fill: currentColor;
  }

  .icon-button-lg {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-color: #1991EB;
  }

  select {
    border-radius: 100px;
    margin-left: 12px;
    padding: 2px 8px;
    background: #FFFFFF;
    border: 1px solid #D3DAE3;
    outline: none;
    appearance: none;
  }
`;

export default function Controls() {
  const audioPlayer = useAudioPlayer();

  const onChangePlaybackRate = useCallback((e) => {
    audioPlayer.setPlaybackRate(e.target.value);
  }, []);

  return (
    <StyledControlsContainer>
      <button
        onClick={() => audioPlayer.seek(audioPlayer.currentTime - 3)}
      >
        <LeftSeekIcon />
      </button>

      <button
        key={audioPlayer.paused}
        onClick={audioPlayer.paused ? audioPlayer.play : audioPlayer.pause}
        className="icon-button-lg"
      >
        {audioPlayer.paused ? <PlayIcon /> : <PauseIcon />}
      </button>

      <button
        onClick={() => audioPlayer.seek(audioPlayer.currentTime + 3)}
      >
        <RightSeekIcon />
      </button>

      <select
        onChange={onChangePlaybackRate}
        value={audioPlayer.playbackRate}
      >
        <option value="0.5">0.5x</option>
        <option value="1">1x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>
    </StyledControlsContainer>
  );
}

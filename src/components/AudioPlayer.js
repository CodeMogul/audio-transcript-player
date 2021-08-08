import React, { useRef, useEffect, useState, useCallback, useContext } from 'react'
import PropTypes from 'prop-types';

const AudioPlayerContext = React.createContext(null);

export default function AudioPlayer({
  src,
  children
}) {
  if (typeof src !== 'string') throw new Error('Invalid `src` provides');

  const audioRef = useRef(new Audio(src));
  const intervalRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [renderFlag, setRenderFlag] = useState(false);

  const audioTrack = audioRef.current;

  const triggerRerender = useCallback(() => setRenderFlag(prev => !prev));

  const play = useCallback(() => {
    audioTrack.play();
    triggerRerender();
    intervalRef.current = setInterval(() => {
      if (audioTrack.ended) clearInterval(intervalRef.current);
      triggerRerender();
    }, 100);
  }, [audioTrack]);

  const pause = useCallback(() => {
    audioTrack.pause();
    clearInterval(intervalRef.current);
    triggerRerender();
  }, [audioTrack]);

  const seek = useCallback(toTime => {
    audioTrack.currentTime = parseFloat(toTime);
    if (audioTrack.paused) play();
  }, [play]);

  const setPlaybackRate = useCallback(rate => {
    audioTrack.playbackRate = parseFloat(rate);
    triggerRerender();
  }, [audioTrack]);

  useEffect(() => {
    audioTrack.addEventListener('loadeddata', function () {
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  const value = {
    currentTime: audioTrack.currentTime,
    duration: audioTrack.duration,
    playbackRate: audioTrack.playbackRate,
    paused: audioTrack.paused,
    ended: audioTrack.ended,
    play,
    pause,
    seek,
    setPlaybackRate,
  }

  return (
    <AudioPlayerContext.Provider
      value={value}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) throw new Error ('This hook can only be used in AudioPlayer');
  return context;
}
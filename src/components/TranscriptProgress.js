import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useAudioPlayer } from './AudioPlayer';
import { secondsToMinutesStr } from '../utils';

const Container = styled.section`
  background-color: #F7F9FB;
  padding: 20px;

  .time {
    padding: 2px 7px;
    background: #E8EEF4;
    border-radius: 3px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .time .current-time {
    color: #242D3E;
  }
`;

const TimeRange = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  padding: 7.5px 0;
  box-sizing: border-box;

  &:nth-child(1) {
    border-bottom: 1px solid #D3DAE3;
  }

  div.speech {
    background: repeating-linear-gradient(90deg,
      ${({ bgColor }) => `${bgColor}, ${bgColor}`} 2px,
      transparent 2px, transparent 4px);
  }
`;

TimeRange.defaultProps = {
  bgColor: '#02C797',
}

const ProgressContainer = styled.div`
  display: flex;
  height: 80px;

   > div:nth-child(1) {
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-right: 1px solid #D3DAE3;
   }

  h3:nth-child(1) {
    color: #02C797;
  }

  h3:nth-child(2) {
    color: #1991EB;
  }

  > div:nth-child(2) {
    flex: 1;
    position: relative;
    cursor: pointer;
  }

  .progress {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: rgba(205, 229, 248, 0.3);
  }
`;


const paraTimingsToTimeRanges = (paraTimings, totalDuration) => {
  const timeRanges = [];
  if (paraTimings.length === 0) return timeRanges;

  if (paraTimings[0][0].startTime > 0) {
    timeRanges.push({
      startTime: 0,
      endTime: paraTimings[0][0].startTime,
      percentage: Math.round(paraTimings[0][0].startTime / totalDuration * 100),
      blank: true,
    });
  }

  paraTimings.forEach(wordTimings => {
    const startTime = wordTimings[0].startTime;
    const endTime = wordTimings[wordTimings.length - 1].endTime;
    const prev = timeRanges[timeRanges.length - 1];

    if (startTime > prev.endTime) {
      timeRanges.push({
        startTime: prev.endTime,
        endTime: startTime,
        percentage: Math.round((startTime - prev.endTime - 0.1) / totalDuration * 100),
        blank: true,
      });
    }

    timeRanges.push({
      startTime,
      endTime,
      percentage: Math.round((endTime - startTime) / totalDuration * 100),
      blank: false,
    });
  });

  const last = timeRanges[timeRanges.length - 1];

  if (last.endTime < totalDuration) {
    timeRanges.push({
      startTime: last.endTime,
      endTime: totalDuration,
      percentage: Math.round((totalDuration - last.endTime) / totalDuration * 100),
      blank: true,
    });
  }

  return timeRanges;
}

export default function TranscriptProgress({ paraTimings }) {
  const audioPlayer = useAudioPlayer();

  const { ourTimeRanges, prospectTimeRanges } = useMemo(() => {
    const ourParaTimings = [];
    const prospectParaTimings = [];

    paraTimings.forEach((wordTimings, index) => {
      if (index % 2) prospectParaTimings.push(wordTimings);
      else ourParaTimings.push(wordTimings);
    });

    const ourTimeRanges = paraTimingsToTimeRanges(ourParaTimings, audioPlayer.duration);
    const prospectTimeRanges = paraTimingsToTimeRanges(prospectParaTimings, audioPlayer.duration);

    return { ourTimeRanges, prospectTimeRanges }
  }, [paraTimings]);

  const seek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = e.clientX - rect.left;
    const seekToTime = (audioPlayer.duration / rect.width) * pos;
    console.log(e.currentTarget, pos, seekToTime)
    audioPlayer.seek(seekToTime);
  }, [audioPlayer.duration]);

  return (
    <Container>
      <span className="time">
        <span className="current-time">{secondsToMinutesStr(audioPlayer.currentTime)}</span>
        <span > / {secondsToMinutesStr(audioPlayer.duration)}</span>
      </span>

      <ProgressContainer>
        <div>
          <h3>You: {ourTimeRanges.reduce((sum, x) => sum + (x.blank ? 0 : x.percentage), 0)}%</h3>
          <h3>Prospect: {prospectTimeRanges.reduce((sum, x) => sum + (x.blank ? 0 : x.percentage), 0)}% </h3>
        </div>

        <div onClick={seek}>
          <TimeRange>
            {
              ourTimeRanges.map(range => (
                <div
                  key={range.startTime}
                  style={{ flexBasis: `${range.percentage}%` }}
                  className={range.blank ? "" : 'speech'}
                />
              ))
            }
          </TimeRange>

          <TimeRange bgColor="#1991EB">
            {
              prospectTimeRanges.map(range => (
                <div
                  key={range.startTime}
                  style={{ flexBasis: `${range.percentage}%` }}
                  className={range.blank ? "" : 'speech'}
                />
              ))
            }
          </TimeRange>

          <div
            className="progress"
            style={{ width: (audioPlayer.currentTime / audioPlayer.duration * 100).toFixed(2) + '%' }}
          />
        </div>
      </ProgressContainer>
    </Container>
  )
}

TranscriptProgress.propTypes = {
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

TranscriptProgress.defaultProps = {
  paraTimings: [],
}

export const inRange = (number, start, end) => {
  return start <= number && number <= end; 
}

export const cleanWordTimings = (paraTimings) => {
  return paraTimings.map(paraTiming => (
    paraTiming.map(wordTiming => ({
      ...wordTiming,
      startTime: parseFloat(wordTiming.startTime.slice(0,-1)),
      endTime: parseFloat(wordTiming.endTime.slice(0,-1)),
    }))
  ));
}

export const secondsToMinutesStr = (seconds) => {
  let s = parseInt(seconds);
  const minutes = Math.floor(s / 60);
  s = s % 60;

  const secondsStr = ("0" + s).slice(-2);
  const minutesStr = ("0" + minutes).slice(-2);
  return `${minutesStr}:${secondsStr}`;
}

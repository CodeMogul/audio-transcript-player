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

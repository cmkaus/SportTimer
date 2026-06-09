export const getDigitDisplay = (seconds: number) => {
  const mins = getMinutes(seconds)
  const secs = getSeconds(seconds)
  const paddedMins = String(mins).padStart(2, '0')
  const paddedSecs = String(secs).padStart(2, '0')

  return `${paddedMins[0]}${paddedMins[1]}:${paddedSecs[0]}${paddedSecs[1]}`
}

export const getMinutes = (seconds: number) => {
  return Math.floor(seconds / 60)
}

export const getSeconds = (seconds: number) => {
  return seconds % 60
}

export const convertSeconds = (minutes: number, seconds: number) => {
  return minutes * 60 + seconds
}

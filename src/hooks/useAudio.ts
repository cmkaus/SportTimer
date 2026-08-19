import { AudioStatus, useAudioPlayer } from 'expo-audio'

const beepSound = require('../../assets/sounds/beep1.mp3')

export const useAudio = () => {
  const player1 = useAudioPlayer(beepSound)
  const player2 = useAudioPlayer(beepSound)

  const subscription = player1.addListener(
    'playbackStatusUpdate',
    (status: AudioStatus) => {
      if (status.didJustFinish) {
        playBeep()
      }
    },
  )

  const playBeep = () => {
    player2.seekTo(0)
    player2.play()
  }

  const playBeepTwice = () => {
    player1.seekTo(0)
    player1.play()
  }

  return { playBeep, playBeepTwice }
}

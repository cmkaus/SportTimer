import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition'
import { useAudio } from './useAudio'

const triggerWord = 'time'

export const useSpeechRegconigiotn = ({
  isPaused,
  actionClick,
  resetClick,
}: {
  isPaused: boolean
  actionClick: () => void
  resetClick: () => void
}) => {
  useSpeechRecognitionEvent('start', () => {
    // console.log('start')
  })

  useSpeechRecognitionEvent('end', () => {
    // console.log('end')
    // console.log('OS ended session prematurely. Restarting microphone...')
    // ExpoSpeechRecognitionModule.start({
    //   lang: 'en-US',
    //   continuous: true,
    // })
  })
  const { playBeep } = useAudio()
  useSpeechRecognitionEvent('result', event => {
    // console.log('result')
    const transcript = event.results[0]?.transcript?.toLowerCase().trim()
    // console.log('result', transcript)
    if (transcript && transcript.toLowerCase().includes(triggerWord)) {
      // console.log('result transcript', transcript)

      const actioned = speechAction(
        isPaused,
        transcript,
        resetClick,
        actionClick,
      )
      if (actioned) playBeep()
    }
  })

  useSpeechRecognitionEvent('error', event => {
    console.error('Speech error:', event.error, event.message)
  })

  const startListening = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync()
    if (result.granted) {
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        continuous: true,
      })
    }
  }

  const stopListening = async () => {
    ExpoSpeechRecognitionModule.abort()
  }

  return { startListening, stopListening }
}

//=======
// helper
//=======

function speechAction(
  isPaused: boolean,
  transcript: string,
  resetClick: () => void,
  actionClick: () => void,
) {
  if (transcript.includes('reset')) {
    resetClick()
    return true
  }
  if (isPaused)
    if (transcript.includes('start') || transcript.includes('play')) {
      actionClick()
      return true
    }

  if (!isPaused)
    if (transcript.includes('pause') || transcript.includes('stop')) {
      actionClick()
      return true
    }

  return false
}

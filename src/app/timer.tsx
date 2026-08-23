import { useEffect } from 'react'
import { colors } from '@/common/styles'
import { Time } from '@/components/Time/Time'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useKeepAwake } from 'expo-keep-awake'
import { Controls } from '@/components/Control/Control'
import { useTimeContext } from '@/Provider/TimeProvider'
import { useAudio } from '@/hooks/useAudio'
import { useSpeechRegconigiotn } from '@/hooks/useSpeechRegconigiotn'

const Timer = () => {
  useKeepAwake()
  const { playBeep, playBeepTwice } = useAudio()
  const {
    secondsLeft,
    setSecondsLeft,
    isPaused,
    setIsPaused,
    settings,
    selectedIndex,
    timerStartedRef,
    timerLeftRef,
    setSelectedIndex,
    isRest,
    setIsRest,
  } = useTimeContext()

  const { width } = useWindowDimensions()
  const fontSize = width * 0.25
  const selectedText = settings[selectedIndex ?? 0]?.key ?? ''

  useEffect(() => {
    const lockAsync = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      )
    }
    startListening()
    lockAsync()

    return () => {
      const unlockAsync = async () => {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        )
      }
      stopListening()
      unlockAsync()
    }
  }, [])

  //timer effect
  useEffect(() => {
    if (isPaused) return

    if (!timerStartedRef.current) timerStartedRef.current = getNowSeconds()

    const storedSeconds = isRest
      ? (settings[selectedIndex]?.value?.restSecs ?? 0)
      : (settings[selectedIndex]?.value?.secs ?? 0)

    const endTime =
      timerStartedRef.current + (timerLeftRef.current ?? storedSeconds)

    const intervalId = setInterval(() => {
      const eslapsed = endTime - getNowSeconds()

      if (eslapsed <= 0) {
        timerLeftRef.current = null
        timerStartedRef.current = null
      }

      if (eslapsed < 0) {
        isRest ? playBeep() : playBeepTwice()
        setIsRest(prev => !prev)
        setSecondsLeft(storedSeconds)
      } else {
        setSecondsLeft(eslapsed)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isPaused, isRest])

  const actionClick = () => {
    setIsPaused(prev => !prev)
    //play for the first time
    if (isPaused && !timerStartedRef.current) {
      timerStartedRef.current = getNowSeconds()
    }

    //play after pause
    if (isPaused && timerLeftRef.current) {
      const prevStart = timerStartedRef.current
      timerStartedRef.current = getNowSeconds()
    }

    //paused
    if (!isPaused) {
      timerLeftRef.current = secondsLeft
    }
  }

  const resetClick = () => {
    setIsPaused(true)
    setIsRest(false)
    timerStartedRef.current = null
    timerLeftRef.current = null
    setSecondsLeft(settings[selectedIndex ?? 0].value.secs)
  }

  const { startListening, stopListening } = useSpeechRegconigiotn({
    isPaused,
    actionClick,
    resetClick,
  })

  const selectorClick = (getNext: boolean) => {
    setIsPaused(true)
    timerLeftRef.current = null
    timerStartedRef.current = null
    const lastIndex = settings.length - 1
    const nextIndex = getNext
      ? selectedIndex === lastIndex
        ? 0
        : selectedIndex + 1
      : selectedIndex === 0
        ? lastIndex
        : selectedIndex - 1

    setSelectedIndex(nextIndex)
    setSecondsLeft(settings[nextIndex]?.value.secs)
  }

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isRest
              ? colors.rest.background
              : colors.original.background,
          },
        ]}
      >
        <View style={styles.time}>
          <Time seconds={secondsLeft} fontSize={fontSize} />
        </View>
        <View style={styles.separator}></View>
        <View style={styles.control}>
          <Controls
            isPaused={isPaused}
            playPress={actionClick}
            pausePress={actionClick}
            resetPress={resetClick}
            selectorPress={selectorClick}
            selectorText={selectedText}
          />
        </View>
      </View>
    </>
  )
}

export default Timer

function getNowSeconds() {
  return Math.floor(Date.now() / 1000)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  time: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  control: {
    flex: 1,
  },
  separator: {
    alignSelf: 'center',
    height: 1,
    width: '80%',
    backgroundColor: '#d9d9d9',
    opacity: 0.8,
    marginVertical: 4,
  },
})

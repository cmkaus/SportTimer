import { colors } from '@/common/styles'
import { Controls } from '@/components/Control/Control'
import { Time } from '@/components/Time/Time'
import { useAudio } from '@/hooks/useAudio'
import { useSpeechRegconigiotn } from '@/hooks/useSpeechRegconigiotn'
import { useTimeContext } from '@/Provider/TimeProvider'
import * as KeepAwake from 'expo-keep-awake'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'

const lockSccreenTag = 'timer-screen-lock'

const Timer = () => {
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

  const actionClick = () => {
    setIsPaused(prev => !prev)
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

  useEffect(() => {
    const lockAsync = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      )
      await KeepAwake.activateKeepAwakeAsync(lockSccreenTag)
    }
    lockAsync()
    startListening()

    return () => {
      const unlockAsync = async () => {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        )
      }
      KeepAwake.deactivateKeepAwake(lockSccreenTag)
      stopListening()
      unlockAsync()
    }
  }, [])

  //timer effect
  useEffect(() => {
    if (isPaused) return

    const storedSeconds = isRest
      ? (settings[selectedIndex]?.value?.restSecs ?? 0)
      : (settings[selectedIndex]?.value?.secs ?? 0)
    if (!timerLeftRef.current) setSecondsLeft(storedSeconds)

    const intervalId = setInterval(() => {
      const eslapsed = (timerLeftRef.current ?? storedSeconds) - 1
      if (eslapsed < 0) {
        isRest ? playBeep() : playBeepTwice()
        setIsRest(prev => !prev)
        timerLeftRef.current = null
      } else {
        setSecondsLeft(eslapsed)
        timerLeftRef.current = eslapsed
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isPaused, isRest])

  const selectorClick = (getNext: boolean) => {
    setIsPaused(true)
    setIsRest(false)
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

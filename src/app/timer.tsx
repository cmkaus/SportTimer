import { useEffect } from 'react'
import { colors } from '@/common/styles'
import { Time } from '@/components/Time/Time'
import { View, StyleSheet, useWindowDimensions, AppState } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useKeepAwake } from 'expo-keep-awake'
import { Controls } from '@/components/Control/Control'
import { getAllKeys, getSettings } from '@/storage/localstorage'
import { useTimeContext } from '@/Provider/TimeProvider'

const Timer = () => {
  useKeepAwake()
  const {
    secondsLeft,
    setSecondsLeft,
    isPaused,
    setIsPaused,
    settings,
    selectedIndex,
    setSettings,
    timerStartRef,
    timeLeftRef,
    setSelectIndex,
  } = useTimeContext()

  const { height } = useWindowDimensions()
  const fontSize = height * 0.5
  const selectedText = settings[selectedIndex ?? 0]?.key ?? ''

  useEffect(() => {
    const setUpDate = async () => {
      const keys = await getAllKeys()
      const settings = await getSettings([...(keys ?? [])])
      setIsPaused(true)
      setSettings(settings)
      if (secondsLeft === null) {
        setSecondsLeft(settings[0].value.secs)
      }
    }
    setUpDate()

    const lockAsync = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      )
    }

    lockAsync()

    return () => {
      const unlockAsync = async () => {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        )
      }
      unlockAsync()
    }
  }, [])

  //timer effect
  useEffect(() => {
    if (isPaused) return
    if (!timerStartRef.current) timerStartRef.current = getNowSeconds()

    const seconds = settings[selectedIndex]?.value?.secs ?? 0
    const endTime = timerStartRef.current + (timeLeftRef.current ?? seconds)

    const intervalId = setInterval(() => {
      const now = getNowSeconds()
      const eslapsed = endTime - now

      if (eslapsed > 0) {
        setSecondsLeft(eslapsed)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isPaused, selectedIndex, settings])

  const actionClick = () => {
    setIsPaused(prev => !prev)
    //play for the first time
    if (isPaused && !timerStartRef.current)
      timerStartRef.current = getNowSeconds()
    //play after pause
    if (isPaused && timeLeftRef.current) timerStartRef.current = getNowSeconds()
    //paused
    if (!isPaused) {
      timeLeftRef.current = secondsLeft
    }
  }

  const resetClick = () => {
    setIsPaused(true)
    timerStartRef.current = null
    timeLeftRef.current = null
    const originalSeconds = settings[selectedIndex ?? 0].value.secs
    setSecondsLeft(originalSeconds)
  }

  const selectorClick = (getNext: boolean) => {
    setIsPaused(true)
    timeLeftRef.current = null
    timerStartRef.current = null
    const lastIndex = settings.length - 1
    const nextIndex = getNext
      ? selectedIndex === lastIndex
        ? 0
        : selectedIndex + 1
      : selectedIndex === 0
        ? lastIndex
        : selectedIndex - 1

    setSelectIndex(nextIndex)
    setSecondsLeft(settings[nextIndex].value.secs)
  }

  return (
    <>
      <View style={styles.container}>
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
    backgroundColor: colors.light.background,
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

import { TimeProvider } from '@/Provider/TimeProvider'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DigitalNormal4: require('../../assets/fonts/DSEG7Modern-Bold.ttf'),
  })

  useEffect(() => {
    const lockAsync = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      )
    }

    lockAsync()

    return () => {
      const unlockAsync = async () => {
        await ScreenOrientation.unlockAsync()
      }
      unlockAsync()
    }
  }, [])

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        style="light"
        hidden={false}
        animated={true}
        hideTransitionAnimation="slide"
      />

      {
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TimeProvider>
            <Slot />
          </TimeProvider>
        </GestureHandlerRootView>
      }
    </SafeAreaProvider>
  )
}

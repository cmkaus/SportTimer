import { Slot, usePathname } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { TimeProvider } from '@/Provider/TimeProvider'

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

  const pathname = usePathname()
  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        style="light"
        hidden={false}
        animated={true}
        hideTransitionAnimation={'slide'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TimeProvider>
          <Slot />
        </TimeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

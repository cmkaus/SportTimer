import { View, StyleSheet, Text } from 'react-native'
import { router } from 'expo-router'
import { IconButton } from '@/components/Common/Button/IconButton'
import { colors } from '@/common/styles'
import { getAllSettings } from '@/storage/localstorage'
import { useTimeContext } from '@/Provider/TimeProvider'
import { useEffect } from 'react'
const iconSize = 100
const index = () => {
  const { setSecondsLeft, settings, selectedIndex, resetSetting } =
    useTimeContext()
  useEffect(() => {
    const setupAsync = async () => {
      if (!settings.length) {
        resetSetting()
      } else setSecondsLeft(settings[selectedIndex]?.value?.secs ?? 0)
    }
    setupAsync()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sport Timer </Text>
      <View style={styles.button}>
        <IconButton
          icon={'gear'}
          onPress={() => {
            router.push('/timersetting')
          }}
          size={iconSize}
          color="#ffffff"
        />
      </View>
      <IconButton
        icon={'stopwatch'}
        onPress={() => {
          router.push('/timer')
        }}
        size={iconSize}
      />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.original.background,
  },
  title: {
    fontSize: 50,
  },
  button: {},
})

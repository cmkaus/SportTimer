import { View, StyleSheet, Text, Image } from 'react-native'
import { router } from 'expo-router'
import { IconButton } from '@/components/Common/Button/IconButton'
import { colors } from '@/common/styles'
import { useTimeContext } from '@/Provider/TimeProvider'
import { useEffect, useRef, useState } from 'react'
import { getAllKeys, storeData, storeDatas } from '@/storage/localstorage'

const iconSize = 100
const icon = require('../../assets/icons/jiu-jitsu.png')

const index = () => {
  const { setSecondsLeft, settings, selectedIndex, resetSetting, setSettings } =
    useTimeContext()

  useEffect(() => {
    const loadSettings = async () => {
      const keys = await getAllKeys()
      // keys?.forEach(async k => await removeKey(k))
      if (!keys?.length) {
        const initialSettings = [
          { key: 'First', value: { id: 'First', secs: 90, restSecs: 30 } },
          { key: 'Second', value: { id: 'Second', secs: 10, restSecs: 2 } },
        ]
        await storeDatas(initialSettings)
        setSettings(initialSettings)
        return
      }
    }

    loadSettings()
  }, [])

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
      <View style={styles.header}>
        <Image
          source={icon}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sport Timer </Text>
      </View>
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
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
  header: { gap: 10, alignItems: 'center', justifyContent: 'center' },
  button: {},
})

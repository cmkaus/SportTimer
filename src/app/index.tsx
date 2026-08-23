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
  const { resetSetting, loadSetting, hasSetting } = useTimeContext()

  useEffect(() => {
    const loadInitialSettings = async () => {
      const keys = await getAllKeys()
      // keys?.forEach(async k => await removeKey(k))
      hasSetting.current = !!keys?.length
      if (!keys?.length) {
        const initialSettings = [
          { key: 'Test', value: { id: 'Test', secs: 10, restSecs: 10 } },
          { key: 'Short', value: { id: 'Short', secs: 90, restSecs: 30 } },
          { key: 'Long', value: { id: 'Second', secs: 270, restSecs: 10 } },
        ]
        await storeDatas(initialSettings)
        resetSetting()
      }
    }

    if (!hasSetting) loadInitialSettings()
    loadSetting()
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
          backgroundColor={colors.original.background}
        />
      </View>
      <IconButton
        icon={'stopwatch'}
        onPress={() => {
          router.push('/timer')
        }}
        size={iconSize}
        backgroundColor={colors.original.background}
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

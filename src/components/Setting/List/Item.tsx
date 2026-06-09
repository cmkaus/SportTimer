import { View, Text, StyleSheet, Platform } from 'react-native'
import { type Setting } from '../types'
import { getDigitDisplay } from '@/helper/getDigitDisplay'
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'
import FontAwesome from '@expo/vector-icons/FontAwesome6'
import {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Animated from 'react-native-reanimated'
import React, { useCallback } from 'react'
import { removeKey } from '@/storage/localstorage'

type Props = {
  setting: Setting
  refresh: () => void
}

export const Item: React.FC<Props> = ({ setting, refresh }) => {
  const deleteAction = useCallback(() => {
    removeKey(setting.id)
  }, [setting.id])

  return (
    <ReanimatedSwipeable
      leftThreshold={300}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={direction => {
        if (direction === 'right') {
          deleteAction()
          refresh()
        }
      }}
    >
      <View style={styles.container}>
        <Text style={[styles.text, styles.textId]}>{`${setting.id}:`}</Text>
        <Text style={styles.text}>{getDigitDisplay(setting.secs)}</Text>
        <Text style={styles.text}>
          Rest {getDigitDisplay(setting.restSecs)}
        </Text>
      </View>
    </ReanimatedSwipeable>
  )
}

function renderLeftActions(
  progress: SharedValue<number>,
  translation: SharedValue<number>,
  swipeableMethods: SwipeableMethods,
) {
  swipeableMethods.close()

  const animatedIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progress?.value ?? 0,
      [0, 40],
      [0, 4],
      Extrapolation.CLAMP,
    )

    const translateX = interpolate(
      translation.value ?? 0,
      [0, 30],
      [0.5, 100],
      Extrapolation.CLAMP,
    )

    return {
      transform: [{ scale }, { translateX }],
    }
  })

  return (
    <View style={styles.iconWrapper}>
      <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
        <FontAwesome
          name={'trash'}
          size={20}
          color={'white'}
          style={styles.icon}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,

    borderRadius: 70,
    borderColor: 'white',
    borderWidth: 1,

    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    // iOS shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 10px 10px rgba(0,0,0,0.18)',
      },
    }),
  },
  text: { fontSize: 15, fontWeight: 'bold' },
  textId: {
    maxWidth: 100,
    minWidth: 80,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icon: {},
  iconWrapper: {
    justifyContent: 'center',
  },
})

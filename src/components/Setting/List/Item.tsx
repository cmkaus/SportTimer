import { getDigitDisplay } from '@/helper/getDigitDisplay'
import { removeKeyAsync } from '@/storage/localstorage'
import FontAwesome from '@expo/vector-icons/FontAwesome6'
import React, { useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { type Setting } from '../types'

const { width } = useWindowDimensions()
const threshold30 = width * 0.2

type Props = {
  setting: Setting
  refresh: () => void
}

export const Item: React.FC<Props> = ({ setting, refresh }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteAction = async () => {
    setIsDeleting(true)
    await removeKeyAsync(setting.id)
    setIsDeleting(false)
  }

  return (
    <ReanimatedSwipeable
      leftThreshold={threshold30}
      enabled={!isDeleting}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={async direction => {
        if (direction === 'right' && !isDeleting) {
          refresh()
        }
        console.log('onSwipeableOpen')
      }}
      onSwipeableWillOpen={async direction => {
        if (direction === 'right' && !isDeleting) {
          await deleteAction()
          refresh()
        }
      }}
    >
      <View style={styles.container}>
        <Text style={[styles.text, styles.textId]}>{`${setting.id}:`}</Text>
        <Text style={styles.text}>
          {getDigitDisplay(setting.secs)} | {getDigitDisplay(setting.restSecs)}
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
  swipeableMethods.reset()
  const animatedIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progress?.value ?? 0,
      [0, 3],
      [0, 2],
      Extrapolation.CLAMP,
    )
    const translateX = interpolate(
      translation.value ?? 0,
      [0, 30],
      [5, 10],
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

    borderRadius: 10,
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
  text: { fontSize: 20, lineHeight: 20 },
  textId: {
    minWidth: 80,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icon: {},
  iconWrapper: {
    justifyContent: 'center',
  },
})

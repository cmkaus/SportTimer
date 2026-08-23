import { StyleSheet, Pressable, View, Animated, Platform } from 'react-native'
import { useRef } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome6'

type IconButtonProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name']
  onPress: () => void
  backgroundColor: string
  size?: number
  label?: string
  isDisabled?: boolean
  color?: string
}

export const IconButton = ({
  icon,
  size = 30,
  onPress,
  backgroundColor,
  isDisabled = false,
  color = '#000',
}: IconButtonProps) => {
  const iconSize = size * 0.5
  const scaleValue = useRef(new Animated.Value(1)).current
  const handlePressIn = () => {
    if (isDisabled) return
    Animated.timing(scaleValue, {
      toValue: 0.7,
      duration: 50,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    if (isDisabled) return
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start(finished => {
      finished ? onPress() : null
    })
  }

  const elevation = size / 20

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
        },
        isDisabled && styles.disabledButton,
      ]}
    >
      <Animated.View
        style={[styles.buttonWrapper, { transform: [{ scale: scaleValue }] }]}
      >
        <Pressable
          disabled={isDisabled}
          style={[
            styles.button,
            isDisabled && styles.disabledButton,
            { elevation },
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <FontAwesome
            name={icon}
            size={iconSize}
            color={color}
            style={styles.buttonIcon}
          />
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    elevation: 8,

    shadowColor: '#2c2b2b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 25,
    shadowRadius: 1,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    // shadowColor: '#2c2b2b',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 25,
    // shadowRadius: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    // marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
})

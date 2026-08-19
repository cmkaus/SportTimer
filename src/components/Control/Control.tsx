import { View, StyleSheet, Text } from 'react-native'
import { IconButton } from '../Common/Button/IconButton'
import { router } from 'expo-router'

type Props = {
  playPress: () => void
  pausePress: () => void
  resetPress: () => void
  selectorPress: (getNext: boolean) => void
  isPaused: boolean
  selectorText: string
}

export const Controls = ({
  isPaused,
  playPress,
  pausePress,
  resetPress,
  selectorPress,
  selectorText,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionButton}>
        {isPaused ? (
          <IconButton
            size={60}
            icon="play"
            onPress={() => {
              playPress()
            }}
          />
        ) : (
          <IconButton size={60} icon="pause" onPress={pausePress} />
        )}
      </View>

      <View style={styles.selectorContainer}>
        <View style={styles.selectorPrev}>
          <IconButton
            size={60}
            icon="arrow-left"
            onPress={() => selectorPress(false)}
          />
        </View>
        <Text style={styles.selectortext}>{selectorText}</Text>
        <View style={styles.selectorNext}>
          <IconButton
            size={60}
            icon="arrow-right"
            onPress={() => selectorPress(true)}
          />
        </View>
      </View>

      <View style={styles.rightContainerButton}>
        <IconButton size={60} icon="rotate-left" onPress={resetPress} />
        <IconButton
          size={60}
          icon="house"
          onPress={() => router.push('/')}
          isDisabled={!isPaused}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 40,
  },

  selectorContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginInline: 10,
  },
  selectorPrev: {},
  selectortext: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 20,
    overflow: 'hidden',
  },
  selectorNext: {},

  rightContainerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginInline: 10,
  },
})

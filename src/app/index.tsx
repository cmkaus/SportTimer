import { View, StyleSheet, Text } from 'react-native'
import { router } from 'expo-router'
import { IconButton } from '@/components/Common/Button/IconButton'
import { colors } from '@/common/styles'
const iconSize = 100
const index = () => {
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
    backgroundColor: colors.light.background,
  },
  title: {
    fontSize: 50,
  },
  button: {},
})

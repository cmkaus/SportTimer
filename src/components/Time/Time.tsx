import { getDigitDisplay } from '@/helper/getDigitDisplay'
import { View, Text, StyleSheet } from 'react-native'

type Props = { seconds: number; fontSize: number }

export const Time = ({ seconds, fontSize }: Props) => {
  if (seconds > 3600) {
    return (
      <View style={styles.container}>
        <Text style={[styles.timeText, { fontSize: 100 }]}>
          More than an hour
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.timeText, { fontSize }]}>
        {getDigitDisplay(seconds)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  timeText: {
    fontFamily: 'DigitalNormal4',
    includeFontPadding: false,
  },
})

import {
  convertSeconds,
  getMinutes,
  getSeconds,
} from '@/helper/getDigitDisplay'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TimerPicker } from 'react-native-timer-picker'
import { Setting } from '../Setting/types'

type ModalViewProps = {
  isVisible: boolean
  setVisibility: (isVisible: boolean) => void
  setting: Setting
  saveAction: (setting: Setting) => void
}

export const ModalViewTimer = ({
  isVisible,
  setVisibility,
  setting,
  saveAction,
}: ModalViewProps) => {
  const insets = useSafeAreaInsets()
  console.log({ insets: insets })
  const [chosenTime, setChosenTime] = useState<Time>({
    minutes: getMinutes(setting.secs),
    seconds: getSeconds(setting.secs),
  })
  const [chosenRestTime, setChosenRestTime] = useState<Time>({
    minutes: getMinutes(setting.restSecs),
    seconds: getSeconds(setting.restSecs),
  })

  const saveOnClick = () => {
    setting.secs = convertSeconds(chosenTime.minutes, chosenTime.seconds)
    setting.restSecs = convertSeconds(
      chosenRestTime.minutes,
      chosenRestTime.seconds,
    )
    saveAction(setting)
    setVisibility(false)
  }
  return (
    <Modal
      animationType="slide" // Options: 'none', 'slide', 'fade'
      transparent={true} // Allows background layout screen visibility
      visible={isVisible} // Tracks open or closed state drivers
      onRequestClose={() => setVisibility(false)} // Handles hardware back button on Android
    >
      {/* 3. Semi-Transparent Dimming Backdrop */}
      <View style={styles.backdropLayer}>
        <View style={[styles.modalCard, { bottom: insets.bottom }]}>
          <Text style={styles.modalTitle}>Set ID: {setting.id}</Text>

          <View style={styles.modalBody}>
            <Text>Length</Text>
            <TimerPicker
              initialValue={chosenTime}
              hideHours={true} // Removes the hour wheel, leaving only mins and secs
              padMinutesWithZero={true}
              padSecondsWithZero={true}
              LinearGradient={LinearGradient}
              styles={{
                pickerItem: styles.pickerItem,
                pickerLabel: styles.pickerLabel,
              }}
              onDurationChange={duration => {
                setChosenTime({
                  minutes: duration.minutes,
                  seconds: duration.seconds,
                })
              }}
            />
          </View>

          <View style={styles.modalBody}>
            <Text>Rest Length</Text>
            <TimerPicker
              initialValue={chosenRestTime}
              hideHours={true} // Removes the hour wheel, leaving only mins and secs
              padMinutesWithZero={true}
              padSecondsWithZero={true}
              LinearGradient={LinearGradient} // Needed for the top/bottom fade effect
              styles={{
                pickerItem: { fontSize: 24, color: '#000' },
                pickerLabel: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#666',
                },
              }}
              onDurationChange={duration => {
                setChosenRestTime({
                  minutes: duration.minutes,
                  seconds: duration.seconds,
                })
              }}
            />
          </View>
          <Pressable style={styles.saveButton} onPress={() => saveOnClick()}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

type Time = { minutes: number; seconds: number }

const styles = StyleSheet.create({
  backdropLayer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim level alpha filter opacity
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    // alignItems: 'center',
    // Smooth shadows using your preferred pill style layout framework
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: {
    // flex: 1,
    // flexDirection: 'row',
    // fontSize: 14,
    // color: '#555',
    // textAlign: 'center',
    // marginBottom: 20,
  },
  inputBody: {
    height: 45,
    width: 100,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#07a011',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: { color: '#fff', fontWeight: '600' },

  pickerItem: { fontSize: 24, color: '#000' },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  textInput: {},
})

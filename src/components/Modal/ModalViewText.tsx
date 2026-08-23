import {
  View,
  Modal,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { storeData } from '@/storage/localstorage'

type ModalViewProps = {
  isVisible: boolean
  setVisibility: (isVisible: boolean) => void
  refresh: () => void
}

export const ModalViewText = ({
  isVisible,
  setVisibility,
  refresh,
}: ModalViewProps) => {
  const [text, setText] = useState<string>()
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const onSaveClick = () => {
    if (text) {
      storeData(text, { id: text, secs: 10, restSecs: 10 })
    }
    setText(undefined)
    setVisibility(false)
    refresh()
  }

  return (
    <Modal
      animationType="fade" // Options: 'none', 'slide', 'fade'
      transparent={true} // Allows background layout screen visibility
      visible={isVisible} // Tracks open or closed state drivers
      onRequestClose={() => setVisibility(false)} // Handles hardware back button on Android
    >
      {/* 3. Semi-Transparent Dimming Backdrop */}
      <View style={styles.backdropLayer}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Set Timer's name</Text>
          <View style={styles.modalBody}>
            <TextInput
              style={styles.input}
              placeholder="Timer's name"
              placeholderTextColor="#888"
              onChangeText={value => setText(value)}
              value={text}
              autoFocus={true}
              editable={true}
              ref={inputRef}
            />
          </View>

          <Pressable style={styles.saveButton} onPress={() => onSaveClick()}>
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
  input: {
    height: 45,
    width: 500,
    paddingHorizontal: 12,
    // borderRadius: 6,
    fontSize: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
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

import { colors } from '@/common/styles'
import { IconButton } from '@/components/Common/Button/IconButton'
import { ModalViewText } from '@/components/Modal/ModalViewText'
import { ModalViewTimer } from '@/components/Modal/ModalViewTimer'
import { Item } from '@/components/Setting/List/Item'
import { Setting } from '@/components/Setting/types'
import { useTimeContext } from '@/Provider/TimeProvider'
import { storeData } from '@/storage/localstorage'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TimerSetting = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [isModalVisible, setisModalVisible] = useState(false)
  const [isModalTextVisible, setIsModalTextVisible] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<Setting | undefined>(
    undefined,
  )

  const insets = useSafeAreaInsets()

  const { settings, resetSetting } = useTimeContext()

  const onSelectItemClick = (setting: Setting) => {
    setSelectedSetting(setting)
    setisModalVisible(true)
  }

  const onSaveSettingClick = async (setting: Setting) => {
    setisModalVisible(false)
    await storeData(setting.id, setting)
    setSelectedSetting(undefined)

    resetSetting()
  }

  const handleModalVisibility = (value: boolean) => {
    setisModalVisible(value)
    if (!value) {
      setSelectedSetting(undefined)
    }
  }

  const onNewItemClick = () => {
    setIsModalTextVisible(true)
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.listContainer, { top: insets.top }]}>
        <FlatList
          data={settings}
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            return (
              <Pressable onPress={() => onSelectItemClick(item.value)}>
                <View style={styles.itemRow}>
                  <Item setting={item.value} refresh={() => resetSetting()} />
                </View>
              </Pressable>
            )
          }}
          // --- iOS Content Adjustments ---
          // Tells iOS to treat the top 60 pixels as an untouchable buffer zone
          contentInset={{ top: 60 }}
          // Forces the viewport window to default sit at that offset point
          contentOffset={{ x: 0, y: -60 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true)
                setTimeout(() => setRefreshing(false), 2000)
              }}
              // --- Android Spinner Displacement ---
              progressViewOffset={60}
              tintColor="#000"
            />
          }
        />
      </View>

      {isModalVisible && selectedSetting && (
        <ModalViewTimer
          isVisible={isModalVisible}
          setVisibility={handleModalVisibility}
          setting={selectedSetting}
          saveAction={onSaveSettingClick}
        />
      )}

      <ModalViewText
        isVisible={isModalTextVisible}
        setVisibility={setIsModalTextVisible}
        refresh={resetSetting}
      />

      <View style={[styles.button, { bottom: insets.bottom + 10 }]}>
        <IconButton
          icon="plus"
          size={60}
          onPress={() => onNewItemClick()}
          backgroundColor={colors.original.background}
        />
        <IconButton
          icon="house"
          size={60}
          onPress={() => router.push('/')}
          backgroundColor={colors.original.background}
        />
      </View>
    </View>
  )
}

export default TimerSetting

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.original.background,
  },
  listContainer: { marginInline: 10 },
  itemRow: { marginTop: 5 },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    margin: 10,
  },

  // Fills full device window to blur out primary background layouts
  backdropLayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim level alpha filter opacity
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    // Smooth shadows using your preferred pill style layout framework
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalBody: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute', // Pulls the button out of the normal layout flow
    width: 56,
    height: 56,
    borderRadius: 28,
    // backgroundColor: '#6200ea',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Shadow for Android
    elevation: 8,
  },
})

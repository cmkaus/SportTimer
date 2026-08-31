import { getAllSettings, StoreSettingItem } from '@/storage/localstorage'
import { createContext, ReactNode, useContext, useRef, useState } from 'react'

interface TimeContextType {
  secondsLeft: number
  setSecondsLeft: React.Dispatch<React.SetStateAction<number>>
  isPaused: boolean
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>
  selectedIndex: number
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
  settings: StoreSettingItem[]
  setSettings: React.Dispatch<React.SetStateAction<StoreSettingItem[]>>
  isRest: boolean
  setIsRest: React.Dispatch<React.SetStateAction<boolean>>
  timerStartedRef: React.RefObject<number | null>
  timerLeftRef: React.RefObject<number | null>
  resetSetting: () => void
  loadSetting: () => void
  hasSetting: React.RefObject<boolean>
}

const TimeContext = createContext<TimeContextType | null>(null)

export const TimeProvider = ({ children }: { children: ReactNode }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [settings, setSettings] = useState<StoreSettingItem[]>([])

  const [isPaused, setIsPaused] = useState(true)
  const [isRest, setIsRest] = useState<boolean>(false)

  const timerStartedRef = useRef<number | null>(null)
  const timerLeftRef = useRef<number | null>(null)
  // const appStateRef = useRef(AppState.currentState)
  const hasSetting = useRef<boolean>(false)

  const resetSetting = async () => {
    setIsRest(false)
    const storeSettings = await getAllSettings()
    setSettings(storeSettings)
    setSecondsLeft(storeSettings[0]?.value.secs)
    setSelectedIndex(0)
  }
  const loadSetting = async () => {
    if (!secondsLeft) {
      const storeSettings = await getAllSettings()
      setSettings(storeSettings)
      setSecondsLeft(storeSettings[selectedIndex]?.value.secs)
      setSelectedIndex(0)
    }
  }

  return (
    <TimeContext.Provider
      value={{
        isPaused,
        setIsPaused,
        selectedIndex,
        setSelectedIndex,
        settings,
        setSettings,
        isRest,
        setIsRest,
        secondsLeft,
        setSecondsLeft,
        timerStartedRef,
        timerLeftRef,
        resetSetting,
        loadSetting,
        hasSetting,
      }}
    >
      {children}
    </TimeContext.Provider>
  )
}

export const useTimeContext = () => {
  const context = useContext(TimeContext)

  if (!context) {
    throw new Error('useTimeContext must be used within a TimeProvider')
  }
  return context
}

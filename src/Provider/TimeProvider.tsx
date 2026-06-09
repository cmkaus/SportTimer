import { StoreSettingItem } from '@/storage/localstorage'
import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { AppState } from 'react-native'

interface TimeContextType {
  secondsLeft: number
  setSecondsLeft: React.Dispatch<React.SetStateAction<number>>
  isPaused: boolean
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>
  selectedIndex: number
  setSelectIndex: React.Dispatch<React.SetStateAction<number>>
  settings: StoreSettingItem[]
  setSettings: React.Dispatch<React.SetStateAction<StoreSettingItem[]>>
  isRest: boolean
  setIsRest: React.Dispatch<React.SetStateAction<boolean>>
  timerStartRef: React.RefObject<number | null>
  timeLeftRef: React.RefObject<number | null>
}

const TimeContext = createContext<TimeContextType | null>(null)

export const TimeProvider = ({ children }: { children: ReactNode }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0)
  const [isPaused, setIsPaused] = useState(true)
  const [selectedIndex, setSelectIndex] = useState<number>(0)
  const [settings, setSettings] = useState<StoreSettingItem[]>([])

  const [isRest, setIsRest] = useState<boolean>(false)

  const timerStartRef = useRef<number | null>(null)
  const timeLeftRef = useRef<number | null>(null)
  const appStateRef = useRef(AppState.currentState)

  return (
    <TimeContext.Provider
      value={{
        secondsLeft,
        setSecondsLeft,
        isPaused,
        setIsPaused,
        selectedIndex,
        setSelectIndex,
        settings,
        setSettings,
        isRest,
        setIsRest,
        timerStartRef,
        timeLeftRef,
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

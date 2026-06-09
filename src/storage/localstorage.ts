// removed unused import
import { Setting } from '@/components/Setting/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeData = async (key: string, value: Setting) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // saving error
  }
}

export const getSetting = async (key: string): Promise<Setting | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue ? JSON.parse(jsonValue) : null
  } catch (e) {
    throw e
    // error reading value
  }
}

export const getSettings = async (
  keys: string[],
): Promise<StoreSettingItem[]> => {
  try {
    const keyValues = await AsyncStorage.multiGet(keys)
    if (keyValues.length === 0) return []

    return keyValues.flatMap(([key, value]) =>
      value ? [{ key, value: JSON.parse(value) as Setting }] : [],
    )
  } catch (e) {
    // error reading value
    return []
  }
}

export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys()
  } catch (e) {
    // error reading value
  }
}
export const removeKey = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key)
  } catch (e) {
    // error reading value
  }
}

export type StoreSettingItem = { key: string; value: Setting }

import RNAsyncStorage from '@react-native-async-storage/async-storage';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function webLocalStorageAdapter(): StorageLike | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  const { localStorage } = window;

  return {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, value) => {
      localStorage.setItem(key, value);
    },
    removeItem: async (key) => {
      localStorage.removeItem(key);
    },
  };
}

/** Used by Zustand persist; web localStorage in Node validation, RN AsyncStorage on device. */
const asyncStorage: StorageLike = webLocalStorageAdapter() ?? RNAsyncStorage;

export default asyncStorage;

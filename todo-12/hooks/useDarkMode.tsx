import { useEffect, useState } from "react";

const useLocalStorage = (key: any, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const useDarkMode = () => {
    const [enabled, setEnabled] = useLocalStorage('dark-theme', undefined);
    const isEnabled = enabled;
  
    useEffect(() => {
      const className = 'dark';
      const bodyClass = window.document.body.classList;
  
      isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
    }, [enabled, isEnabled]);
  
    return [enabled, setEnabled];
  };

  export default useDarkMode;
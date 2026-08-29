import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const storedName = await AsyncStorage.getItem('@userName');
      const storedTheme = await AsyncStorage.getItem('@theme');
      const storedFont = await AsyncStorage.getItem('@fontSize');
      
      if (storedName) {
        setUserName(storedName);
        setIsFirstLaunch(false);
      }
      if (storedTheme) setTheme(storedTheme);
      if (storedFont) setFontSize(parseFloat(storedFont));
      setLoading(false);
    };
    loadSettings();
  }, []);

  const completeOnboarding = async (name, selectedTheme, selectedFont) => {
    await AsyncStorage.setItem('@userName', name);
    await AsyncStorage.setItem('@theme', selectedTheme);
    await AsyncStorage.setItem('@fontSize', selectedFont.toString());
    setUserName(name);
    setTheme(selectedTheme);
    setFontSize(selectedFont);
    setIsFirstLaunch(false);
  };

  const toggleTheme = async (newTheme) => {
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };

  const updateFontSize = async (newSize) => {
    setFontSize(newSize);
    await AsyncStorage.setItem('@fontSize', newSize.toString());
  };

  const colors = theme === 'light' ? {
    background: '#F4F9FF', card: '#FFFFFF', text: '#2C3E50', subtext: '#7F8C8D', border: '#E2E8F0', primary: '#1D70F5'
  } : {
    background: '#0F172A', card: '#1E293B', text: '#F8FAFC', subtext: '#94A3B8', border: '#334155', primary: '#38BDF8'
  };

  return (
    <AppContext.Provider value={{
      isFirstLaunch, userName, theme, toggleTheme, fontSize, updateFontSize, 
      isAdmin, setIsAdmin, isSidebarOpen, setIsSidebarOpen, colors, completeOnboarding, loading
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
};
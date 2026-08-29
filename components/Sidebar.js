import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen, userName, theme, toggleTheme, fontSize, updateFontSize, isAdmin, setIsAdmin, colors } = useContext(AppContext);
  
  // Two separate animations: one for the slide, one for the background fade
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isSidebarOpen ? 0 : width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: isSidebarOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [isSidebarOpen]);

  const handleTap = (action) => {
    Haptics.selectionAsync();
    action();
  };

  return (
    <View style={styles.overlay} pointerEvents={isSidebarOpen ? 'auto' : 'none'}>
      
      {/* Absolute Fading Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={() => setIsSidebarOpen(false)} 
        />
      </Animated.View>
      
      {/* Absolute Sliding Drawer */}
      <Animated.View style={[styles.drawer, { backgroundColor: colors.card, transform: [{ translateX: slideAnim }] }]}>
        
        <View style={styles.header}>
          <Ionicons name="person-circle" size={65} color={colors.primary} />
          <Text style={[styles.name, { color: colors.text, fontSize: 18 * fontSize }]}>Hello, {userName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Appearance</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleTap(() => toggleTheme('light'))} style={[styles.btn, theme === 'light' && { borderColor: colors.primary, backgroundColor: colors.background }]}>
              <Ionicons name="sunny" size={20} color={theme === 'light' ? colors.primary : colors.subtext} />
              <Text style={[styles.btnText, { color: colors.text }]}>Light</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleTap(() => toggleTheme('dark'))} style={[styles.btn, theme === 'dark' && { borderColor: colors.primary, backgroundColor: colors.background }]}>
              <Ionicons name="moon" size={20} color={theme === 'dark' ? colors.primary : colors.subtext} />
              <Text style={[styles.btnText, { color: colors.text }]}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Text Size</Text>
          <View style={styles.row}>
            {[0.9, 1, 1.15].map(size => (
              <TouchableOpacity 
                key={size} 
                onPress={() => handleTap(() => updateFontSize(size))} 
                style={[styles.btn, fontSize === size && { borderColor: colors.primary, backgroundColor: colors.background }]}
              >
                <Text style={{ color: colors.text, fontSize: 14 * size, fontFamily: 'Poppins_600SemiBold' }}>
                  {size === 0.9 ? 'Aa' : size === 1 ? 'AA' : 'AAA'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity 
          style={[styles.adminBtn, { backgroundColor: isAdmin ? '#FF6B6B' : colors.primary }]} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsSidebarOpen(false);
            if (isAdmin) {
              setIsAdmin(false);
            } else {
              setTimeout(() => navigation.navigate('AdminLogin'), 300);
            }
          }}
        >
          <Ionicons name={isAdmin ? "log-out" : "lock-closed"} size={20} color="#FFF" />
          <Text style={styles.adminText}>{isAdmin ? "Logout Admin" : "Admin Login"}</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', width: '100%', height: '100%', zIndex: 1000 },
  backdrop: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
  drawer: { position: 'absolute', right: 0, width: '75%', height: '100%', padding: 25, paddingTop: 70, elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  name: { fontFamily: 'Poppins_700Bold', marginTop: 10 },
  section: { marginBottom: 35 },
  sectionTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, paddingVertical: 12, borderWidth: 2, borderColor: 'transparent', borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(150,150,150,0.05)', flexDirection: 'row', gap: 6 },
  btnText: { fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
  spacer: { flex: 1 },
  adminBtn: { padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center', marginBottom: 20 },
  adminText: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 16 }
});
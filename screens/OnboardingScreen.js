import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function OnboardingScreen() {
  const { completeOnboarding } = useContext(AppContext);
  const [name, setName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedFont, setSelectedFont] = useState(1);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (name.trim()) completeOnboarding(name.trim(), selectedTheme, selectedFont);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="rocket" size={50} color="#1D70F5" />
          <Text style={styles.title}>Welcome to SBIT-2A Hub!</Text>
          <Text style={styles.subtitle}>Let's customize your workspace.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>What should we call you?</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your nickname..." 
            placeholderTextColor="#A0AEC0"
            value={name} 
            onChangeText={setName} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Choose your theme</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setSelectedTheme('light')} style={[styles.optionBtn, selectedTheme === 'light' && styles.optionActive]}>
              <Ionicons name="sunny" size={20} color={selectedTheme === 'light' ? '#1D70F5' : '#7F8C8D'} />
              <Text style={[styles.optionText, selectedTheme === 'light' && styles.textActive]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTheme('dark')} style={[styles.optionBtn, selectedTheme === 'dark' && styles.optionActive]}>
              <Ionicons name="moon" size={20} color={selectedTheme === 'dark' ? '#1D70F5' : '#7F8C8D'} />
              <Text style={[styles.optionText, selectedTheme === 'dark' && styles.textActive]}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Choose text size</Text>
          <View style={styles.row}>
            {[0.9, 1, 1.15].map(size => (
              <TouchableOpacity key={size} onPress={() => setSelectedFont(size)} style={[styles.optionBtn, selectedFont === size && styles.optionActive]}>
                <Text style={[styles.optionText, selectedFont === size && styles.textActive, { fontSize: 14 * size }]}>
                  {size === 0.9 ? 'Aa' : size === 1 ? 'AA' : 'AAA'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.btn, !name.trim() && { opacity: 0.5 }]} 
          onPress={handleFinish} 
          disabled={!name.trim()}
        >
          <Text style={styles.btnText}>Enter Hub</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: '#2C3E50', marginTop: 15 },
  subtitle: { fontSize: 15, fontFamily: 'Poppins_400Regular', color: '#7F8C8D' },
  section: { marginBottom: 25 },
  label: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: '#2C3E50', marginBottom: 10 },
  input: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#2C3E50', borderWidth: 1, borderColor: '#E2E8F0' },
  row: { flexDirection: 'row', gap: 10 },
  optionBtn: { flex: 1, paddingVertical: 15, borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: '#FFF', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  optionActive: { borderColor: '#1D70F5', backgroundColor: '#EFF6FF' },
  optionText: { fontFamily: 'Poppins_600SemiBold', color: '#7F8C8D' },
  textActive: { color: '#1D70F5' },
  btn: { backgroundColor: '#1D70F5', padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 },
  btnText: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 18 }
});
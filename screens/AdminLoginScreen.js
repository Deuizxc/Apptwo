import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function AdminLoginScreen({ navigation }) {
  const { setIsAdmin, colors } = useContext(AppContext);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Hardcoded master password for SBIT-2A admins
    if (password === 'sbit2admin') {
      setIsAdmin(true);
      navigation.goBack();
      setTimeout(() => Alert.alert("Admin Access Granted", "You can now delete posts and make announcements."), 500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Access Denied", "Incorrect admin password.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.center}>
        <Ionicons name="shield-checkmark" size={60} color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={[styles.title, { color: colors.text }]}>Admin Authentication</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Restricted to SBIT-2A Class Officers</Text>
        
        <TextInput 
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
          placeholder="Enter Master Password" 
          placeholderTextColor={colors.subtext}
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
          autoCapitalize="none"
        />
        
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleLogin}>
          <Text style={styles.btnText}>Authenticate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: 'absolute', top: 50, right: 25, zIndex: 10 },
  center: { flex: 1, justifyContent: 'center', padding: 30 },
  title: { fontSize: 24, fontFamily: 'Poppins_700Bold', textAlign: 'center' },
  subtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', textAlign: 'center', marginBottom: 40 },
  input: { padding: 20, borderRadius: 15, fontFamily: 'Poppins_600SemiBold', marginBottom: 20, borderWidth: 1, fontSize: 16, textAlign: 'center' },
  btn: { padding: 20, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 16 }
});
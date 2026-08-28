import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Animated } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

export default function FundsScreen() {
  const [sheetLink, setSheetLink] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0); slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ]).start();
      
      getDoc(doc(db, 'settings', 'funds')).then(snap => { 
        if (snap.exists()) { setSheetLink(snap.data().url); setTempLink(snap.data().url); }
      });
    }, [])
  );

  const save = async () => { await setDoc(doc(db, 'settings', 'funds'), { url: tempLink }); setSheetLink(tempLink); setEditMode(false); };

  return (
    <View style={styles.container}>
      <View style={styles.bgBlobEmerald} />
      <View style={styles.bgBlobTeal} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.headerArea}>
          <Text style={styles.headerTitle}>Class Ledger</Text>
          <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.adminBadge}>
            <Text style={styles.adminText}>{isAdmin ? 'Admin' : 'Student'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {!editMode && (
            <TouchableOpacity onPress={() => sheetLink && Linking.openURL(sheetLink)} style={{width: '100%'}}>
              <BlurView intensity={70} tint="light" style={styles.openBtnGlass}>
                <Ionicons name="pie-chart" size={40} color="#059669" style={{marginBottom: 10}} />
                <Text style={styles.openText}>{sheetLink ? 'Open Transparency Ledger' : 'No Ledger Linked'}</Text>
                <Text style={styles.openSub}>Tap to view Google Sheets</Text>
              </BlurView>
            </TouchableOpacity>
          )}

          {isAdmin && !editMode && (
            <TouchableOpacity onPress={() => setEditMode(true)} style={{marginTop: 30}}>
              <Text style={styles.editText}>✏️ Edit Google Sheets URL</Text>
            </TouchableOpacity>
          )}

          {isAdmin && editMode && (
            <View style={styles.card}>
              <Text style={styles.label}>Spreadsheet Link:</Text>
              <TextInput style={styles.input} placeholder="https://docs.google.com/..." value={tempLink} onChangeText={setTempLink} />
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}><Text style={{color: '#FFF'}}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={save}><Text style={{color: '#FFF', fontWeight: 'bold'}}>Save Link</Text></TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  bgBlobEmerald: { position: 'absolute', top: -50, right: -50, width: 350, height: 350, backgroundColor: '#10B981', borderRadius: 175, opacity: 0.15 },
  bgBlobTeal: { position: 'absolute', bottom: 100, left: -100, width: 300, height: 300, backgroundColor: '#06B6D4', borderRadius: 150, opacity: 0.1 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50' },
  adminBadge: { backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  adminText: { color: '#059669', fontWeight: 'bold', fontSize: 12 },
  content: { paddingHorizontal: 25, alignItems: 'center' },
  openBtnGlass: { width: '100%', padding: 40, borderRadius: 30, alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  openText: { color: '#2C3E50', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  openSub: { color: '#059669', fontSize: 13, marginTop: 5, fontWeight: 'bold' },
  editText: { color: '#059669', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#FFF', padding: 25, borderRadius: 24, width: '100%', elevation: 3 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#A0AEC0', padding: 15, borderRadius: 12, alignItems: 'center' },
  saveBtn: { flex: 1, backgroundColor: '#10B981', padding: 15, borderRadius: 12, alignItems: 'center' }
});
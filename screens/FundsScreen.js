import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Animated } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
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
      {/* Sharp Geometric Vault Header */}
      <View style={styles.vaultHeader} />
      <View style={styles.vaultAccent} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.headerArea}>
          <Text style={styles.headerTitle}>Class Ledger</Text>
          <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.adminBadge}>
            <Text style={styles.adminText}>{isAdmin ? 'Admin' : 'Student'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.balanceCard}>
            <Ionicons name="shield-checkmark" size={40} color="#F59E0B" style={{marginBottom: 10}} />
            <Text style={styles.balanceSub}>Financial Transparency</Text>
            <Text style={styles.balanceDesc}>All collections and expenses are tracked live.</Text>
          </View>

          {!editMode && (
            <TouchableOpacity onPress={() => sheetLink && Linking.openURL(sheetLink)} style={styles.openBtn}>
              <Ionicons name="folder-open" size={24} color="#FFF" />
              <Text style={styles.openText}>{sheetLink ? 'Open Google Sheets' : 'No Ledger Linked'}</Text>
            </TouchableOpacity>
          )}

          {isAdmin && !editMode && (
            <TouchableOpacity onPress={() => setEditMode(true)} style={{marginTop: 25}}>
              <Text style={styles.editText}>Configure Document Link</Text>
            </TouchableOpacity>
          )}

          {isAdmin && editMode && (
            <View style={styles.editCard}>
              <Text style={styles.label}>Paste Link Here:</Text>
              <TextInput style={styles.input} placeholder="https://docs.google.com/..." value={tempLink} onChangeText={setTempLink} />
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}><Text style={{color: '#64748B', fontWeight:'bold'}}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={save}><Text style={{color: '#FFF', fontWeight: 'bold'}}>Secure Link</Text></TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  vaultHeader: { position: 'absolute', top: -50, width: '150%', height: 350, backgroundColor: '#059669', transform: [{ skewY: '-8deg' }], left: '-25%' },
  vaultAccent: { position: 'absolute', top: 250, width: '150%', height: 50, backgroundColor: '#F59E0B', transform: [{ skewY: '-8deg' }], left: '-25%', opacity: 0.9 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  adminBadge: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  adminText: { color: '#059669', fontWeight: 'bold', fontSize: 12 },
  content: { paddingHorizontal: 25, alignItems: 'center', marginTop: 40 },
  balanceCard: { backgroundColor: '#FFF', width: '100%', padding: 30, borderRadius: 16, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 20 },
  balanceSub: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  balanceDesc: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 8 },
  openBtn: { flexDirection: 'row', backgroundColor: '#10B981', paddingVertical: 18, paddingHorizontal: 25, borderRadius: 12, width: '100%', justifyContent: 'center', alignItems: 'center', elevation: 3, gap: 10 },
  openText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  editText: { color: '#059669', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline' },
  editCard: { backgroundColor: '#FFF', padding: 25, borderRadius: 16, width: '100%', elevation: 4, borderWidth: 1, borderColor: '#E5E7EB' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 10 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#D1D5DB' },
  actionRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#E5E7EB', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveBtn: { flex: 1, backgroundColor: '#059669', padding: 15, borderRadius: 8, alignItems: 'center' }
});
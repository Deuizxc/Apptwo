import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function FundsScreen() {
  const [sheetLink, setSheetLink] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'funds')).then(snap => { if (snap.exists()) { setSheetLink(snap.data().url); setTempLink(snap.data().url); }});
  }, []);

  const save = async () => { await setDoc(doc(db, 'settings', 'funds'), { url: tempLink }); setSheetLink(tempLink); setEditMode(false); };

  return (
    <View style={styles.container}>
      <View style={{ height: 90 }} />
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.glassToggle}>
          <Text style={styles.adminToggleText}>{isAdmin ? 'Admin View' : 'Student View'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!editMode && (
          <TouchableOpacity style={styles.openBtn} onPress={() => sheetLink && Linking.openURL(sheetLink)}>
            <Text style={styles.openText}>{sheetLink ? '📊 Open Ledger' : 'No Link Provided'}</Text>
          </TouchableOpacity>
        )}

        {isAdmin && !editMode && <TouchableOpacity onPress={() => setEditMode(true)}><Text style={styles.editText}>Update Link</Text></TouchableOpacity>}

        {isAdmin && editMode && (
          <View style={styles.card}>
            <TextInput style={styles.input} placeholder="Google Sheets URL" value={tempLink} onChangeText={setTempLink} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}><Text style={{color: '#FFF'}}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={save}><Text style={{color: '#FFF', fontWeight: 'bold'}}>Save</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  glassToggle: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20 },
  adminToggleText: { fontSize: 12, fontWeight: 'bold', color: '#2C3E50' },
  content: { padding: 20, alignItems: 'center' },
  openBtn: { backgroundColor: '#60C5F1', padding: 20, borderRadius: 24, width: '100%', alignItems: 'center', elevation: 5 },
  openText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  editText: { color: '#1D70F5', marginTop: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, width: '100%', elevation: 5 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 15 },
  cancelBtn: { flex: 1, backgroundColor: '#A0AEC0', padding: 15, borderRadius: 12, alignItems: 'center' },
  saveBtn: { flex: 1, backgroundColor: '#1D70F5', padding: 15, borderRadius: 12, alignItems: 'center' }
});
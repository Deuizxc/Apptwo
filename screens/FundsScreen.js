import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function FundsScreen() {
  const [sheetLink, setSheetLink] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadSheetLink();
  }, []);

  const loadSheetLink = async () => {
    try {
      const docRef = doc(db, 'settings', 'funds');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSheetLink(docSnap.data().url);
        setTempLink(docSnap.data().url);
      }
    } catch (error) {
      console.log('Error loading link:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSheetLink = async () => {
    try {
      await setDoc(doc(db, 'settings', 'funds'), { url: tempLink });
      setSheetLink(tempLink);
      setEditMode(false);
    } catch (error) {
      console.log('Error saving link:', error);
    }
  };

  const openSheet = () => {
    if (sheetLink) {
      Linking.openURL(sheetLink).catch(() => alert("Couldn't open the link. Make sure it is a valid URL starting with http or https."));
    } else {
      alert("No ledger link provided by the admin yet.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header & Admin Toggle */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Class Funds Ledger</Text>
        <TouchableOpacity style={styles.adminToggle} onPress={() => setIsAdmin(!isAdmin)}>
          <Text style={styles.adminToggleText}>{isAdmin ? 'Admin View' : 'Student View'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.description}>
            View the official SBIT-1A transparent treasury ledger directly via Google Sheets.
          </Text>

          {/* Student View: Open Button */}
          {!editMode && (
            <TouchableOpacity style={[styles.openButton, !sheetLink && styles.disabledButton]} onPress={openSheet}>
              <Text style={styles.openButtonText}>
                {sheetLink ? '📊 Open Google Sheets Ledger' : 'No Link Available'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Admin View: Edit Controls */}
          {isAdmin && !editMode && (
            <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
              <Text style={styles.editButtonText}>Update Ledger Link</Text>
            </TouchableOpacity>
          )}

          {/* Admin View: Edit Mode Active */}
          {isAdmin && editMode && (
            <View style={styles.editBox}>
              <Text style={styles.label}>Paste Google Sheets URL:</Text>
              <TextInput 
                style={styles.input} 
                placeholder="https://docs.google.com/spreadsheets/d/..." 
                value={tempLink} 
                onChangeText={setTempLink} 
              />
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditMode(false); setTempLink(sheetLink); }}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveSheetLink}>
                  <Text style={styles.btnText}>Save Link</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', elevation: 3 },
  header: { fontSize: 18, fontWeight: 'bold' },
  adminToggle: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  adminToggleText: { fontSize: 12, fontWeight: 'bold' },
  content: { padding: 20, alignItems: 'center', marginTop: 20 },
  description: { textAlign: 'center', color: '#555', marginBottom: 30, fontSize: 15, lineHeight: 22 },
  openButton: { backgroundColor: '#28a745', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 4, width: '100%', alignItems: 'center' },
  disabledButton: { backgroundColor: '#aaa', elevation: 0 },
  openButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  editButton: { marginTop: 20, padding: 10 },
  editButtonText: { color: '#007bff', fontWeight: 'bold', fontSize: 14 },
  editBox: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#444', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, backgroundColor: '#f9f9f9' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#888', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  saveBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
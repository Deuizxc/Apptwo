import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function HomeScreen() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addAnnouncement = async () => {
    if (newTitle && newBody) {
      await addDoc(collection(db, 'announcements'), {
        title: newTitle, body: newBody, author: 'Admin',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdAt: serverTimestamp()
      });
      setModalVisible(false); setNewTitle(''); setNewBody('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 90 }} />
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 15 }}>
        <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.glassToggle}>
          <Text style={styles.adminToggleText}>{isAdmin ? 'Admin View' : 'Student View'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1D70F5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {announcements.map((post) => (
            <View key={post.id} style={styles.opaqueCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{post.date}</Text>
                {isAdmin && (
                  <TouchableOpacity onPress={() => deleteDoc(doc(db, 'announcements', post.id))}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.body}>{post.body}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Post</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Announcement</Text>
            <TextInput style={styles.input} placeholder="Title" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={[styles.input, { height: 100 }]} placeholder="Message" value={newBody} onChangeText={setNewBody} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addAnnouncement}><Text style={styles.btnText}>Post</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  glassToggle: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  adminToggleText: { fontSize: 12, fontWeight: 'bold', color: '#2C3E50' },
  opaqueCard: { backgroundColor: '#FFFFFF', padding: 20, marginHorizontal: 20, marginBottom: 15, borderRadius: 24, elevation: 5, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  date: { color: '#60C5F1', fontSize: 12, fontWeight: 'bold' },
  deleteText: { color: '#FF6B6B', fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 5 },
  body: { fontSize: 14, color: '#7F8C8D', lineHeight: 22 },
  addButton: { position: 'absolute', bottom: 90, alignSelf: 'center', backgroundColor: '#60C5F1', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 8 },
  addButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 15, color: '#2C3E50' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#E0E6ED', padding: 12, borderRadius: 12, flex: 0.45, alignItems: 'center' },
  submitBtn: { backgroundColor: '#1D70F5', padding: 12, borderRadius: 12, flex: 0.45, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' }
});
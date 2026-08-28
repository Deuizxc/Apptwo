import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function WallScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'wall'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const postMessage = async () => {
    if (newMessage) {
      await addDoc(collection(db, 'wall'), { text: newMessage, author: 'Anonymous', time: new Date().toLocaleTimeString(), createdAt: serverTimestamp() });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 90 }} />
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.glassToggle}>
          <Text style={styles.adminToggleText}>{isAdmin ? 'Admin View' : 'Student View'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.bubble}>
            <Text style={styles.msgText}>{msg.text}</Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>{msg.author} • {msg.time}</Text>
              {isAdmin && <TouchableOpacity onPress={() => deleteDoc(doc(db, 'wall', msg.id))}><Text style={styles.delText}>Del</Text></TouchableOpacity>}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder="Share anonymously..." value={newMessage} onChangeText={setNewMessage} />
        <TouchableOpacity style={styles.sendBtn} onPress={postMessage}><Text style={{color: '#FFF', fontWeight:'bold'}}>Send</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  glassToggle: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20 },
  adminToggleText: { fontSize: 12, fontWeight: 'bold', color: '#2C3E50' },
  bubble: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, marginBottom: 10, elevation: 3 },
  msgText: { fontSize: 16, color: '#2C3E50', marginBottom: 5 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 11, color: '#A0AEC0' },
  delText: { color: '#FF6B6B', fontSize: 11, fontWeight: 'bold' },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: 'rgba(255,255,255,0.8)', marginBottom: 70 },
  input: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
  sendBtn: { backgroundColor: '#60C5F1', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 20 }
});
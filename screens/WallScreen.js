import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

export default function WallScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0); slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ]).start();

      const q = query(collection(db, 'wall'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    }, [])
  );

  const postMessage = async () => {
    if (newMessage) {
      await addDoc(collection(db, 'wall'), { text: newMessage, author: 'Anonymous', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), createdAt: serverTimestamp() });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgBlobPurple} />
      <View style={styles.bgBlobMagenta} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.headerArea}>
          <Text style={styles.headerTitle}>Freedom Wall</Text>
          <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.adminBadge}>
            <Text style={styles.adminText}>{isAdmin ? 'Admin' : 'Student'}</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
          {messages.map((msg) => (
            <BlurView intensity={60} tint="light" key={msg.id} style={styles.bubble}>
              <Text style={styles.msgText}>{msg.text}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>🤫 {msg.author} • {msg.time}</Text>
                {isAdmin && <TouchableOpacity onPress={() => deleteDoc(doc(db, 'wall', msg.id))}><Text style={styles.delText}>Delete</Text></TouchableOpacity>}
              </View>
            </BlurView>
          ))}
        </ScrollView>
      </Animated.View>

      <BlurView intensity={80} tint="light" style={styles.inputArea}>
        <TextInput style={styles.input} placeholder="Type anonymously..." placeholderTextColor="#A0AEC0" value={newMessage} onChangeText={setNewMessage} />
        <TouchableOpacity style={styles.sendBtn} onPress={postMessage}>
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlobPurple: { position: 'absolute', top: -50, right: -50, width: 350, height: 350, backgroundColor: '#6D5AED', borderRadius: 175, opacity: 0.15 },
  bgBlobMagenta: { position: 'absolute', bottom: 100, left: -100, width: 300, height: 300, backgroundColor: '#D946EF', borderRadius: 150, opacity: 0.1 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50' },
  adminBadge: { backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  adminText: { color: '#6D5AED', fontWeight: 'bold', fontSize: 12 },
  bubble: { padding: 20, borderRadius: 24, marginBottom: 12, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  msgText: { fontSize: 16, color: '#2C3E50', marginBottom: 8, lineHeight: 22 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 12, color: '#6B7280', fontWeight: 'bold' },
  delText: { color: '#FF6B6B', fontSize: 12, fontWeight: 'bold' },
  inputArea: { position: 'absolute', bottom: 75, left: 15, right: 15, flexDirection: 'row', padding: 10, borderRadius: 30, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  input: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, marginRight: 10, fontSize: 15 },
  sendBtn: { backgroundColor: '#6D5AED', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});
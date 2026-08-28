import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
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
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      
      return () => unsubscribe();
    }, [])
  );

  const postMessage = async () => {
    if (!newMessage.trim()) return;

    // Safe manual time formatting to bypass Android Hermes crashes
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const safeTime = `${hours}:${minutes} ${ampm}`;

    try {
      await addDoc(collection(db, 'wall'), {
        text: newMessage,
        author: 'Anonymous',
        time: safeTime,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      Alert.alert("Error", "Could not post message. Check your connection.");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete Post", "Are you sure you want to wipe this message?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteDoc(doc(db, 'wall', id)) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.blobViolet} />
      <View style={styles.blobGreen} />
      <View style={styles.blobBlue} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.headerArea}>
          <Text style={styles.headerTitle}>Freedom Wall</Text>
          <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.adminBadge}>
            <Text style={styles.adminText}>{isAdmin ? 'Admin' : 'Student'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.bubble}>
              <Text style={styles.msgText}>{msg.text}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>👻 {msg.author} • {msg.time}</Text>
                {isAdmin && (
                  <TouchableOpacity onPress={() => confirmDelete(msg.id)}>
                    <Text style={styles.delText}>Wipe</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Whisper something..."
          placeholderTextColor="#A0AEC0"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={postMessage}>
          <Ionicons name="paper-plane" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  blobViolet: { position: 'absolute', top: -50, right: -50, width: 350, height: 350, backgroundColor: '#6D5AED', borderRadius: 175, opacity: 0.25 },
  blobGreen: { position: 'absolute', bottom: 100, left: -100, width: 300, height: 300, backgroundColor: '#36E08B', borderRadius: 150, opacity: 0.25 },
  blobBlue: { position: 'absolute', top: '30%', left: '20%', width: 250, height: 250, backgroundColor: '#1D70F5', borderRadius: 125, opacity: 0.2 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50' },
  adminBadge: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  adminText: { color: '#6D5AED', fontWeight: 'bold', fontSize: 12 },
  bubble: { padding: 20, borderRadius: 24, marginBottom: 12, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderWidth: 1, borderColor: '#FFFFFF' },
  msgText: { fontSize: 16, color: '#2C3E50', marginBottom: 10, lineHeight: 22 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 12, color: '#6B7280', fontWeight: 'bold' },
  delText: { color: '#FF6B6B', fontSize: 12, fontWeight: 'bold' },
  inputArea: { position: 'absolute', bottom: 85, left: 15, right: 15, flexDirection: 'row', padding: 10, borderRadius: 30, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 1, borderColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  input: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 20, marginRight: 10, fontSize: 15, color: '#2C3E50' },
  sendBtn: { backgroundColor: '#6D5AED', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});
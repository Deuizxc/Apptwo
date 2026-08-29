import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { useState, useCallback, useRef, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

export default function WallScreen() {
  const { colors, fontSize, isAdmin, setIsSidebarOpen } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.blobViolet} />
      <View style={styles.blobGreen} />
      <View style={styles.blobBlue} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.headerArea}>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 28 * fontSize }]}>Freedom Wall</Text>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIsSidebarOpen(true); }}>
            <Ionicons name="menu" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.msgText, { color: colors.text, fontSize: 16 * fontSize }]}>{msg.text}</Text>
              <View style={styles.meta}>
                <Text style={[styles.metaText, { color: colors.subtext }]}>👻 {msg.author} • {msg.time}</Text>
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

      <View style={[styles.inputArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
          placeholder="Whisper something..."
          placeholderTextColor={colors.subtext}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={postMessage}>
          <Ionicons name="paper-plane" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blobViolet: { position: 'absolute', top: -50, right: -50, width: 350, height: 350, backgroundColor: '#6D5AED', borderRadius: 175, opacity: 0.25 },
  blobGreen: { position: 'absolute', bottom: 100, left: -100, width: 300, height: 300, backgroundColor: '#36E08B', borderRadius: 150, opacity: 0.25 },
  blobBlue: { position: 'absolute', top: '30%', left: '20%', width: 250, height: 250, backgroundColor: '#1D70F5', borderRadius: 125, opacity: 0.2 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontFamily: 'Poppins_700Bold' },
  bubble: { padding: 20, borderRadius: 24, marginBottom: 12, borderWidth: 1 },
  msgText: { fontFamily: 'Poppins_600SemiBold', marginBottom: 10, lineHeight: 24 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold' },
  delText: { color: '#FF6B6B', fontSize: 12, fontFamily: 'Poppins_700Bold' },
  inputArea: { position: 'absolute', bottom: 85, left: 15, right: 15, flexDirection: 'row', padding: 10, borderRadius: 30, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 20, marginRight: 10, fontSize: 15, fontFamily: 'Poppins_400Regular' },
  sendBtn: { width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});
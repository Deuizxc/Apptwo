import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  const [announcements, setAnnouncements] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
      ]).start();

      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }, [])
  );

  const addAnnouncement = async () => {
    if (newTitle && newBody) {
      await addDoc(collection(db, 'announcements'), {
        title: newTitle, body: newBody, author: 'Admin',
        date: new Date().toLocaleDateString(), createdAt: serverTimestamp()
      });
      setModalVisible(false); setNewTitle(''); setNewBody('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Blobs simulating the Wishlist wave */}
      <View style={styles.bgBlobBlue} />
      <View style={styles.bgBlobGreen} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.headerArea}>
          <Text style={styles.headerTitle}>SBIT-2A Hub</Text>
          <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.adminBadge}>
            <Text style={styles.adminText}>{isAdmin ? 'Admin' : 'Student'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          {announcements.map((post) => (
            <View key={post.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.date}>{post.date}</Text>
              </View>
              <Text style={styles.body}>{post.body}</Text>
              {isAdmin && (
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteDoc(doc(db, 'announcements', post.id))}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Modal omitted for brevity, keep your existing modal code here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  bgBlobBlue: { position: 'absolute', top: -100, left: -50, width: 500, height: 350, backgroundColor: '#1D70F5', borderRadius: 250 },
  bgBlobGreen: { position: 'absolute', top: 50, right: -50, width: 250, height: 150, backgroundColor: '#36E08B', borderRadius: 100 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 25, paddingBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  adminBadge: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  adminText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', flex: 1 },
  date: { fontSize: 12, color: '#60C5F1', fontWeight: 'bold' },
  body: { fontSize: 14, color: '#7F8C8D', marginBottom: 10 },
  deleteBtn: { backgroundColor: '#FFEDED', padding: 8, borderRadius: 10, alignSelf: 'flex-start' },
  deleteText: { color: '#FF6B6B', fontSize: 11, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#60C5F1', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#FFF', fontSize: 30, fontWeight: 'bold' }
});
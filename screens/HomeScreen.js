import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0); slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
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
      <View style={styles.bgBlobBlue} />
      <View style={styles.bgBlobCyan} />

      <Animated.ScrollView style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Personalized Greeting Section */}
        <View style={styles.headerArea}>
          <View>
            <Text style={styles.greetingText}>Hello John! 👋</Text>
            <Text style={styles.subGreeting}>SBIT-2A Student Hub</Text>
          </View>
          <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.adminBadge}>
            <Text style={styles.adminText}>{isAdmin ? 'Admin Mode' : 'Student'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Glance / Actions */}
        <View style={styles.quickGlanceRow}>
          <TouchableOpacity style={styles.glanceCard} onPress={() => navigation.navigate('Planner')}>
            <BlurView intensity={50} tint="light" style={styles.glanceGlass}>
              <Ionicons name="calendar" size={24} color="#1D70F5" />
              <Text style={styles.glanceTitle}>Schedule</Text>
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.glanceCard} onPress={() => navigation.navigate('Tasks')}>
            <BlurView intensity={50} tint="light" style={styles.glanceGlass}>
              <Ionicons name="checkbox" size={24} color="#36E08B" />
              <Text style={styles.glanceTitle}>My Tasks</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Announcements Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
        </View>

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
      </Animated.ScrollView>

      {isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Post Update</Text>
            <TextInput style={styles.input} placeholder="Title" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={[styles.input, { height: 100 }]} placeholder="Message" value={newBody} onChangeText={setNewBody} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={{color: '#FFF'}}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addAnnouncement}><Text style={{color: '#FFF', fontWeight: 'bold'}}>Post</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  bgBlobBlue: { position: 'absolute', top: -50, right: -100, width: 400, height: 400, backgroundColor: '#1D70F5', borderRadius: 200, opacity: 0.15 },
  bgBlobCyan: { position: 'absolute', top: 150, left: -100, width: 300, height: 300, backgroundColor: '#60C5F1', borderRadius: 150, opacity: 0.15 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  greetingText: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50' },
  subGreeting: { fontSize: 14, color: '#7F8C8D', marginTop: 4 },
  adminBadge: { backgroundColor: '#E0E6ED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  adminText: { color: '#2C3E50', fontWeight: 'bold', fontSize: 12 },
  quickGlanceRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginBottom: 25 },
  glanceCard: { flex: 1, height: 100, borderRadius: 20, overflow: 'hidden', elevation: 3 },
  glanceGlass: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },
  glanceTitle: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50', marginTop: 8 },
  sectionHeader: { paddingHorizontal: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 20, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', flex: 1 },
  date: { fontSize: 12, color: '#1D70F5', fontWeight: 'bold' },
  body: { fontSize: 14, color: '#7F8C8D', marginBottom: 10 },
  deleteBtn: { backgroundColor: '#FFEDED', padding: 8, borderRadius: 10, alignSelf: 'flex-start' },
  deleteText: { color: '#FF6B6B', fontSize: 11, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#1D70F5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', padding: 25, borderRadius: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 15 },
  modalActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#A0AEC0', padding: 15, borderRadius: 12, alignItems: 'center' },
  submitBtn: { flex: 1, backgroundColor: '#1D70F5', padding: 15, borderRadius: 12, alignItems: 'center' }
});
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Animated, Alert, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(shimmerAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(shimmerAnim, { toValue: 0.3, duration: 800, useNativeDriver: true })
    ])).start();
  }, []);

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
        setLoading(false);
      });
      return () => unsubscribe();
    }, [])
  );

  const toggleExpand = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Triggers the smooth expand/collapse animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const addAnnouncement = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!newTitle.trim() || !newBody.trim()) return;
    try {
      await addDoc(collection(db, 'announcements'), {
        title: newTitle, body: newBody, author: 'Admin', date: new Date().toLocaleDateString(), createdAt: serverTimestamp()
      });
      setModalVisible(false); setNewTitle(''); setNewBody('');
    } catch (error) {
      Alert.alert("Error", "Could not post.");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete Post", "Remove this announcement?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteDoc(doc(db, 'announcements', id)) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgBlobBlue} />
      <View style={styles.bgBlobCyan} />

      <Animated.ScrollView style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.headerArea}>
          <View>
            <Text style={styles.greetingText}>Hello John! 👋</Text>
            <Text style={styles.subGreeting}>SBIT-2A Student Hub</Text>
          </View>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid); setIsAdmin(!isAdmin); }} style={styles.adminBadge}>
            <Text style={styles.adminText}>{isAdmin ? 'Admin Mode' : 'Student'}</Text>
          </TouchableOpacity>
        </View>

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

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Latest Announcements</Text></View>

        {loading ? (
          [1, 2].map((key) => (
            <Animated.View key={key} style={[styles.card, { opacity: shimmerAnim }]}>
              <View style={{ width: '60%', height: 20, backgroundColor: '#E2E8F0', borderRadius: 10, marginBottom: 10 }} />
              <View style={{ width: '100%', height: 14, backgroundColor: '#E2E8F0', borderRadius: 5, marginBottom: 6 }} />
              <View style={{ width: '80%', height: 14, backgroundColor: '#E2E8F0', borderRadius: 5 }} />
            </Animated.View>
          ))
        ) : (
          announcements.map((post) => (
            <TouchableOpacity key={post.id} style={styles.card} activeOpacity={0.9} onPress={() => toggleExpand(post.id)}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.date}>{post.date}</Text>
              </View>
              
              <Text style={styles.body} numberOfLines={expandedId === post.id ? 0 : 3}>
                {post.body}
              </Text>
              
              {/* Show "Read More" only if closed and text is long enough to be truncated */}
              {post.body.length > 100 && expandedId !== post.id && (
                <Text style={styles.readMore}>Read More...</Text>
              )}
              {/* Show "Show Less" when expanded */}
              {expandedId === post.id && (
                <Text style={styles.readMore}>Show Less</Text>
              )}

              {isAdmin && (
                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(post.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}
      </Animated.ScrollView>

      {isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setModalVisible(true); }}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Post Update</Text>
            <TextInput style={styles.input} placeholder="Title" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Message" value={newBody} onChangeText={setNewBody} multiline />
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
  greetingText: { fontSize: 28, fontFamily: 'Poppins_700Bold', color: '#2C3E50' },
  subGreeting: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#7F8C8D' },
  adminBadge: { backgroundColor: '#E0E6ED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  adminText: { color: '#2C3E50', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  quickGlanceRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginBottom: 25 },
  glanceCard: { flex: 1, height: 100, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  glanceGlass: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)' },
  glanceTitle: { fontSize: 14, fontFamily: 'Poppins_700Bold', color: '#2C3E50', marginTop: 8 },
  sectionHeader: { paddingHorizontal: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: '#2C3E50' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 20, marginBottom: 15, elevation: 2, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#2C3E50', flex: 1 },
  date: { fontSize: 12, color: '#1D70F5', fontFamily: 'Poppins_600SemiBold' },
  body: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#7F8C8D', lineHeight: 22 },
  readMore: { color: '#1D70F5', fontFamily: 'Poppins_600SemiBold', fontSize: 12, marginTop: 8 },
  deleteBtn: { backgroundColor: '#FFEDED', padding: 8, borderRadius: 10, alignSelf: 'flex-start', marginTop: 15 },
  deleteText: { color: '#FF6B6B', fontSize: 11, fontFamily: 'Poppins_700Bold' },
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#1D70F5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', padding: 25, borderRadius: 24 },
  modalTitle: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#2C3E50', marginBottom: 20 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 15, fontFamily: 'Poppins_400Regular' },
  modalActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#A0AEC0', padding: 15, borderRadius: 12, alignItems: 'center' },
  submitBtn: { flex: 1, backgroundColor: '#1D70F5', padding: 15, borderRadius: 12, alignItems: 'center' }
});
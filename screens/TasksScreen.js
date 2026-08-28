import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Animated, Alert, Platform } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  
  // Modal & Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ]).start();
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem('@tasks');
    if (saved) {
      let parsed = JSON.parse(saved);
      // Auto-flag past due tasks
      parsed = parsed.map(t => (t.status === 'active' && new Date(t.raw) < new Date()) ? { ...t, status: 'missed' } : t);
      setTasks(parsed);
    }
  };

  const saveTasks = async (data) => {
    setTasks(data);
    await AsyncStorage.setItem('@tasks', JSON.stringify(data));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const isPast = date < new Date();
      saveTasks([{ 
        id: Math.random().toString(), 
        title: newTask, 
        deadline: `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, 
        raw: date.toISOString(), 
        status: isPast ? 'missed' : 'active' 
      }, ...tasks]);
      setModalVisible(false); 
      setNewTask('');
      setDate(new Date());
    }
  };

  const updateStatus = (id, st) => saveTasks(tasks.map(t => t.id === id ? { ...t, status: st } : t));
  const removeTask = (id) => saveTasks(tasks.filter(t => t.id !== id));

  const confirmDelete = (id) => {
    Alert.alert("Remove Task", "Are you sure you want to delete this task from the list?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeTask(id) }
    ]);
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const displayedTasks = tasks.filter(t => t.status === activeTab);

  return (
    <View style={styles.container}>
      {/* Soft Aesthetic Background Blobs */}
      <View style={styles.blobMint} />
      <View style={styles.blobCyan} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>John's Planner</Text>
          <Text style={styles.headerSubtitle}>Stay on top of your deliverables</Text>
        </View>

        {/* Sleek Pill Navigation */}
        <View style={styles.tabContainer}>
          <BlurView intensity={40} tint="light" style={styles.tabGlass}>
            {['active', 'completed', 'missed'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]} 
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
          {displayedTasks.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={50} color="#A0AEC0" />
              <Text style={styles.emptyText}>Nothing here right now.</Text>
            </View>
          )}

          {displayedTasks.map(task => (
            <View key={task.id} style={styles.card}>
              <View style={[styles.cardIndicator, { backgroundColor: activeTab === 'active' ? '#48C9B0' : activeTab === 'completed' ? '#A0AEC0' : '#FF6B6B' }]} />
              
              <View style={styles.cardContent}>
                <Text style={[styles.taskTitle, activeTab === 'completed' && styles.taskTitleDone]}>{task.title}</Text>
                <Text style={styles.taskDate}>
                  <Ionicons name="time-outline" size={12} /> {task.deadline}
                </Text>
              </View>

              {/* Action Buttons based on Tab */}
              {activeTab === 'active' ? (
                <View style={styles.actionGroup}>
                  <TouchableOpacity style={styles.iconBtnDone} onPress={() => updateStatus(task.id, 'completed')}>
                    <Ionicons name="checkmark" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtnMiss} onPress={() => updateStatus(task.id, 'missed')}>
                    <Ionicons name="close" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.threeDotBtn} onPress={() => confirmDelete(task.id)}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#7F8C8D" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Task</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="What needs to be done?" 
              placeholderTextColor="#A0AEC0"
              value={newTask} 
              onChangeText={setNewTask} 
            />
            
            <View style={styles.pickerRow}>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => { setPickerMode('date'); setShowPicker(true); }}>
                <Ionicons name="calendar-outline" size={18} color="#2C3E50" />
                <Text style={styles.pickerText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.pickerBtn} onPress={() => { setPickerMode('time'); setShowPicker(true); }}>
                <Ionicons name="time-outline" size={18} color="#2C3E50" />
                <Text style={styles.pickerText}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker 
                value={date} 
                mode={pickerMode} 
                display="default"
                onChange={onChangeDate} 
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addTask}>
                <Text style={styles.btnTextSubmit}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFDFC' }, // Very light mint-tinted white
  blobMint: { position: 'absolute', top: -100, right: -50, width: 350, height: 350, backgroundColor: '#A7F3D0', borderRadius: 200, opacity: 0.4 },
  blobCyan: { position: 'absolute', bottom: 50, left: -100, width: 300, height: 300, backgroundColor: '#BAE6FD', borderRadius: 150, opacity: 0.4 },
  
  headerContainer: { paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#2C3E50' },
  headerSubtitle: { fontSize: 15, color: '#7F8C8D', marginTop: 4 },
  
  tabContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tabGlass: { flexDirection: 'row', borderRadius: 30, padding: 5, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', overflow: 'hidden' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  activeTabButton: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: 'bold', color: '#A0AEC0' },
  activeTabText: { color: '#48C9B0' },
  
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: '#A0AEC0', marginTop: 10, fontStyle: 'italic' },
  
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, overflow: 'hidden', alignItems: 'center' },
  cardIndicator: { width: 6, height: '100%' },
  cardContent: { flex: 1, padding: 18 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 6 },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#A0AEC0' },
  taskDate: { fontSize: 12, color: '#7F8C8D', fontWeight: '500' },
  
  actionGroup: { flexDirection: 'row', paddingRight: 15, gap: 10 },
  iconBtnDone: { backgroundColor: '#48C9B0', padding: 8, borderRadius: 12 },
  iconBtnMiss: { backgroundColor: '#FF8A8A', padding: 8, borderRadius: 12 },
  threeDotBtn: { padding: 15 },
  
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#48C9B0', width: 65, height: 65, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#48C9B0', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 5}, shadowRadius: 10 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 24, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  input: { backgroundColor: '#F4F9FF', borderRadius: 15, padding: 18, fontSize: 16, color: '#2C3E50', marginBottom: 20 },
  
  pickerRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  pickerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F9FF', padding: 15, borderRadius: 15, gap: 8 },
  pickerText: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#F0F5FA', padding: 16, borderRadius: 15, alignItems: 'center' },
  submitBtn: { flex: 1, backgroundColor: '#48C9B0', padding: 16, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#7F8C8D', fontWeight: 'bold', fontSize: 15 },
  btnTextSubmit: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});
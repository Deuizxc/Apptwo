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
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Generate the calendar strip dates based on today
  const [weekDates, setWeekDates] = useState([]);
  const currentMonthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = new Date();
    let week = [];
    for (let i = -3; i <= 3; i++) {
      let d = new Date(today);
      d.setDate(today.getDate() + i);
      week.push({ dayStr: days[d.getDay()], dateNum: d.getDate(), isToday: i === 0 });
    }
    setWeekDates(week);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0); slideAnim.setValue(20);
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
        raw: date.toISOString(), status: isPast ? 'missed' : 'active' 
      }, ...tasks]);
      setModalVisible(false); setNewTask(''); setDate(new Date());
    }
  };

  const updateStatus = (id, st) => saveTasks(tasks.map(t => t.id === id ? { ...t, status: st } : t));
  const removeTask = (id) => saveTasks(tasks.filter(t => t.id !== id));
  const confirmDelete = (id) => {
    Alert.alert("Remove Task", "Delete this task from the list?", [
      { text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => removeTask(id) }
    ]);
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const displayedTasks = tasks.filter(t => t.status === activeTab);

  return (
    <View style={styles.container}>
      {/* Top Blue Section */}
      <View style={styles.blueHeader}>
        <View style={styles.headerTopRow}>
          <Ionicons name="menu" size={32} color="#FFF" />
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.topAddBtn}>
            <Ionicons name="add" size={24} color="#4A65E0" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.monthText}>{currentMonthYear}</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStrip}>
          {weekDates.map((d, index) => (
            <View key={index} style={[styles.dateBlock, d.isToday && styles.dateBlockActive]}>
              <Text style={[styles.dayText, d.isToday && styles.textActive]}>{d.dayStr}</Text>
              <Text style={[styles.dateText, d.isToday && styles.textActive]}>{d.dateNum}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* White Curved Content Area */}
      <Animated.View style={[styles.whiteContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.tabContainer}>
          <BlurView intensity={20} tint="dark" style={styles.tabGlass}>
            {['active', 'completed', 'missed'].map(tab => (
              <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTabButton]} onPress={() => setActiveTab(tab)}>
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
                <Text style={styles.taskDate}><Ionicons name="time-outline" size={12} /> {task.deadline}</Text>
              </View>
              {activeTab === 'active' ? (
                <View style={styles.actionGroup}>
                  <TouchableOpacity style={styles.iconBtnDone} onPress={() => updateStatus(task.id, 'completed')}><Ionicons name="checkmark" size={18} color="#FFF" /></TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtnMiss} onPress={() => updateStatus(task.id, 'missed')}><Ionicons name="close" size={18} color="#FFF" /></TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.threeDotBtn} onPress={() => confirmDelete(task.id)}><Ionicons name="trash-outline" size={20} color="#FF6B6B" /></TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput style={styles.input} placeholder="What needs to be done?" placeholderTextColor="#A0AEC0" value={newTask} onChangeText={setNewTask} />
            <View style={styles.pickerRow}>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => { setPickerMode('date'); setShowPicker(true); }}>
                <Ionicons name="calendar-outline" size={18} color="#2C3E50" /><Text style={styles.pickerText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => { setPickerMode('time'); setShowPicker(true); }}>
                <Ionicons name="time-outline" size={18} color="#2C3E50" /><Text style={styles.pickerText}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </TouchableOpacity>
            </View>
            {showPicker && <DateTimePicker value={date} mode={pickerMode} display="default" onChange={onChangeDate} />}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addTask}><Text style={styles.btnTextSubmit}>Save Task</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4A65E0' },
  blueHeader: { paddingTop: 60, paddingBottom: 30 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 20 },
  topAddBtn: { backgroundColor: '#FFF', padding: 5, borderRadius: 12 },
  monthText: { fontSize: 24, fontWeight: 'bold', color: '#FFF', paddingHorizontal: 25, marginBottom: 20 },
  calendarStrip: { paddingHorizontal: 15 },
  dateBlock: { alignItems: 'center', paddingVertical: 15, paddingHorizontal: 18, borderRadius: 25, marginHorizontal: 5, backgroundColor: 'rgba(255,255,255,0.1)' },
  dateBlockActive: { backgroundColor: '#FFF' },
  dayText: { fontSize: 12, color: '#A3B4FA', fontWeight: 'bold', marginBottom: 5 },
  dateText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
  textActive: { color: '#4A65E0' },
  whiteContainer: { flex: 1, backgroundColor: '#F8F9FA', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 25, elevation: 15 },
  tabContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tabGlass: { flexDirection: 'row', borderRadius: 30, padding: 5, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  activeTabButton: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabText: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  activeTabText: { color: '#4A65E0' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: '#A0AEC0', marginTop: 10, fontStyle: 'italic' },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 15, elevation: 3, overflow: 'hidden', alignItems: 'center' },
  cardIndicator: { width: 6, height: '100%' },
  cardContent: { flex: 1, padding: 18 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 6 },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#A0AEC0' },
  taskDate: { fontSize: 12, color: '#7F8C8D', fontWeight: '500' },
  actionGroup: { flexDirection: 'row', paddingRight: 15, gap: 10 },
  iconBtnDone: { backgroundColor: '#48C9B0', padding: 8, borderRadius: 12 },
  iconBtnMiss: { backgroundColor: '#FF8A8A', padding: 8, borderRadius: 12 },
  threeDotBtn: { padding: 15 },
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#4A65E0', width: 65, height: 65, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 24, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  input: { backgroundColor: '#F4F9FF', borderRadius: 15, padding: 18, fontSize: 16, color: '#2C3E50', marginBottom: 20 },
  pickerRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  pickerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F9FF', padding: 15, borderRadius: 15, gap: 8 },
  pickerText: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#F0F5FA', padding: 16, borderRadius: 15, alignItems: 'center' },
  submitBtn: { flex: 1, backgroundColor: '#4A65E0', padding: 16, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#7F8C8D', fontWeight: 'bold', fontSize: 15 },
  btnTextSubmit: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});
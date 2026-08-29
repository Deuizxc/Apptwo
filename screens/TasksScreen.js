import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Animated, Platform, Alert } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';

// Expanded Emoji Library
const EMOJI_CATEGORIES = [
  { title: 'Study & Work', emojis: ['💻', '📝', '📚', '📂', '📊', '📐', '🧠', '💡', '📌', '📎', '✏️', '📖', '📅', '💼', '🔎'] },
  { title: 'Activities & Fitness', emojis: ['🏋️', '🏃', '🚴', '⚽', '🏀', '🥊', '🧗', '🚶', '🎯', '🧘', '🏊', '🎾', '🥇', '🏆', '🥋'] },
  { title: 'Gaming & Fun', emojis: ['🎮', '🕹️', '👾', '🎧', '🎬', '🍿', '🎨', '🎸', '🎲', '🔥', '🧩', '🎳', '🎤', '🎫', '🎭'] },
  { title: 'Daily & Vibes', emojis: ['☕', '🍔', '🍕', '🚗', '🚌', '✨', '⚡', '🌙', '⭐', '🚀', '🛒', '💸', '📱', '🛌', '🚿'] },
  { title: 'Expressions', emojis: ['😎', '🤖', '🫡', '🥳', '😴', '😤', '👻', '💀', '💯', '✅', '🤔', '😭', '🤯', '🤩', '🤬'] },
  { title: 'Nature & Travel', emojis: ['🌍', '✈️', '🏝️', '🏕️', '🌲', '☀️', '🌧️', '❄️', '🐾', '🦋', '🌊', '🍁', '🌵', '🌋', '⛺'] }
];

// Safe formatters to prevent Android Hermes engine crashes
const getSafeDate = (d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
const getSafeTime = (d) => {
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [weekDates, setWeekDates] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const totalActive = tasks.filter(t => t.status === 'active' || t.status === 'completed').length;
  const totalCompleted = tasks.filter(t => t.status === 'completed').length;
  const progressPercentage = totalActive === 0 ? 0 : (totalCompleted / totalActive) * 100;

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: progressPercentage, duration: 800, useNativeDriver: false }).start();
  }, [progressPercentage]);

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
    if (saved) setTasks(JSON.parse(saved));
  };

  const saveTasks = async (data) => {
    setTasks(data);
    await AsyncStorage.setItem('@tasks', JSON.stringify(data));
  };

  const handleSelectEmoji = (emoji) => {
    Haptics.selectionAsync();
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false);
  };

  const addTask = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (newTask.trim()) {
      const isPast = date < new Date();
      saveTasks([{ 
        id: Math.random().toString(), 
        title: newTask, 
        emoji: selectedEmoji || '📝', 
        deadline: `${getSafeDate(date)} • ${getSafeTime(date)}`, 
        raw: date.toISOString(), status: isPast ? 'missed' : 'active' 
      }, ...tasks]);
      setModalVisible(false); setNewTask(''); setDate(new Date()); setSelectedEmoji('');
    } else {
      Alert.alert("Missing Detail", "Please enter a task name.");
    }
  };

  const updateStatus = async (id, st) => {
    Haptics.notificationAsync(st === 'completed' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
    const newData = tasks.map(t => t.id === id ? { ...t, status: st } : t);
    saveTasks(newData);
  };

  const removeTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const confirmDelete = (id) => {
    Alert.alert("Remove Task", "Delete this task from the list?", [
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
      <View style={styles.blueHeader}>
        <Text style={styles.monthText}>My Schedule</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStrip}>
          {weekDates.map((d, index) => (
            <View key={index} style={[styles.dateBlock, d.isToday && styles.dateBlockActive]}>
              <Text style={[styles.dayText, d.isToday && styles.textActive]}>{d.dayStr}</Text>
              <Text style={[styles.dateText, d.isToday && styles.textActive]}>{d.dateNum}</Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Daily Goal</Text>
            <Text style={styles.progressLabel}>{Math.round(progressPercentage)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
          </View>
        </View>
      </View>

      <Animated.View style={[styles.whiteContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.tabContainer}>
          <BlurView intensity={20} tint="dark" style={styles.tabGlass}>
            {['active', 'completed', 'missed'].map(tab => (
              <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTabButton]} onPress={() => { Haptics.selectionAsync(); setActiveTab(tab); }}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
          {displayedTasks.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="sparkles" size={50} color="#A3B4FA" />
              <Text style={styles.emptyText}>You're all caught up!</Text>
            </View>
          )}
          {displayedTasks.map(task => (
            <View key={task.id} style={styles.card}>
              <View style={[styles.cardIndicator, { backgroundColor: activeTab === 'active' ? '#48C9B0' : activeTab === 'completed' ? '#A0AEC0' : '#FF6B6B' }]} />
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.taskEmoji}>{task.emoji}</Text>
                  <Text style={[styles.taskTitle, activeTab === 'completed' && styles.taskTitleDone]} numberOfLines={1}>
                    {task.title}
                  </Text>
                </View>
                <Text style={styles.taskDate}><Ionicons name="time-outline" size={12} /> {task.deadline}</Text>
              </View>
              
              <View style={styles.actionGroup}>
                {activeTab === 'active' && (
                  <TouchableOpacity style={styles.iconBtnDone} onPress={() => updateStatus(task.id, 'completed')}>
                    <Ionicons name="checkmark" size={18} color="#FFF" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.threeDotBtn} onPress={() => confirmDelete(task.id)}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#A0AEC0" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <TouchableOpacity style={styles.fab} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setModalVisible(true); }}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Main Add Task Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Task</Text>
            
            <View style={styles.inputRow}>
              <TouchableOpacity 
                style={styles.emojiPickerTrigger} 
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEmojiPickerVisible(true); }}
              >
                {selectedEmoji ? (
                  <Text style={styles.selectedEmojiText}>{selectedEmoji}</Text>
                ) : (
                  <View style={styles.emojiPlaceholderContainer}>
                    <Ionicons name="happy-outline" size={24} color="#A0AEC0" />
                    <Ionicons name="add" size={12} color="#4A65E0" style={styles.miniPlus} />
                  </View>
                )}
              </TouchableOpacity>

              <TextInput 
                style={styles.textInput} 
                placeholder="What needs to be done?" 
                placeholderTextColor="#A0AEC0" 
                value={newTask} 
                onChangeText={setNewTask} 
              />
            </View>
            
            <View style={styles.pickerRow}>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => { setPickerMode('date'); setShowPicker(true); }}>
                <Ionicons name="calendar-outline" size={18} color="#2C3E50" /><Text style={styles.pickerText}>{getSafeDate(date)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => { setPickerMode('time'); setShowPicker(true); }}>
                <Ionicons name="time-outline" size={18} color="#2C3E50" /><Text style={styles.pickerText}>{getSafeTime(date)}</Text>
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

      {/* Interactive In-App Emoji Picker Sheet */}
      <Modal visible={emojiPickerVisible} animationType="slide" transparent={true}>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Choose an Icon</Text>
              <TouchableOpacity onPress={() => setEmojiPickerVisible(false)} style={styles.sheetCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetScroll}>
              {EMOJI_CATEGORIES.map((cat, idx) => (
                <View key={idx} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                  <View style={styles.emojiGrid}>
                    {cat.emojis.map((emoji, eIdx) => (
                      <TouchableOpacity 
                        key={eIdx} 
                        style={styles.gridEmojiItem} 
                        onPress={() => handleSelectEmoji(emoji)}
                      >
                        <Text style={styles.gridEmojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4A65E0' },
  blueHeader: { paddingTop: 60, paddingBottom: 30 },
  monthText: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: '#FFF', paddingHorizontal: 25, marginBottom: 20 },
  calendarStrip: { paddingHorizontal: 15 },
  dateBlock: { alignItems: 'center', paddingVertical: 15, paddingHorizontal: 18, borderRadius: 25, marginHorizontal: 5, backgroundColor: 'rgba(255,255,255,0.1)' },
  dateBlockActive: { backgroundColor: '#FFF' },
  dayText: { fontSize: 12, color: '#A3B4FA', fontFamily: 'Poppins_700Bold', marginBottom: 5 },
  dateText: { fontSize: 18, color: '#FFF', fontFamily: 'Poppins_700Bold' },
  textActive: { color: '#4A65E0' },
  progressContainer: { paddingHorizontal: 25, marginTop: 25 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: '#A3B4FA', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  progressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#36E08B', borderRadius: 4 },
  whiteContainer: { flex: 1, backgroundColor: '#F8F9FA', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 25 },
  tabContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tabGlass: { flexDirection: 'row', borderRadius: 30, padding: 5, backgroundColor: '#E2E8F0' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  activeTabButton: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabText: { fontSize: 12, fontFamily: 'Poppins_700Bold', color: '#64748B' },
  activeTabText: { color: '#4A65E0' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, fontFamily: 'Poppins_400Regular', color: '#A0AEC0', marginTop: 10 },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 15, elevation: 1, overflow: 'hidden', alignItems: 'center' },
  cardIndicator: { width: 6, height: '100%' },
  cardContent: { flex: 1, padding: 18 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  taskEmoji: { fontSize: 18, marginRight: 8 },
  taskTitle: { flex: 1, fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#2C3E50' },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#A0AEC0' },
  taskDate: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#7F8C8D', marginLeft: 26 },
  actionGroup: { flexDirection: 'row', paddingRight: 10, alignItems: 'center' },
  iconBtnDone: { backgroundColor: '#48C9B0', padding: 10, borderRadius: 12, marginRight: 5 },
  threeDotBtn: { padding: 8 },
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#4A65E0', width: 65, height: 65, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 24, elevation: 10 },
  modalTitle: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: '#2C3E50', marginBottom: 15 },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 20, alignItems: 'center' },
  emojiPickerTrigger: { width: 60, height: 60, backgroundColor: '#F4F9FF', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  emojiPlaceholderContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  miniPlus: { position: 'absolute', top: -3, right: -4 },
  selectedEmojiText: { fontSize: 26 },
  textInput: { flex: 1, backgroundColor: '#F4F9FF', borderRadius: 15, paddingHorizontal: 18, fontSize: 16, color: '#2C3E50', fontFamily: 'Poppins_400Regular', height: 60 },
  pickerRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  pickerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F9FF', padding: 15, borderRadius: 15, gap: 8 },
  pickerText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: '#2C3E50' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#F0F5FA', padding: 16, borderRadius: 15, alignItems: 'center' },
  submitBtn: { flex: 1, backgroundColor: '#4A65E0', padding: 16, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#7F8C8D', fontFamily: 'Poppins_700Bold', fontSize: 15 },
  btnTextSubmit: { color: '#FFFFFF', fontFamily: 'Poppins_700Bold', fontSize: 15 },
  
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '60%', paddingBottom: 30 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  sheetTitle: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: '#2C3E50' },
  sheetCloseBtn: { backgroundColor: '#F1F5F9', padding: 6, borderRadius: 20 },
  sheetScroll: { paddingHorizontal: 20, paddingTop: 15 },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridEmojiItem: { width: 50, height: 50, backgroundColor: '#F8FAFC', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  gridEmojiText: { fontSize: 24 }
});
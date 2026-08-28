import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem('@tasks');
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map(t => (t.status === 'active' && new Date(t.raw) < new Date()) ? { ...t, status: 'missed' } : t);
      setTasks(parsed);
    }
  };

  const save = async (data) => { setTasks(data); await AsyncStorage.setItem('@tasks', JSON.stringify(data)); };

  const addTask = () => {
    if (newTask) {
      const isPast = date < new Date();
      save([{ id: Math.random().toString(), title: newTask, deadline: date.toLocaleString(), raw: date.toISOString(), status: isPast ? 'missed' : 'active' }, ...tasks]);
      setModalVisible(false); setNewTask('');
    }
  };

  const update = (id, st) => save(tasks.map(t => t.id === id ? { ...t, status: st } : t));
  const remove = (id) => save(tasks.filter(t => t.id !== id));
  
  const displayed = tasks.filter(t => t.status === activeTab);

  return (
    <View style={styles.container}>
      <View style={{ height: 90 }} />
      <View style={styles.navBar}>
        {['active', 'completed', 'missed'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.navTab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.navText, activeTab === tab && { color: '#FFF' }]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {displayed.map(task => (
          <View key={task.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{task.title}</Text>
              <Text style={styles.date}>{task.deadline}</Text>
            </View>
            {activeTab === 'active' ? (
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <TouchableOpacity style={styles.doneBtn} onPress={() => update(task.id, 'completed')}><Text style={styles.btnTextSm}>Done</Text></TouchableOpacity>
                <TouchableOpacity style={styles.missBtn} onPress={() => update(task.id, 'missed')}><Text style={styles.btnTextSm}>Miss</Text></TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.delBtn} onPress={() => remove(task.id)}><Text style={styles.btnTextSm}>Delete</Text></TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput style={styles.input} placeholder="Task Name" value={newTask} onChangeText={setNewTask} />
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              <TouchableOpacity style={styles.pickBtn} onPress={() => { setPickerMode('date'); setShowPicker(true); }}><Text>{date.toLocaleDateString()}</Text></TouchableOpacity>
              <TouchableOpacity style={styles.pickBtn} onPress={() => { setPickerMode('time'); setShowPicker(true); }}><Text>{date.toLocaleTimeString()}</Text></TouchableOpacity>
            </View>
            {showPicker && <DateTimePicker value={date} mode={pickerMode} onChange={(e, d) => { setShowPicker(Platform.OS === 'ios'); if(d) setDate(d); }} />}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addTask}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  navBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 20, borderRadius: 20, padding: 5, marginBottom: 15 },
  navTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 15 },
  activeTab: { backgroundColor: '#1D70F5' },
  navText: { fontSize: 12, fontWeight: 'bold', color: '#2C3E50' },
  card: { backgroundColor: '#FFFFFF', padding: 20, marginHorizontal: 20, marginBottom: 10, borderRadius: 24, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  date: { fontSize: 12, color: '#60C5F1', marginTop: 5 },
  doneBtn: { backgroundColor: '#36E08B', padding: 8, borderRadius: 8 },
  missBtn: { backgroundColor: '#FF6B6B', padding: 8, borderRadius: 8 },
  delBtn: { backgroundColor: '#A0AEC0', padding: 8, borderRadius: 8 },
  btnTextSm: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  addButton: { position: 'absolute', bottom: 90, alignSelf: 'center', backgroundColor: '#60C5F1', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 8 },
  addButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 15 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, marginBottom: 15 },
  pickBtn: { flex: 1, backgroundColor: '#F8F9FA', padding: 15, borderRadius: 12, alignItems: 'center' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#E0E6ED', padding: 12, borderRadius: 12, flex: 0.45, alignItems: 'center' },
  submitBtn: { backgroundColor: '#1D70F5', padding: 12, borderRadius: 12, flex: 0.45, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' }
});
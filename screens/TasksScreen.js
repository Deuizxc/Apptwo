import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'completed', 'missed'
  
  // Modal & Form States
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  useEffect(() => {
    loadAndCheckTasks();
  }, []);

  const loadAndCheckTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@student_tasks_v4');
      if (savedTasks) {
        let parsedTasks = JSON.parse(savedTasks);
        const now = new Date();

        // Automatically scan active tasks and shift past-due items to 'missed'
        parsedTasks = parsedTasks.map(task => {
          if (task.status === 'active' && new Date(task.rawTimestamp) < now) {
            return { ...task, status: 'missed' };
          }
          return task;
        });

        setTasks(parsedTasks);
        saveTasksToStorage(parsedTasks);
      }
    } catch (error) {
      console.log('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTasksToStorage = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('@student_tasks_v4', JSON.stringify(updatedTasks));
    } catch (error) {
      console.log('Failed to save tasks', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showMode = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const addTask = async () => {
    if (newTask.trim()) {
      const now = new Date();
      const isPastDue = date < now;
      const formattedDeadline = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      const taskItem = {
        id: Math.random().toString(),
        title: newTask,
        deadline: formattedDeadline,
        rawTimestamp: date.toISOString(), // saved for automated comparison
        status: isPastDue ? 'missed' : 'active' // auto-routes if set to past time
      };

      const updatedTasks = [taskItem, ...tasks];
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      
      setModalVisible(false);
      setNewTask('');
      setDate(new Date());
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const missedCount = tasks.filter(task => task.status === 'missed').length;

  const displayedTasks = tasks.filter(task => {
    if (activeTab === 'active') return task.status === 'active';
    if (activeTab === 'completed') return task.status === 'completed';
    if (activeTab === 'missed') return task.status === 'missed';
    return false;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Personal Tasks</Text>

      {/* Clean 3-Column Navigation Switcher with Red Highlight Option */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navTab, activeTab === 'active' && styles.activeTab]} 
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.navText, activeTab === 'active' && styles.activeNavText]}>Active</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTab, activeTab === 'completed' && styles.activeTab]} 
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.navText, activeTab === 'completed' && styles.activeNavText]}>Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTab, activeTab === 'missed' && styles.missedActiveTab, missedCount > 0 && activeTab !== 'missed' && styles.missedAlertTab]} 
          onPress={() => setActiveTab('missed')}
        >
          <View style={styles.badgeRow}>
            <Text style={[styles.navText, (activeTab === 'missed' || missedCount > 0) && styles.activeNavText]}>Missed</Text>
            {missedCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{missedCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.scrollArea}>
          {displayedTasks.length === 0 && (
            <Text style={styles.emptyText}>No tasks found in this section.</Text>
          )}

          {displayedTasks.map((task) => (
            <View key={task.id} style={[styles.card, activeTab !== 'active' && styles.archiveCard]}>
              <View style={styles.taskInfo}>
                <Text style={[styles.title, activeTab !== 'active' && styles.strikethrough]}>{task.title}</Text>
                <Text style={[styles.deadline, task.status === 'missed' && { color: 'red' }]}>
                  {task.status === 'missed' ? '⚠️ Overdue: ' : 'Due: '}{task.deadline}
                </Text>
              </View>

              {activeTab === 'active' ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.doneBtn} onPress={() => updateTaskStatus(task.id, 'completed')}>
                    <Text style={styles.btnTextSmall}>Done</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.missBtn} onPress={() => updateTaskStatus(task.id, 'missed')}>
                    <Text style={styles.btnTextSmall}>Missed</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTask(task.id)}>
                  <Text style={styles.btnTextSmall}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Personal Task</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Task Name (e.g., System Integration Lab)" 
              value={newTask} 
              onChangeText={setNewTask} 
            />

            <Text style={styles.label}>Select Deadline Date & Time:</Text>
            <View style={styles.pickerRow}>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => showMode('date')}>
                <Text style={styles.pickerBtnText}>📅 {date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => showMode('time')}>
                <Text style={styles.pickerBtnText}>⏰ {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode={pickerMode}
                is24Hour={false}
                display="default"
                onChange={onDateChange}
              />
            )}

            <View style={[styles.modalActions, { marginTop: 20 }]}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addTask}>
                <Text style={styles.btnText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  navBar: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 8, padding: 3, marginBottom: 15 },
  navTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#007bff', elevation: 2 },
  missedActiveTab: { backgroundColor: '#dc3545', elevation: 2 },
  missedAlertTab: { backgroundColor: '#f8d7da', borderWidth: 1, borderColor: '#dc3545' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badge: { backgroundColor: '#dc3545', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  navText: { fontSize: 13, fontWeight: 'bold', color: '#555' },
  activeNavText: { color: '#fff' },
  scrollArea: { flex: 1 },
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 40 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  archiveCard: { backgroundColor: '#eaeaea' },
  taskInfo: { flex: 1, paddingRight: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  strikethrough: { textDecorationLine: 'line-through', color: '#666' },
  deadline: { fontSize: 12, color: '#d9534f', marginTop: 5, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 5 },
  doneBtn: { backgroundColor: '#28a745', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 5, marginRight: 5 },
  missBtn: { backgroundColor: '#d9534f', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 5 },
  deleteBtn: { backgroundColor: '#6c757d', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 5 },
  btnTextSmall: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, elevation: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#444', marginBottom: 5 },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  pickerBtn: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 5, alignItems: 'center', backgroundColor: '#f9f9f9' },
  pickerBtnText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#888', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  submitBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
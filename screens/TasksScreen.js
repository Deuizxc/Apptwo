import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  // Load saved local tasks when the screen opens
  useEffect(() => {
    loadLocalTasks();
  }, []);

  const loadLocalTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@student_tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTasksToStorage = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('@student_tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.log('Failed to save tasks', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      const taskItem = {
        id: Math.random().toString(),
        title: newTask,
        deadline: newDeadline ? newDeadline : 'TBA',
      };
      const updatedTasks = [taskItem, ...tasks];
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      
      setModalVisible(false);
      setNewTask('');
      setNewDeadline('');
    }
  };

  const completeTask = async (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Personal Tasks</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView>
          {tasks.length === 0 && (
            <Text style={styles.emptyText}>No personal tasks yet.</Text>
          )}
          {tasks.map((task) => (
            <View key={task.id} style={styles.card}>
              <View style={styles.taskInfo}>
                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.deadline}>Due: {task.deadline}</Text>
              </View>
              <TouchableOpacity style={styles.doneBtn} onPress={() => completeTask(task.id)}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
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
            <TextInput style={styles.input} placeholder="Task Name (e.g., Review Notes)" value={newTask} onChangeText={setNewTask} />
            <TextInput style={styles.input} placeholder="Deadline (e.g., Tomorrow)" value={newDeadline} onChangeText={setNewDeadline} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addTask}>
                <Text style={styles.btnText}>Add</Text>
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
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#888', fontStyle: 'italic' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskInfo: { flex: 1, paddingRight: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  deadline: { fontSize: 12, color: '#d9534f', marginTop: 5, fontWeight: 'bold' },
  doneBtn: { backgroundColor: '#28a745', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
  doneText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, elevation: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#888', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  submitBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
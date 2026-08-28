import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState } from 'react';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([
    { id: '1', subject: 'PF 101 - Object-Oriented Programming', title: 'Final GitHub Repository', deadline: 'Aug 31, 2026', completed: false },
    { id: '2', subject: 'MS 101 - Discrete Mathematics', title: 'Problem Set 3', deadline: 'Sep 2, 2026', completed: false },
    { id: '3', subject: 'CC 105 - Information Management', title: 'Database Schema Draft', deadline: 'Sep 5, 2026', completed: false },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTitle && newSubject && newDeadline) {
      const newTask = {
        id: Math.random().toString(),
        subject: newSubject,
        title: newTitle,
        deadline: newDeadline,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setModalVisible(false);
      setNewSubject('');
      setNewTitle('');
      setNewDeadline('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Tasks & Deadlines</Text>
        
        {tasks.map(task => (
          <View key={task.id} style={[styles.taskCard, task.completed && styles.taskCompleted]}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxChecked]} />
            </TouchableOpacity>
            
            <View style={styles.taskDetails}>
              <Text style={[styles.subject, task.completed && styles.textCompleted]}>{task.subject}</Text>
              <Text style={[styles.title, task.completed && styles.textCompleted]}>{task.title}</Text>
              <Text style={[styles.deadline, task.completed && styles.textCompleted]}>Due: {task.deadline}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      {/* Add Task Popup */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput style={styles.input} placeholder="Subject (e.g., CC 104)" value={newSubject} onChangeText={setNewSubject} />
            <TextInput style={styles.input} placeholder="Task Title" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Deadline (e.g., Sep 10, 2026)" value={newDeadline} onChangeText={setNewDeadline} />
            <View style={styles.modalActions}>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  taskCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginHorizontal: 15, borderRadius: 10, marginBottom: 10, elevation: 2, alignItems: 'center' },
  taskCompleted: { backgroundColor: '#e0e0e0', elevation: 0 },
  checkboxContainer: { marginRight: 15, padding: 5 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: '#007bff', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#007bff' },
  taskDetails: { flex: 1 },
  subject: { fontSize: 12, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#222', marginVertical: 3 },
  deadline: { fontSize: 14, color: '#ff4d4d', fontWeight: 'bold' },
  textCompleted: { color: '#999', textDecorationLine: 'line-through' },
  deleteBtn: { paddingLeft: 10 },
  deleteText: { color: 'red', fontSize: 12, fontWeight: 'bold' },
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
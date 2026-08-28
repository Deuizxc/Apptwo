import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  // Temporary local state for announcements (will move to database later)
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'No ROTC This Weekend', body: 'Please be informed that our Military Science 2 formation is cancelled this week. Rest up and prepare for midterm reviews.', date: 'Aug 28, 2026', author: 'Class Mayor' },
    { id: '2', title: 'Submit Lab Requirements', body: 'A reminder to push your final GitHub repositories for our Object-Oriented Programming project before midnight on Monday.', date: 'Aug 26, 2026', author: 'Beadle' }
  ]);

  // Admin controls
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const addAnnouncement = () => {
    if (newTitle && newBody) {
      const newPost = {
        id: Math.random().toString(),
        title: newTitle,
        body: newBody,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: 'Admin'
      };
      setAnnouncements([newPost, ...announcements]);
      setModalVisible(false);
      setNewTitle('');
      setNewBody('');
    }
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(post => post.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Admin Toggle Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Section Announcements</Text>
        <TouchableOpacity style={styles.adminToggle} onPress={() => setIsAdmin(!isAdmin)}>
          <Text style={styles.adminToggleText}>{isAdmin ? 'Admin View' : 'Student View'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {announcements.map((post) => (
          <View key={post.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{post.date}</Text>
              {isAdmin && (
                <TouchableOpacity onPress={() => deleteAnnouncement(post.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.body}>{post.body}</Text>
            <Text style={styles.author}>- {post.author}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Admin Add Button */}
      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Announcement</Text>
        </TouchableOpacity>
      )}

      {/* Add Announcement Popup */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Announcement</Text>
            <TextInput style={styles.input} placeholder="Title" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Message" value={newBody} onChangeText={setNewBody} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={addAnnouncement}>
                <Text style={styles.btnText}>Post</Text>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', elevation: 3 },
  header: { fontSize: 18, fontWeight: 'bold' },
  adminToggle: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  adminToggleText: { fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  date: { color: '#888', fontSize: 12 },
  deleteText: { color: 'red', fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  body: { fontSize: 14, color: '#444', marginBottom: 10, lineHeight: 20 },
  author: { fontSize: 12, color: '#666', fontStyle: 'italic', textAlign: 'right' },
  addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, elevation: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#888', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  submitBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
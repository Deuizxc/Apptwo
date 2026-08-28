import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function WallScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Good luck with the midterms everyone!', author: 'Anonymous', time: '10:00 AM' },
    { id: '2', text: 'Does anyone have the syllabus for Information Management?', author: 'Anonymous', time: '10:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const postMessage = () => {
    if (newMessage.trim()) {
      const newPost = {
        id: Math.random().toString(),
        text: newMessage,
        author: 'Anonymous', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newPost]);
      setNewMessage('');
    }
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Admin Toggle Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Freedom Wall</Text>
        <TouchableOpacity style={styles.adminToggle} onPress={() => setIsAdmin(!isAdmin)}>
          <Text style={styles.adminToggleText}>{isAdmin ? 'Admin View' : 'Student View'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.chatArea}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageBubble}>
            <Text style={styles.messageText}>{msg.text}</Text>
            <View style={styles.metaData}>
              <Text style={styles.metaText}>{msg.author} • {msg.time}</Text>
              {isAdmin && (
                <TouchableOpacity onPress={() => deleteMessage(msg.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Share something anonymously..." 
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={postMessage}>
          <Text style={styles.sendButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', elevation: 3, marginBottom: 15 },
  header: { fontSize: 18, fontWeight: 'bold' },
  adminToggle: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  adminToggleText: { fontSize: 12, fontWeight: 'bold' },
  chatArea: { flex: 1, paddingHorizontal: 15 },
  messageBubble: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
  messageText: { fontSize: 16, color: '#333', marginBottom: 5 },
  metaData: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  deleteText: { color: 'red', fontSize: 12, fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, maxHeight: 100 },
  sendButton: { backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});
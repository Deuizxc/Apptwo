import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
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

  const update = async (id, st) => {
    const newData = tasks.map(t => t.id === id ? { ...t, status: st } : t);
    setTasks(newData);
    await AsyncStorage.setItem('@tasks', JSON.stringify(newData));
  };

  const displayed = tasks.filter(t => t.status === activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.hugeHeaderBg} />
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        
        {/* Glass Grid Navigation */}
        <View style={styles.gridNav}>
          {[ {id: 'active', icon: 'flash', label: 'Active'}, {id: 'completed', icon: 'checkmark-circle', label: 'Done'}, {id: 'missed', icon: 'warning', label: 'Missed'} ].map(tab => (
            <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={styles.gridItemWrapper}>
              <BlurView intensity={activeTab === tab.id ? 80 : 30} tint="light" style={styles.gridItem}>
                <Ionicons name={tab.icon} size={28} color={activeTab === tab.id ? '#1D70F5' : '#FFF'} />
                <Text style={[styles.gridText, activeTab === tab.id && { color: '#1D70F5', fontWeight: 'bold' }]}>{tab.label}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          {displayed.map(task => (
            <View key={task.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.date}>{task.deadline}</Text>
              </View>
              {activeTab === 'active' && (
                <TouchableOpacity style={styles.doneBtn} onPress={() => update(task.id, 'completed')}>
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  hugeHeaderBg: { position: 'absolute', top: 0, width: '150%', height: 350, backgroundColor: '#36E08B', borderBottomRightRadius: 300, left: '-25%' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 60, marginBottom: 20 },
  gridNav: { flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10, marginBottom: 30 },
  gridItemWrapper: { borderRadius: 20, overflow: 'hidden', width: 90, height: 90 },
  gridItem: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  gridText: { color: '#FFF', fontSize: 11, marginTop: 8 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  date: { fontSize: 12, color: '#A0AEC0', marginTop: 5 },
  doneBtn: { backgroundColor: '#1D70F5', padding: 10, borderRadius: 12 }
});
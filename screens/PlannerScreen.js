import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

const scheduleData = [
  { day: 'Monday', classes: [{ time: '07:30 AM - 09:30 AM', subject: 'PF 101 - OOP', room: 'IL603a' }, { time: '06:00 PM - 09:00 PM', subject: 'MS 101 - Discrete Math', room: 'IL304a' }] },
  { day: 'Tuesday', classes: [{ time: '07:00 AM - 09:00 AM', subject: 'CC 105 - Info Management', room: 'IL604a' }] }
];

export default function PlannerScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 90, paddingBottom: 100 }}>
      {scheduleData.map((dayGroup, index) => (
        <Animated.View key={index} style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginHorizontal: 20, marginBottom: 20 }}>
          <Text style={styles.dayHeader}>{dayGroup.day}</Text>
          {dayGroup.classes.map((cls, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.timeText}>{cls.time}</Text>
              <Text style={styles.subjectText}>{cls.subject}</Text>
              <Text style={styles.roomText}>Room: {cls.room}</Text>
            </View>
          ))}
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  dayHeader: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', marginBottom: 15 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15 },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#60C5F1', marginBottom: 8 },
  subjectText: { fontSize: 17, fontWeight: 'bold', color: '#2C3E50', marginBottom: 6 },
  roomText: { fontSize: 14, color: '#7F8C8D' }
});
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const scheduleData = [
  { day: 'Monday', classes: [{ time: '07:30 AM - 09:30 AM', subject: 'PF 101 - OOP', room: 'IL603a' }, { time: '11:00 AM - 02:00 PM', subject: 'PF 101 - OOP', room: 'IK504 F1' }, { time: '06:00 PM - 09:00 PM', subject: 'MS 101 - Discrete Math', room: 'IL304a' }] },
  { day: 'Tuesday', classes: [{ time: '07:00 AM - 09:00 AM', subject: 'CC 105 - Info Management', room: 'IL604a' }, { time: '10:30 AM - 01:30 PM', subject: 'CC 105 - Info Management', room: 'IE207c' }, { time: '02:30 PM - 05:30 PM', subject: 'TECHNO 1 - Technopreneurship', room: 'IL503a' }, { time: '06:00 PM - 09:00 PM', subject: 'IS 106 - IS Project Management', room: 'IL603a' }] },
  { day: 'Wednesday', classes: [{ time: '07:00 AM - 10:00 AM', subject: 'NET 101 - Networking 1', room: 'IK504 F1' }, { time: '11:30 AM - 01:30 PM', subject: 'NET 101 - Networking 1', room: 'IL604a' }] },
  { day: 'Thursday', classes: [{ time: '07:00 AM - 09:00 AM', subject: 'CC 104 - Data Structures', room: 'IL604a' }, { time: '10:30 AM - 01:30 PM', subject: 'CC 104 - Data Structures', room: 'IE207c' }] },
  { day: 'Saturday', classes: [{ time: '02:30 PM - 04:30 PM', subject: 'PATHFIT 3', room: 'SB OG' }] }
];

export default function PlannerScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ]).start();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.purpleHeaderBg} />
      
      <Animated.ScrollView style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} contentContainerStyle={{ paddingTop: 60, paddingBottom: 100 }}>
        <Text style={styles.mainHeader}>SBIT-2A Schedule</Text>
        
        {scheduleData.map((dayGroup, index) => (
          <View key={index} style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <Text style={styles.dayHeader}>{dayGroup.day}</Text>
            {dayGroup.classes.map((cls, idx) => (
              <View key={idx} style={styles.ticketCard}>
                <View style={styles.ticketLeft}>
                  <Text style={styles.subjectText}>{cls.subject}</Text>
                  <Text style={styles.roomText}>Room: {cls.room}</Text>
                </View>
                <View style={styles.ticketDivider} />
                <View style={styles.ticketRight}>
                  <Text style={styles.timeText}>{cls.time}</Text>
                </View>
                {/* Cutouts to create the ticket shape */}
                <View style={styles.cutoutTop} />
                <View style={styles.cutoutBottom} />
              </View>
            ))}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FA' },
  purpleHeaderBg: { position: 'absolute', top: 0, width: '100%', height: 280, backgroundColor: '#6D5AED', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  mainHeader: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 30 },
  dayHeader: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10, marginLeft: 5 },
  ticketCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 15, marginBottom: 15, elevation: 3, position: 'relative', overflow: 'hidden' },
  ticketLeft: { flex: 2, padding: 20, justifyContent: 'center' },
  ticketRight: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFBFC' },
  ticketDivider: { width: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB', marginVertical: 10 },
  subjectText: { fontSize: 15, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  roomText: { fontSize: 12, color: '#A0AEC0' },
  timeText: { fontSize: 13, fontWeight: 'bold', color: '#48C9B0', textAlign: 'center' },
  cutoutTop: { position: 'absolute', top: -10, right: '31%', width: 20, height: 20, borderRadius: 10, backgroundColor: '#F0F5FA' },
  cutoutBottom: { position: 'absolute', bottom: -10, right: '31%', width: 20, height: 20, borderRadius: 10, backgroundColor: '#F0F5FA' }
});
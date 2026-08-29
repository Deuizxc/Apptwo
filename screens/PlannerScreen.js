import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useCallback, useRef, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

export default function PlannerScreen() {
  const { colors, fontSize, setIsSidebarOpen } = useContext(AppContext);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0); slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ]).start();
    }, [])
  );

  const schedule = [
    // MONDAY
    { id: 1, day: 'MONDAY', subject: 'Object-Oriented Programming (PF 101)', time: '07:30 AM - 09:30 AM', room: 'IL603a', type: 'Lecture' },
    { id: 2, day: 'MONDAY', subject: 'Object-Oriented Programming (PF 101)', time: '11:00 AM - 02:00 PM', room: 'IK504 F1', type: 'Laboratory' },
    { id: 3, day: 'MONDAY', subject: 'Discrete Mathematics (MS 101)', time: '06:00 PM - 09:00 PM', room: 'IL304a', type: 'Lecture' },

    // TUESDAY
    { id: 4, day: 'TUESDAY', subject: 'Information Management (CC 105)', time: '07:00 AM - 09:00 AM', room: 'IL604a', type: 'Lecture' },
    { id: 5, day: 'TUESDAY', subject: 'Information Management (CC 105)', time: '10:30 AM - 01:30 PM', room: 'IE207c', type: 'Laboratory' },
    { id: 6, day: 'TUESDAY', subject: 'Technopreneurship (TECHNO 1)', time: '02:30 PM - 05:30 PM', room: 'IL503a', type: 'Lecture' },
    { id: 7, day: 'TUESDAY', subject: 'IS Project Management (IS 106)', time: '06:00 PM - 09:00 PM', room: 'IL603a', type: 'Lecture' },

    // WEDNESDAY
    { id: 8, day: 'WEDNESDAY', subject: 'Networking 1 (NET 101)', time: '07:00 AM - 10:00 AM', room: 'IK504 F1', type: 'Laboratory' },
    { id: 9, day: 'WEDNESDAY', subject: 'Networking 1 (NET 101)', time: '11:30 AM - 01:30 PM', room: 'IL604a', type: 'Lecture' },

    // THURSDAY
    { id: 10, day: 'THURSDAY', subject: 'Data Structures and Algorithms (CC 104)', time: '07:00 AM - 09:00 AM', room: 'IL604a', type: 'Lecture' },
    { id: 11, day: 'THURSDAY', subject: 'Data Structures and Algorithms (CC 104)', time: '10:30 AM - 01:30 PM', room: 'IE207c', type: 'Laboratory' },

    // SATURDAY
    { id: 12, day: 'SATURDAY', subject: 'Physical Activities Toward Health and Fitness 3 (PATHFIT 3)', time: '02:30 PM - 04:30 PM', room: 'SB OG', type: 'Activity' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.headerArea}>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 28 * fontSize }]}>Class Planner</Text>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIsSidebarOpen(true); }} style={styles.menuBtn}>
            <Ionicons name="menu" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {schedule.map((item, index) => {
            const showDayHeader = index === 0 || schedule[index - 1].day !== item.day;
            return (
              <View key={item.id}>
                {showDayHeader && (
                  <Text style={[styles.dayHeaderTitle, { color: colors.primary, fontSize: 16 * fontSize }]}>
                    {item.day}
                  </Text>
                )}
                <View style={styles.ticketWrapper}>
                  <View style={[styles.ticketTop, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <Text style={[styles.subjectText, { color: colors.text, fontSize: 18 * fontSize }]} numberOfLines={2}>{item.subject}</Text>
                  </View>
                  
                  <View style={styles.ticketDividerRow}>
                    <View style={[styles.cutoutLeft, { backgroundColor: colors.background }]} />
                    <View style={[styles.dashedLine, { borderColor: colors.border }]} />
                    <View style={[styles.cutoutRight, { backgroundColor: colors.background }]} />
                  </View>

                  <View style={[styles.ticketBottom, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.infoCol}>
                      <Text style={[styles.infoLabel, { color: colors.subtext, fontSize: 12 * fontSize }]}>TIME</Text>
                      <Text style={[styles.infoValue, { color: colors.primary, fontSize: 13 * fontSize }]}>{item.time}</Text>
                    </View>
                    <View style={[styles.infoCol, { alignItems: 'flex-end' }]}>
                      <Text style={[styles.infoLabel, { color: colors.subtext, fontSize: 12 * fontSize }]}>ROOM</Text>
                      <Text style={[styles.infoValue, { color: colors.text, fontSize: 13 * fontSize }]}>{item.room}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontFamily: 'Poppins_700Bold' },
  menuBtn: { padding: 5 },
  content: { paddingHorizontal: 20 },
  dayHeaderTitle: { fontFamily: 'Poppins_700Bold', marginTop: 15, marginBottom: 10, letterSpacing: 1 },
  ticketWrapper: { marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  ticketTop: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(29, 112, 245, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  typeText: { color: '#1D70F5', fontFamily: 'Poppins_700Bold', fontSize: 11, textTransform: 'uppercase' },
  subjectText: { fontFamily: 'Poppins_700Bold' },
  ticketDividerRow: { flexDirection: 'row', alignItems: 'center', height: 20, overflow: 'hidden', position: 'relative' },
  cutoutLeft: { position: 'absolute', left: -10, width: 20, height: 20, borderRadius: 10, zIndex: 2 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderStyle: 'dashed', marginHorizontal: 15 },
  cutoutRight: { position: 'absolute', right: -10, width: 20, height: 20, borderRadius: 10, zIndex: 2 },
  ticketBottom: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 },
  infoCol: { flex: 1 },
  infoLabel: { fontFamily: 'Poppins_600SemiBold', marginBottom: 2 },
  infoValue: { fontFamily: 'Poppins_700Bold' }
});
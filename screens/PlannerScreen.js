import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useCallback, useRef, useContext } from 'react';
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

  // Sample schedule data
  const schedule = [
    { id: 1, subject: 'Advanced Database Systems', time: '08:00 AM - 11:00 AM', room: 'ComLab 1', prof: 'Dr. Santos', type: 'Laboratory' },
    { id: 2, subject: 'Web Systems & Tech', time: '12:30 PM - 02:30 PM', room: 'Room 302', prof: 'Prof. Reyes', type: 'Lecture' },
    { id: 3, subject: 'Software Engineering', time: '03:00 PM - 05:00 PM', room: 'Room 304', prof: 'Engr. Cruz', type: 'Lecture' }
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
          {schedule.map((item) => (
            <View key={item.id} style={styles.ticketWrapper}>
              {/* Ticket Top */}
              <View style={[styles.ticketTop, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <Text style={[styles.subjectText, { color: colors.text, fontSize: 18 * fontSize }]} numberOfLines={2}>{item.subject}</Text>
                <Text style={[styles.profText, { color: colors.subtext, fontSize: 14 * fontSize }]}><Ionicons name="person-outline" size={14}/> {item.prof}</Text>
              </View>
              
              {/* Ticket Divider (Perforated Line effect) */}
              <View style={styles.ticketDividerRow}>
                <View style={[styles.cutoutLeft, { backgroundColor: colors.background }]} />
                <View style={[styles.dashedLine, { borderColor: colors.border }]} />
                <View style={[styles.cutoutRight, { backgroundColor: colors.background }]} />
              </View>

              {/* Ticket Bottom */}
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
          ))}
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
  ticketWrapper: { marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  ticketTop: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(29, 112, 245, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  typeText: { color: '#1D70F5', fontFamily: 'Poppins_700Bold', fontSize: 11, textTransform: 'uppercase' },
  subjectText: { fontFamily: 'Poppins_700Bold', marginBottom: 5 },
  profText: { fontFamily: 'Poppins_400Regular' },
  ticketDividerRow: { flexDirection: 'row', alignItems: 'center', height: 20, overflow: 'hidden', position: 'relative' },
  cutoutLeft: { position: 'absolute', left: -10, width: 20, height: 20, borderRadius: 10, zIndex: 2 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderStyle: 'dashed', marginHorizontal: 15 },
  cutoutRight: { position: 'absolute', right: -10, width: 20, height: 20, borderRadius: 10, zIndex: 2 },
  ticketBottom: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 },
  infoCol: { flex: 1 },
  infoLabel: { fontFamily: 'Poppins_600SemiBold', marginBottom: 2 },
  infoValue: { fontFamily: 'Poppins_700Bold' }
});
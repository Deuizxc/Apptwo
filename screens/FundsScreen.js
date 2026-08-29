import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useState, useCallback, useRef, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function FundsScreen() {
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

  const transactions = [
    { id: 1, title: 'Class T-Shirt Print', amount: '-₱350', date: 'Aug 28', icon: 'shirt', type: 'out' },
    { id: 2, title: 'Contribution: Intramurals', amount: '+₱100', date: 'Aug 25', icon: 'cash', type: 'in' },
    { id: 3, title: 'Room Cleaning Supplies', amount: '-₱120', date: 'Aug 20', icon: 'water', type: 'out' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Geometric Vault Background Elements */}
      <View style={[styles.circleVault, { backgroundColor: colors.primary }]} />
      <View style={[styles.squareVault, { backgroundColor: colors.border }]} />

      <Animated.ScrollView style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        
        <View style={styles.headerArea}>
          <Text style={[styles.headerTitle, { color: colors.card, fontSize: 28 * fontSize }]}>Class Vault</Text>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIsSidebarOpen(true); }} style={styles.menuBtn}>
            <Ionicons name="menu" size={32} color={colors.card} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceLabel, { color: 'rgba(255,255,255,0.8)', fontSize: 14 * fontSize }]}>Total SBIT-2A Funds</Text>
          <Text style={[styles.balanceAmount, { color: '#FFF', fontSize: 40 * fontSize }]}>₱4,250.00</Text>
        </View>

        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.actionIconBg, { backgroundColor: 'rgba(54, 224, 139, 0.1)' }]}>
                <Ionicons name="arrow-down" size={20} color="#36E08B" />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>Collect</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.actionIconBg, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                <Ionicons name="arrow-up" size={20} color="#FF6B6B" />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>Expense</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: colors.text, fontSize: 18 * fontSize }]}>Recent Transactions</Text>
            <TouchableOpacity><Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text></TouchableOpacity>
          </View>

          {transactions.map((t) => (
            <View key={t.id} style={[styles.transactionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.txIconContainer, { backgroundColor: colors.background }]}>
                <Ionicons name={t.icon} size={20} color={colors.text} />
              </View>
              <View style={styles.txDetails}>
                <Text style={[styles.txTitle, { color: colors.text, fontSize: 15 * fontSize }]}>{t.title}</Text>
                <Text style={[styles.txDate, { color: colors.subtext, fontSize: 12 * fontSize }]}>{t.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: t.type === 'in' ? '#36E08B' : '#FF6B6B', fontSize: 15 * fontSize }]}>
                {t.amount}
              </Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  circleVault: { position: 'absolute', top: -100, right: -50, width: width * 1.5, height: width * 1.5, borderRadius: width, opacity: 0.9 },
  squareVault: { position: 'absolute', top: 50, left: -40, width: 100, height: 100, transform: [{ rotate: '45deg' }], opacity: 0.1 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontFamily: 'Poppins_700Bold' },
  menuBtn: { padding: 5 },
  balanceContainer: { paddingHorizontal: 30, paddingTop: 10, paddingBottom: 40 },
  balanceLabel: { fontFamily: 'Poppins_600SemiBold', marginBottom: 5 },
  balanceAmount: { fontFamily: 'Poppins_700Bold' },
  sheet: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 30, paddingHorizontal: 25, minHeight: 500 },
  actionRow: { flexDirection: 'row', gap: 15, marginBottom: 35 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, borderWidth: 1, gap: 12 },
  actionIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontFamily: 'Poppins_700Bold', fontSize: 15 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyTitle: { fontFamily: 'Poppins_700Bold' },
  seeAll: { fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, borderWidth: 1, marginBottom: 12 },
  txIconContainer: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  txDetails: { flex: 1 },
  txTitle: { fontFamily: 'Poppins_600SemiBold', marginBottom: 2 },
  txDate: { fontFamily: 'Poppins_400Regular' },
  txAmount: { fontFamily: 'Poppins_700Bold' }
});
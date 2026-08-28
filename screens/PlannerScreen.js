import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PlannerScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>SBIT-2A Schedule</Text>
      
      <View style={styles.dayBlock}>
        <Text style={styles.dayTitle}>Monday</Text>
        
        <View style={styles.classCard}>
          <Text style={styles.time}>07:30 AM - 09:30 AM</Text>
          <Text style={styles.subject}>PF 101 - Object-Oriented Programming</Text>
          <Text style={styles.room}>Room: IL603a</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.time}>11:00 AM - 02:00 PM</Text>
          <Text style={styles.subject}>PF 101 - Object-Oriented Programming</Text>
          <Text style={styles.room}>Room: IK504 F1</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.time}>06:00 PM - 09:00 PM</Text>
          <Text style={styles.subject}>MS 101 - Discrete Mathematics</Text>
          <Text style={styles.room}>Room: IL304a</Text>
        </View>
      </View>

      <View style={styles.dayBlock}>
        <Text style={styles.dayTitle}>Tuesday</Text>
        
        <View style={styles.classCard}>
          <Text style={styles.time}>07:00 AM - 09:00 AM</Text>
          <Text style={styles.subject}>CC 105 - Information Management</Text>
          <Text style={styles.room}>Room: IL604a</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.time}>10:30 AM - 01:30 PM</Text>
          <Text style={styles.subject}>CC 105 - Information Management</Text>
          <Text style={styles.room}>Room: IE207c</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.time}>02:30 PM - 05:30 PM</Text>
          <Text style={styles.subject}>TECHNO 1 - Technopreneurship</Text>
          <Text style={styles.room}>Room: IL503a</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.time}>06:00 PM - 09:00 PM</Text>
          <Text style={styles.subject}>IS 106 - IS Project Management</Text>
          <Text style={styles.room}>Room: IL603a</Text>
        </View>
      </View>

      <View style={styles.dayBlock}>
        <Text style={styles.dayTitle}>Wednesday</Text>
        
        <View style={styles.classCard}>
          <Text style={styles.time}>07:00 AM - 10:00 AM</Text>
          <Text style={styles.subject}>NET 101 - Networking 1</Text>
          <Text style={styles.room}>Room: IK504 F1</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.time}>11:30 AM - 01:30 PM</Text>
          <Text style={styles.subject}>NET 101 - Networking 1</Text>
          <Text style={styles.room}>Room: IL604a</Text>
        </View>
      </View>

      <View style={styles.dayBlock}>
        <Text style={styles.dayTitle}>Thursday</Text>
        
        <View style={styles.classCard}>
          <Text style={styles.time}>07:00 AM - 09:00 AM</Text>
          <Text style={styles.subject}>CC 104 - Data Structures and Algorithms</Text>
          <Text style={styles.room}>Room: IL604a</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.time}>10:30 AM - 01:30 PM</Text>
          <Text style={styles.subject}>CC 104 - Data Structures and Algorithms</Text>
          <Text style={styles.room}>Room: IE207c</Text>
        </View>
      </View>

      <View style={styles.dayBlock}>
        <Text style={styles.dayTitle}>Saturday</Text>
        
        <View style={styles.classCard}>
          <Text style={styles.time}>02:30 PM - 04:30 PM</Text>
          <Text style={styles.subject}>PATHFIT 3 - Physical Activities</Text>
          <Text style={styles.room}>Room: SB OG</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 15 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  dayBlock: { 
    marginBottom: 20 
  },
  dayTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10 
  },
  classCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  time: { 
    color: '#007bff', 
    fontSize: 14, 
    marginBottom: 5,
    fontWeight: 'bold'
  },
  subject: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#222' 
  },
  room: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 5 
  }
});
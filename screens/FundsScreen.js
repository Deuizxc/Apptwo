import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function FundsScreen() {
  // This function will eventually handle opening the external Google Sheet link
  const openSpreadsheet = () => {
    alert("This button will open the Google Sheets link provided by the treasurer!");
    // Future code: Linking.openURL('https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Class Funds Monitoring</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.label}>Current Collection</Text>
        <Text style={styles.amount}>₱ ---</Text>
        <Text style={styles.subText}>Pending data from spreadsheet...</Text>
      </View>

      <TouchableOpacity style={styles.linkButton} onPress={openSpreadsheet}>
        <Text style={styles.linkButtonText}>Open Google Sheets Record</Text>
      </TouchableOpacity>
    </View>
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
    marginVertical: 20, 
    textAlign: 'center' 
  },
  summaryCard: { 
    backgroundColor: '#fff', 
    padding: 30, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 30,
    elevation: 2 
  },
  label: { 
    fontSize: 16, 
    color: '#666',
    fontWeight: 'bold'
  },
  amount: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#28a745', 
    marginVertical: 10 
  },
  subText: { 
    fontSize: 12, 
    color: '#999',
    fontStyle: 'italic'
  },
  linkButton: { 
    backgroundColor: '#007bff', 
    paddingVertical: 15, 
    borderRadius: 10, 
    alignItems: 'center',
    elevation: 3
  },
  linkButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});
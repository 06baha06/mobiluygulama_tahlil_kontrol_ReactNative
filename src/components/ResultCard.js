import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultCard = ({ result, formatAgeRange }) => (
  <View style={styles.resultCard}>
    <View style={styles.resultHeader}>
      <Text style={styles.resultTitle}>{result.testType}</Text>
      <Text style={styles.timestamp}>{result.timestamp}</Text>
    </View>
    <Text style={styles.resultText}>Yaş: {result.age} ay</Text>
    <Text style={styles.resultText}>Test Değeri: {result.userValue} mg/L</Text>
    
    {['cilv', 'ap', 'tjp', 'turkjmedsci', 'os'].map(guide => result[guide]?.range && ( // tjp eklendi
  <View key={guide} style={styles.guideContainer}>
    <Text style={styles.guideTitle}>{guide.toUpperCase()} Kılavuzu</Text>
    <Text style={styles.resultText}>Yaş Aralığı: {formatAgeRange(result[guide].range)}</Text>
    <Text style={styles.resultText}>Referans: {result[guide].referenceValue} mg/L</Text>
    <Text style={{
      fontSize: 16,
      fontWeight: 'bold',
      padding: 8,
      borderRadius: 12,
      overflow: 'hidden',
      ...(result[guide].status === 'yüksek' 
        ? { backgroundColor: '#f44336', color: 'white' }
        : result[guide].status === 'düşük'
        ? { backgroundColor: '#ff9800', color: 'white' }
        : { backgroundColor: '#4caf50', color: 'white' }
      )
    }}>
      {result[guide].status}
    </Text>
  </View>
))}
  </View>
);

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  guideContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
});

export default ResultCard;
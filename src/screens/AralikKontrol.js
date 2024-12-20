import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import {CustomTextInput, CustomButton} from '../components'

const AralikKontrol = () => {
  const [igData, setIgData] = useState([])
  const [age, setAge] = useState('')
  const [selectedIg, setSelectedIg] = useState('')
  const [testValue, setTestValue] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIgData()
  }, [])

  const getIgData = async () => {
    setLoading(true)
    try {
      const allData = []
      const querySnapshot = await getDocs(collection(db, "kilavuz-cilv"))
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          allData.push({ ...doc.data(), id: doc.id })
        }
      })
      setIgData(allData)
    } catch (error) {
      console.log("Veri çekme hatası:", error)
      alert("Veri yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const findAgeRange = (ageInMonths, testData) => {
    if (!testData) return null

    const ranges = Object.keys(testData).filter(key => key !== 'id')

    for (let range of ranges) {
      if (range === 'Cord') continue

      // "≥" işareti ile başlayan özel durumlar için
      if (range.includes('≥')) {
        const ageValue = parseInt(range.match(/\d+/)[0])
        const isYears = range.toLowerCase().includes('years')
        const monthValue = isYears ? ageValue * 12 : ageValue
        
        if (ageInMonths >= monthValue) return range
        continue
      }

      // Normal aralıklar için kontrol
      if (range.includes('-')) {
        const [min, max] = range.split('-').map(Number)
        if (ageInMonths >= min && ageInMonths < max) return range
        continue
      }

      // Sadece sayısal değer varsa
      const ageValue = parseInt(range)
      if (!isNaN(ageValue) && ageInMonths >= ageValue) return range
    }

    return null
  }

  const formatAgeRange = (range) => {
    if (range.includes('≥')) return range 
    if (range === 'Cord') return 'Kordon kanı'
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(Number)
      return `${min}-${max} ay`
    }
    return `≥${range} ay`
  }

  const checkRange = () => {
    const ageInMonths = parseInt(age)
    const userValue = parseFloat(testValue)

    if (isNaN(ageInMonths) || isNaN(userValue)) {
      alert('Lütfen geçerli değerler giriniz')
      return
    }

    if (!selectedIg) {
      alert('Lütfen bir test tipi seçiniz')
      return
    }

    const testData = igData.find(item => item.id === selectedIg)
    if (!testData) {
      alert('Test tipi bulunamadı')
      return
    }

    const ageRange = findAgeRange(ageInMonths, testData)
    if (!ageRange) {
      alert('Bu yaş için referans aralığı bulunamadı')
      return
    }

    const referenceValue = testData[ageRange]
    const [minRef, maxRef] = referenceValue.split('-').map(Number)
    
    let status
    if (userValue < minRef) status = 'düşük'
    else if (userValue > maxRef) status = 'yüksek'
    else status = 'normal'

    const newResult = {
      id: Date.now(),
      testType: selectedIg,
      age: ageInMonths,
      range: ageRange,
      referenceValue: referenceValue,
      userValue: userValue,
      status: status,
      timestamp: new Date().toLocaleString()
    }

    setResults(prevResults => [newResult, ...prevResults])
    
    setAge('')
    setSelectedIg('')
    setTestValue('')
  }

  const clearResults = () => {
    setResults([])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Test Tipi:</Text>
            <View style={styles.pickerContainer}>
              {igData.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.igButton,
                    selectedIg === item.id && styles.selectedIgButton
                  ]}
                  onPress={() => setSelectedIg(item.id)}
                >
                  <Text style={[
                    styles.igButtonText,
                    selectedIg === item.id && styles.selectedIgButtonText
                  ]}>
                    {item.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomTextInput
              title="Yaş (Ay)"
              isSecureText={false}
              handleOnChangeText={setAge}
              handleValue={age}
              handlePlaceholder="Yaşı ay cinsinden giriniz"
            />

            <CustomTextInput
              title="Test Değeri"
              isSecureText={false}
              handleOnChangeText={setTestValue}
              handleValue={testValue}
              handlePlaceholder="Test değerini giriniz"
            />

            <CustomButton
              buttonText="Kontrol Et"
              setWith="100%"
              handleOnPress={checkRange}
            />
          </View>

          {results.length > 0 && (
            <CustomButton
              buttonText="Sonuçları Temizle"
              setWith="50%"
              handleOnPress={clearResults}
            />
          )}

          {results.map((result) => (
            <View key={result.id} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>{result.testType}</Text>
                <Text style={styles.timestamp}>{result.timestamp}</Text>
              </View>
              <Text style={styles.resultText}>Yaş: {result.age} ay</Text>
              <Text style={styles.resultText}>Yaş Aralığı: {formatAgeRange(result.range)}</Text>
              <Text style={styles.resultText}>Referans Aralığı: {result.referenceValue}mg/L</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.resultText}>Test Değeri: {result.userValue} mg/L</Text>
                <Text style={[
                  styles.statusText,
                  result.status === 'normal' && styles.normalStatus,
                  result.status === 'düşük' && styles.lowStatus,
                  result.status === 'yüksek' && styles.highStatus,
                ]}>
                  {result.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AralikKontrol

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  igButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2196F3',
    backgroundColor: 'white',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedIgButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  igButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  selectedIgButtonText: {
    color: 'white',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  normalStatus: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  lowStatus: {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  highStatus: {
    backgroundColor: '#f44336',
    color: 'white',
  }
})

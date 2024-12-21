import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import {CustomTextInput, CustomButton} from '../components'

const AralikKontrol = () => {
  const [igDataCilv, setIgDataCilv] = useState([])
  const [igDataAp, setIgDataAp] = useState([])
  const [age, setAge] = useState('')
  const [selectedIg, setSelectedIg] = useState('')
  const [testValue, setTestValue] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getIgDataCilv(), getIgDataAp()])
  }, [])

  const getIgDataCilv = async () => {
    try {
      const allData = []
      const querySnapshot = await getDocs(collection(db, "kilavuz-cilv"))
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          allData.push({ ...doc.data(), id: doc.id })
        }
      })
      setIgDataCilv(allData)
    } catch (error) {
      console.log("Cilv veri çekme hatası:", error)
    }
  }

  const getIgDataAp = async () => {
    try {
      const allData = []
      const querySnapshot = await getDocs(collection(db, "kilavuz-ap"))
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          allData.push({ ...doc.data(), id: doc.id })
        }
      })
      setIgDataAp(allData)
      setLoading(false)
    } catch (error) {
      console.log("AP veri çekme hatası:", error)
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

  const getStatusForGuide = (userValue, minRef, maxRef) => {
    if (userValue < minRef) return 'düşük'
    if (userValue > maxRef) return 'yüksek'
    return 'normal'
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

    // CILV kılavuzu kontrolü
    const testDataCilv = igDataCilv.find(item => item.id === selectedIg)
    const ageRangeCilv = testDataCilv ? findAgeRange(ageInMonths, testDataCilv) : null
    
    // AP kılavuzu kontrolü
    const testDataAp = igDataAp.find(item => item.id === selectedIg)
    const ageRangeAp = testDataAp ? findAgeRange(ageInMonths, testDataAp) : null

    // En az bir kılavuzda referans aralığı olmalı
    if (!testDataCilv && !testDataAp) {
      alert('Seçilen test tipi hiçbir kılavuzda bulunamadı')
      return
    }

    if (!ageRangeCilv && !ageRangeAp) {
      alert('Bu yaş için hiçbir kılavuzda referans aralığı bulunamadı')
      return
    }

    let statusCilv = 'belirsiz'
    let statusAp = 'belirsiz'
    let referenceValueCilv = 'Mevcut değil'
    let referenceValueAp = 'Mevcut değil'

    // CILV değerlendirmesi
    if (ageRangeCilv && testDataCilv) {
      referenceValueCilv = testDataCilv[ageRangeCilv]
      const [minRefCilv, maxRefCilv] = referenceValueCilv.split('-').map(Number)
      statusCilv = getStatusForGuide(userValue, minRefCilv, maxRefCilv)
    }

    // AP değerlendirmesi
    if (ageRangeAp && testDataAp) {
      referenceValueAp = testDataAp[ageRangeAp]
      const [minRefAp, maxRefAp] = referenceValueAp.split('-').map(Number)
      statusAp = getStatusForGuide(userValue, minRefAp, maxRefAp)
    }

    const newResult = {
      id: Date.now(),
      testType: selectedIg,
      age: ageInMonths,
      userValue: userValue,
      cilv: {
        range: ageRangeCilv,
        referenceValue: referenceValueCilv,
        status: statusCilv
      },
      ap: {
        range: ageRangeAp,
        referenceValue: referenceValueAp,
        status: statusAp
      },
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

  const getCommonTests = () => {
    // Her iki koleksiyonda bulunan test tiplerini al
    const cilvTests = igDataCilv.map(item => item.id)
    const apTests = igDataAp.map(item => item.id)
    
    // Tekrar eden test tiplerini tekilleştir
    const uniqueTests = Array.from(new Set([...cilvTests, ...apTests]))
    
    // Her bir test için her iki koleksiyonda da kontrol yap
    const commonTests = uniqueTests.filter(testId => {
      const inCilv = cilvTests.includes(testId)
      const inAp = apTests.includes(testId)
      
      // En az bir koleksiyonda varsa true döndür
      return inCilv || inAp
    })
    
    return commonTests
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
              {getCommonTests().map((testId) => (
                <TouchableOpacity
                  key={testId}
                  style={[
                    styles.igButton,
                    selectedIg === testId && styles.selectedIgButton
                  ]}
                  onPress={() => setSelectedIg(testId)}
                >
                  <Text style={[
                    styles.igButtonText,
                    selectedIg === testId && styles.selectedIgButtonText
                  ]}>
                    {testId}
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
              <Text style={styles.resultText}>Test Değeri: {result.userValue} mg/L</Text>
              
              <View style={styles.guideContainer}>
                <Text style={styles.guideTitle}>CILV Kılavuzu</Text>
                {result.cilv.range && (
                  <>
                    <Text style={styles.resultText}>Yaş Aralığı: {formatAgeRange(result.cilv.range)}</Text>
                    <Text style={styles.resultText}>Referans: {result.cilv.referenceValue} mg/L</Text>
                    <Text style={[
                      styles.statusText,
                      result.cilv.status === 'normal' && styles.normalStatus,
                      result.cilv.status === 'düşük' && styles.lowStatus,
                      result.cilv.status === 'yüksek' && styles.highStatus,
                    ]}>
                      {result.cilv.status}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.guideContainer}>
                <Text style={styles.guideTitle}>AP Kılavuzu</Text>
                {result.ap.range && (
                  <>
                    <Text style={styles.resultText}>Yaş Aralığı: {formatAgeRange(result.ap.range)}</Text>
                    <Text style={styles.resultText}>Referans: {result.ap.referenceValue} mg/L</Text>
                    <Text style={[
                      styles.statusText,
                      result.ap.status === 'normal' && styles.normalStatus,
                      result.ap.status === 'düşük' && styles.lowStatus,
                      result.ap.status === 'yüksek' && styles.highStatus,
                    ]}>
                      {result.ap.status}
                    </Text>
                  </>
                )}
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
  }
})

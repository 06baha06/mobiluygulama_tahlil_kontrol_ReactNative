import { StyleSheet, View, ScrollView, SafeAreaView, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { CustomButton } from '../components'
import ResultCard from '../components/ResultCard'
import InputSection from '../components/InputSection'

const AralikKontrol = () => {
  const [state, setState] = useState({
    data: { cilv: [], ap: [], tjp: [], turkjmedsci: [], os:[] },
    age: '',
    selectedIg: '',
    testValue: '',
    results: [],
    loading: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = {
        cilv: await fetchCollection("kilavuz-cilv"),
        ap: await fetchCollection("kilavuz-ap"),
        tjp: await fetchCollection("kilavuz-tjp"),
        turkjmedsci: await fetchCollection("kilavuz-turkjmedsci"),
        os: await fetchCollection("kilavuz-os"),
      }
      setState(prev => ({ ...prev, data, loading: false }))
    } catch (error) {
      console.log("Veri çekme hatası:", error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const fetchCollection = async (name) => (await getDocs(collection(db, name)))
    .docs.filter(doc => doc.exists())
    .map(doc => ({ ...doc.data(), id: doc.id }))

  const findAgeRange = (age, data) => {
    if (!data) return null
    return Object.keys(data).filter(key => key !== 'id').find(range => {
      if (range === 'Cord') return false
      if (range.includes('≥')) {
        const [value, unit] = range.match(/\d+|years/g)
        return age >= (unit === 'years' ? value * 12 : value)
      }
      const [min, max] = range.includes('-') ? range.split('-').map(Number) : [parseInt(range)]
      return !isNaN(min) && (max ? age >= min && age < max : age >= min)
    })
  }

  const processGuide = (data, testId, age, value) => {
    const testData = data.find(item => item.id === testId)
    if (!testData) return null
    const range = findAgeRange(age, testData)
    if (!range) return null
    const refValue = testData[range]
    
    return {
      range,
      referenceValue: refValue,
      status: checkValueRange(value, refValue)
    }
}

const checkValueRange = (value, refRange) => {
    // "≤19" veya "≥19" gibi tek değerli ifadeler için
    if (refRange.includes('≤')) {
        const limit = parseFloat(refRange.replace('≤', ''))
        return value <= limit ? 'normal' : 'yüksek'
    }
    if (refRange.includes('≥')) {
        const limit = parseFloat(refRange.replace('≥', ''))
        return value >= limit ? 'normal' : 'düşük'
    }

    // "18-250" gibi aralık değerleri için
    if (refRange.includes('-')) {
        const [min, max] = refRange.split('-').map(Number)
        if (value < min) return 'düşük'
        if (value > max) return 'yüksek'
        return 'normal'
    }
    return 'belirsiz'
}

  const checkRange = () => {
    const { age, testValue, selectedIg, data } = state
    const ageNum = parseInt(age)
    const valueNum = parseFloat(testValue)

    if (isNaN(ageNum) || isNaN(valueNum)) return alert('Geçerli değerler giriniz')
    if (!selectedIg) return alert('Test tipi seçiniz')

    const guides = {
      cilv: processGuide(data.cilv, selectedIg, ageNum, valueNum),
      ap: processGuide(data.ap, selectedIg, ageNum, valueNum),
      tjp: processGuide(data.tjp, selectedIg, ageNum, valueNum),
      turkjmedsci: processGuide(data.turkjmedsci, selectedIg, ageNum, valueNum),
      os: processGuide(data.os, selectedIg, ageNum, valueNum)
    }

    if (!guides.cilv && !guides.ap && !guides.tjp && !guides.turkjmedsci && !guides.os) return alert('Referans aralığı bulunamadı')

    setState(prev => ({
      ...prev,
      results: [{
        id: Date.now(),
        testType: selectedIg,
        age: ageNum,
        userValue: valueNum,
        ...guides,
        timestamp: new Date().toLocaleString()
      }, ...prev.results],
      age: '',
      selectedIg: '',
      testValue: ''
    }))
  }

  const formatAgeRange = range => range.includes('≥') ? range : 
    range === 'Cord' ? 'Kordon kanı' : 
    range.includes('-') ? `${range} ay` : `≥${range} ay`

  if (state.loading) {
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
          <InputSection 
            state={state}
            setState={setState}
            checkRange={checkRange}
          />
          
          {state.results.length > 0 && (
            <CustomButton
              buttonText="Sonuçları Temizle"
              setWith="50%"
              handleOnPress={() => setState(prev => ({ ...prev, results: [] }))}
            />
          )}

          {state.results.map(result => (
            <ResultCard 
              key={result.id}
              result={result}
              formatAgeRange={formatAgeRange}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

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
})

export default AralikKontrol
import { StyleSheet, View, Animated, Dimensions, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import CustomButton from '../components/CustomButton'
import PatientCard from '../components/PatientCard'
import AddPatientForm from '../components/AddPatientForm'

const { height } = Dimensions.get('window')

const initialFormState = {
  AdiSoyadi: '', DogumTarihi: '', TcNo: '', 
  IgA: '', IgM: '', IgG: '', 
  IgG1: '', IgG2: '', IgG3: '', IgG4: ''
}

const HomePage = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormState)

  const translateY = useRef(new Animated.Value(height)).current

  useEffect(() => {
    getData()
  }, [isSaved])

  useEffect(() => {
    const filtered = data.filter(patient => 
      patient.TcNo.toString().includes(searchQuery.trim())
    )
    setFilteredData(filtered)
  }, [searchQuery, data])

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true
      }).start(() => setIsDrawerOpen(false))
    } else {
      setIsDrawerOpen(true)
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()
    }
  }

  const sendData = async () => {
    try {
      const processedData = {
        ...Object.keys(formData).reduce((acc, key) => ({
          ...acc,
          [key]: formData[key] || null
        }), {}),
        eklemeTarihi: new Date().toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul',
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      await addDoc(collection(db, "hastalar"), processedData)
      setFormData(initialFormState)
      toggleDrawer()
      setIsSaved(!isSaved)
    } catch (error) {
      console.error("error adding document", error)
    }
  }

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hastalar"))
      const allData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setData(allData)
      setFilteredData(allData)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "hastalar", id))
      getData()
    } catch (error) {
      console.error("Error deleting document: ", error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="TC No ile ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardType="numeric"
        />
      </View>
      
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredData.map((patient, index) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            index={index}
            onDelete={deleteData}
          />
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          buttonText="Hasta Ekle"
          setWith="80%"
          handleOnPress={toggleDrawer}
        />
        <CustomButton
          buttonText="Verileri Yenile"
          setWith="80%"
          handleOnPress={getData}
        />
      </View>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateY }] }]}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.drawerContent}
        >
          <AddPatientForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={sendData}
            onClose={toggleDrawer}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: '90%',
  },
  drawerContent: {
    padding: 20,
    maxHeight: '90%',
  },
})
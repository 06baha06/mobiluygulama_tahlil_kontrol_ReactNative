// services/homeService.js
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

export const sendDataService = async (formData) => {
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
  } catch (error) {
    console.error("error adding document", error)
    throw error
  }
}

export const getDataService = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "hastalar"))
    const allData = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
    return allData.sort((a, b) => {
      return b.eklemeTarihi.localeCompare(a.eklemeTarihi)
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteDataService = async (id) => {
  try {
    await deleteDoc(doc(db, "hastalar", id))
  } catch (error) {
    console.error("Error deleting document: ", error)
    throw error
  }
}
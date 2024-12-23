import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

export const getUserTcNo = async (userId) => {
  try {
    const db = getFirestore()
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.TcNo
    }
    return null
  } catch (error) {
    console.log("TC No getirme hatası:", error)
    throw error
  }
}

export const getPatientData = async (tcNo) => {
  try {
    const db = getFirestore()
    const hastalarRef = collection(db, "hastalar")
    const q = query(hastalarRef, where("TcNo", "==", tcNo))
    const querySnapshot = await getDocs(q)
    
    const hastalar = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
    
    return hastalar.sort((a, b) => b.eklemeTarihi.localeCompare(a.eklemeTarihi))
  } catch (error) {
    console.log("Hasta verisi getirme hatası:", error)
    throw error
  }
}
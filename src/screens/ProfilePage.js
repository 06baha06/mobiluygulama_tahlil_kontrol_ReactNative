import { StyleSheet, View, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserCard from '../components/UserCard'
import { Loading, CustomButton } from '../components'
import { logout } from '../redux/userSlice'
import { getUserTcNo, getPatientData } from '../services/profileService'

const ProfilePage = () => {
  const [patientData, setPatientData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const tcNo = await getUserTcNo(user.uid)
      if (tcNo) {
        const patients = await getPatientData(tcNo)
        setPatientData(patients)
      }
    } catch (error) {
      console.log("Veri getirme hatası:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <CustomButton
          buttonText="Çıkış Yap"
          setWith="80%"
          handleOnPress={handleLogout}
          buttonStyle={{ backgroundColor: '#ff4444' }}
        />
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {patientData.map((patient) => (
          <UserCard
            key={patient.id}
            patient={patient}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default ProfilePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    marginTop: 100,
  },
  logoutContainer: {
    position: 'absolute',
    left: 10,
    top: 40,
    zIndex: 1
  }
})
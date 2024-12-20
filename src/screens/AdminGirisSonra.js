import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'

const AdminGirisSonra = ({ navigation }) => {

  const dispatch= useDispatch()

  const handleLogout =()=>{
    dispatch(logout())
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdminGirisSonra</Text>
      
      <Button 
        title="Hasta görüntüleme ekranı"
        onPress={() => navigation.navigate('Home')}
      />

      <Button 
        title="Değer kontrol sayfası"
        onPress={() => navigation.navigate('AralikKontrol')}
      />

      <Button 
        title="Çıkış"
        onPress={handleLogout}
      />
    </View>
  )
}

export default AdminGirisSonra

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  }
})
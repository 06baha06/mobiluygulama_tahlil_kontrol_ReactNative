import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'

const AdminGirisSonra = ({ navigation }) => {
 const dispatch = useDispatch()

 const handleLogout = () => {
   dispatch(logout())
 }

 const menuItems = [
   {
     title: 'Hasta Görüntüleme',
     subtitle: 'Hasta bilgilerini görüntüle ve düzenle',
     onPress: () => navigation.navigate('Home')  
   },
   {
     title: 'Değer Kontrol',
     subtitle: 'İmmunoglobulin değerlerini kontrol et',
     onPress: () => navigation.navigate('AralikKontrol')
   }
 ]

 return (
   <View style={styles.container}>
     <Text style={styles.title}>Admin Panel</Text>
     
     <View style={styles.menuContainer}>
       {menuItems.map((item, index) => (
         <TouchableOpacity 
           key={index}
           style={styles.menuItem}
           onPress={item.onPress}
         >
           <Text style={styles.menuTitle}>{item.title}</Text>
           <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
         </TouchableOpacity>
       ))}
     </View>

     <TouchableOpacity 
       style={styles.logoutButton}
       onPress={handleLogout}
     >
       <Text style={styles.logoutText}>Çıkış Yap</Text>
     </TouchableOpacity>
   </View>
 )
}

export default AdminGirisSonra

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f7fa',
   padding: 20
 },
 title: {
   fontSize: 28,
   fontWeight: 'bold',
   color: '#1a237e',
   textAlign: 'center',
   marginVertical: 30
 },
 menuContainer: {
   gap: 15
 },
 menuItem: {
   backgroundColor: '#fff',
   padding: 20,
   borderRadius: 12,
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 3,
 },
 menuTitle: {
   fontSize: 18,
   fontWeight: '600',
   color: '#2962ff',
   marginBottom: 5
 },
 menuSubtitle: {
   fontSize: 14,
   color: '#666',
 },
 logoutButton: {
   backgroundColor: '#ff1744',
   padding: 15,
   borderRadius: 10,
   position: 'absolute',
   bottom: 30,
   left: 20,
   right: 20,
   alignItems: 'center'
 },
 logoutText: {
   color: '#fff',
   fontSize: 16,
   fontWeight: '600'
 }
})
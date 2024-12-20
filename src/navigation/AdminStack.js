import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AdminGirisSonra, AralikKontrol, HomePage } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name='AdminGirisSonra' component={AdminGirisSonra}/>
      <Stack.Screen name='Home' component={HomePage}/>
      <Stack.Screen name='AralikKontrol' component={AralikKontrol}/>
    
  </Stack.Navigator>
  )
}

export default AdminStack

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AralikKontrol , ProfilePage } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
    
    <Stack.Screen name='Profile' component={ProfilePage}/>
    <Stack.Screen name='AralikKontrol' component={AralikKontrol}/>
  </Stack.Navigator>
  )
}

export default UserStack

const styles = StyleSheet.create({})
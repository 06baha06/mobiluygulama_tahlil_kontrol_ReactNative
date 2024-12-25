import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import React, {useState} from 'react'
import {CustomTextInput, CustomButton, Loading} from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../redux/userSlice'

const SignupPage = () => {
 const [name, setName] = useState("")
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [tcNo, setTcNo] = useState("")

 const dispatch = useDispatch();
 const {isLoading} = useSelector(state=>state.user)
 
 const handleRegister = () => {
   dispatch(register({email, password, tcNo}))
 }

 if(isLoading){
   return <Loading/>
 }

 return (
   <SafeAreaView style={styles.container}>
     <StatusBar style="light" />
     
     <View style={styles.content}>
       <View style={styles.headerContainer}>
         <Text style={styles.title}>Kayıt Ol</Text>
         <Text style={styles.subtitle}>Yeni bir hesap oluştur</Text>
       </View>

       <View style={styles.formContainer}>
         <CustomTextInput
           title="TC Kimlik No"
           isSecureText={false}
           handleOnChangeText={setTcNo}
           handleValue={tcNo}
           handlePlaceholder='TC Kimlik No girin'
           keyboardType="numeric"
         />

         <CustomTextInput
           title="Email"
           isSecureText={false}
           handleOnChangeText={setEmail}
           handleValue={email}
           handlePlaceholder='Email adresinizi girin'
         />

         <CustomTextInput
           title="Şifre"
           isSecureText={true}
           handleOnChangeText={setPassword}
           handleValue={password}
           handlePlaceholder='Şifrenizi girin'
         />

         <View style={styles.buttonContainer}>
           <CustomButton
             buttonText="Kayıt Ol"
             setWith="100%"
             handleOnPress={handleRegister}
           />
         </View>
       </View>
     </View>
   </SafeAreaView>
 )
}

export default SignupPage

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#2962ff',
 },
 content: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
   paddingHorizontal: 20,
 },
 headerContainer: {
   alignItems: 'center',
   marginBottom: 40,
 },
 title: {
   fontSize: 28,
   fontWeight: 'bold',
   color: '#fff',
   marginBottom: 10,
 },
 subtitle: {
   fontSize: 16,
   color: '#fff',
   opacity: 0.8,
 },
 formContainer: {
   width: '100%',
   backgroundColor: '#fff',
   borderRadius: 20,
   padding: 20,
   elevation: 5,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
 },
 buttonContainer: {
   marginTop: 20,
   width: '100%',
 }
});
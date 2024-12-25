import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, View, Image, SafeAreaView, Text, Dimensions } from 'react-native';
import {Loading, CustomTextInput, CustomButton} from '../components/';
import { useSelector, useDispatch } from 'react-redux';
import {setIsLoading, setLogin } from '../redux/userSlice';
import { login } from '../redux/userSlice';

const {width} = Dimensions.get('window')

const LoginPage = ({navigation}) => {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const {isLoading} = useSelector((state)=> state.user)
 const dispatch = useDispatch()

 return (
   <SafeAreaView style={styles.container}>
     <StatusBar style="light" />
     
     <View style={styles.content}>
       <View style={styles.headerContainer}>
         <Image
           source={require('../../assets/clipart1898543.png')}
           style={styles.image}
           resizeMode="contain"
         />
         <Text style={styles.title}>Hoş Geldiniz</Text>
         <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>
       </View>

       <View style={styles.formContainer}>
         <CustomTextInput
           title="Email"
           isSecureText={false}
           handleOnChangeText={(text) => setEmail(text)}
           handleValue={email}
           handlePlaceholder='Email adresinizi girin'
         />

         <CustomTextInput
           title="Şifre"
           isSecureText={true}
           handleOnChangeText={(password) => setPassword(password)}
           handleValue={password}
           handlePlaceholder='Şifrenizi girin'
         />

         <View style={styles.buttonContainer}>
           <CustomButton
             buttonText="Giriş Yap"
             setWith="100%"
             handleOnPress={() => dispatch(login({email, password}))}
           />

           <View style={styles.signupContainer}>
             <Text style={styles.signupText}>Hesabınız yok mu?</Text>
             <CustomButton
               buttonText="Kayıt Ol"
               setWith="40%"
               handleOnPress={() => navigation.navigate('SignUp')}
             />
           </View>
         </View>
       </View>
     </View>

     {isLoading ? <Loading changeIsLoading={()=>dispatch(setIsLoading(false))}/> : null}
   </SafeAreaView>
 );
}

export default LoginPage

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
  image: {
    height: width * 0.3,
    width: width * 0.3,
    marginBottom: 20,
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
 },
 signupContainer: {
   marginTop: 20,
   alignItems: 'center',
 },
 signupText: {
   fontSize: 14,
   color: '#666',
   marginBottom: 10,
 }
});
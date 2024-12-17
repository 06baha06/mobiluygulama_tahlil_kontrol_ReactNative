import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Image, SafeAreaView } from 'react-native';
import {Loading, CustomTextInput, CustomButton} from '../components/';
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword, setIsLoading, setLogin } from '../redux/userSlice';


const LoginPage = ({navigation})=> {

  
  //userSlice içerisindeki verilerin okunması
  const {email, password,isLoading} = useSelector((state)=> state.user)

  //userslice içerisindeki reducer yapılarını kullanma veya veri gönderme
  const dispatch = useDispatch()

  return (

  <SafeAreaView style={styles.container}>
       <View style={styles.viewcontainer} >
    
        <Image
          source={require('../../assets/favicon.png')}
          style={styles.image}
    
        />

    <CustomTextInput
    title="Email"
    isSecureText={false}
    handleOnChangeText={(text) => dispatch(setEmail(text))}
    handleValue={email}
    handlePlaceholder='Email girin'
    />


    <CustomTextInput
    title="Password"
    isSecureText={true}
    handleOnChangeText={(password) => dispatch(setPassword(password))}
    handleValue={password}
    handlePlaceholder='Sifre girin'
    />

    <CustomButton
      buttonText="Login"
      setWith="80%"
      handleOnPress={() => dispatch(setLogin())}
    />

    <CustomButton
       buttonText="Sign Up"
       setWith="30%"
       handleOnPress={() => navigation.navigate('SignUp')}
    />
    
    {isLoading ? <Loading changeIsLoading={()=>dispatch(setIsLoading(false))}/> : null}


   </View>

  </SafeAreaView>
   
  );
}

export default LoginPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  
  image:{
    height:100,
    width:100
  },
  viewcontainer:{
    width:'80%',
    alignItems:'center'
  }
  
});

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable,TextInput, Image, SafeAreaView } from 'react-native';
import {Loading, CustomTextInput, CustomButton} from '../components/';


const LoginPage = ({navigation})=> {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
    handleOnChangeText={setEmail}
    handleValue={email}
    handlePlaceholder='Email girin'
    />


    <CustomTextInput
    title="Password"
    isSecureText={true}
    handleOnChangeText={setPassword}
    handleValue={password}
    handlePlaceholder='Sifre girin'
    />

    <CustomButton
      buttonText="Login"
      setWith="80%"
      handleOnPress={() => setIsLoading(true)}
    />

    <CustomButton
       buttonText="Sign Up"
       setWith="30%"
       handleOnPress={() => navigation.navigate('SignUp')}
    />
    
    {isLoading ? <Loading changeIsLoading={()=>setIsLoading(false)}/> : null}


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

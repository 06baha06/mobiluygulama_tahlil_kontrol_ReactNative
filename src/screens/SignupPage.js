import { StyleSheet, Text, View, SafeAreaView} from 'react-native'
import React,{useState} from 'react'
import {CustomTextInput, CustomButton, Loading} from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../redux/userSlice'

const SignupPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch();

  const {isLoading} = useSelector(state=>state.user)
  const handleRegister =()=>{
    dispatch(register({email, password}))
  }

  if(isLoading){
    return <Loading/>
  }
  return (

    <SafeAreaView  style={styles.container}>
      <View style={styles.viewcontainer}>
      
       <CustomTextInput
      title="Name"
      isSecureText={false}
      handleOnChangeText={setName}
      handleValue={name}
      handlePlaceholder='İsim girin'
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
        buttonText="Sign Up"
        setWith="80%"
        handleOnPress={handleRegister}
      />
    </View>

    </SafeAreaView>
    
  )
}

export default SignupPage

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'lightblue'
      },
      viewcontainer:{
        width:'80%',
        alignItems:'center'
      }
})
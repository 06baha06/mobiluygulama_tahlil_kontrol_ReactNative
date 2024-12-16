import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, } from 'react-native';
import Loading from '../components/Loading';


const LoginPage = ({navigation})=> {

  const [name,setName] = useState("")
  const [lastName,setLastName] = useState("")
  const [result,setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <View style={styles.container}>
    
      <Image
      source={require('../../assets/favicon.png')}
      style={styles.image}
      
      />

      <Text>Welcome {result}</Text>
      
      <Text>Email</Text>
      <TextInput
        placeholder='Enter Your Email'
        style={styles.textInputStyle}
        onChangeText={setName}
        value={name}
      ></TextInput>

      <Text>Password</Text>
      <TextInput
      secureTextEntry={true}
        placeholder='Enter Your Password'
        style={styles.textInputStyle}
        onChangeText={setLastName}
        value={lastName}
      ></TextInput>

      <Pressable
        onPress={() => setIsLoading(true)}
        style={({pressed}) => [
          styles.button,
          {
            backgroundColor: pressed ? 'gray' : 'blue'
          }
        ]}
      >
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('SignUp')}
        style={({pressed}) => [
          styles.signupButton,
          {
            backgroundColor: pressed ? 'gray' : 'blue',
            marginTop:50,
          }
        ]}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
      {isLoading ? <Loading changeIsLoading={()=>setIsLoading(false)}/> : null}


    </View>
  );
}

export default LoginPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle:{
    borderWidth:1,
    width:'80%',
    height:50,
    borderRadius:10,
    marginVertical:10,
    textAlign:'center',
    color:'blue',
    fontWeight:'bold'
  },
  button:{
    width:'80%', 
    height:50, 
    borderRadius:10,
    alignItems:'center', 
    justifyContent:'center',  
    backgroundColor: 'lightblue'
  },
  buttonText:{
    fontWeight:'bold',
    color:'white'
  },
  image:{
    height:100,
    width:100
  },
  signupButton:{
    width:'30%', 
    height:50, 
    borderRadius:10,
    alignItems:'center', 
    justifyContent:'center',  
    backgroundColor: 'lightblue'
  }
});

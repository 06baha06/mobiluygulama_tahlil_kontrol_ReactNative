import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, } from 'react-native';

export default function App() {

  const [name,setName] = useState("")
  const [lastName,setLastName] = useState("")
  const [result,setResult] = useState("")

  return (
    <View style={styles.container}>
    
      <Text>Welcome {result}</Text>
      
      <Text>Name</Text>
      <TextInput
        placeholder='Enter Your Name'
        style={styles.textInputStyle}
        onChangeText={setName}
        value={name}
      ></TextInput>

      <Text>Last Name</Text>
      <TextInput
        placeholder='Enter Your Last Name'
        style={styles.textInputStyle}
        onChangeText={setLastName}
        value={lastName}
      ></TextInput>

      <Pressable
        onPress={() => setResult(name + " " + lastName)}
        style={({pressed}) => [
          styles.button,
          {
            backgroundColor: pressed ? 'gray' : 'blue'
          }
        ]}
      >
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>


    </View>
  );
}

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
  }
});

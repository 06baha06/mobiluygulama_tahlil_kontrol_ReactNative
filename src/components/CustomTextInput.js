import { StyleSheet, Text, View, TextInput} from 'react-native'
import React from 'react'

const CustomTextInput = ({title, isSecureText,handleOnChangeText,handleValue,handlePlaceholder}) => {
  return (
    <View style={styles.inputContainer}>
            <Text style={styles.inputBoxText}>{title}</Text>
              <TextInput
              
               placeholder={handlePlaceholder}
               secureTextEntry={isSecureText}
                style={styles.textInputStyle}
               onChangeText={handleOnChangeText}
               value={handleValue}
              ></TextInput>
    
          </View>
  )
}

export default CustomTextInput

const styles = StyleSheet.create({

    inputContainer:{
        width:'80%'
      },
      signupButton:{
        width:'30%', 
        height:50, 
        borderRadius:10,
        alignItems:'center', 
        justifyContent:'center',  
        backgroundColor: 'lightblue'
      },
      inputBoxText:{
        fontWeight:'bold',
        alignSelf:'flex-start'
        
    
      },
      textInputStyle:{
        borderBottomWidth:0.6,
        width:'100%',
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
        backgroundColor: 'lightblue',
        marginTop:10
      },
      buttonText:{
        fontWeight:'bold',
        color:'white'
      },
})
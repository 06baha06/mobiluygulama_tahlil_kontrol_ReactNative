import { StyleSheet, Text,Pressable } from 'react-native'
import React from 'react'

const CustomButton = ({buttonText, setWith,handleOnPress }) => {
  return (
    <Pressable
        onPress={() => handleOnPress()}
        style={({pressed}) => [
          styles.button,
          {
            backgroundColor: pressed ? 'gray' : 'blue', width:'80%',
            width:setWith,
          }
        ]}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    button:{
         
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
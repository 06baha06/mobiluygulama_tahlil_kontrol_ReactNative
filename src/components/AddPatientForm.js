import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const AddPatientForm = ({ formData, setFormData, onSubmit, onClose }) => {
  const inputFields = [
    { key: 'AdiSoyadi', placeholder: 'Adı Soyadı', keyboardType: 'default' },
    { key: 'DogumTarihi', placeholder: 'Doğum Tarihi', keyboardType: 'default' },
    { key: 'TcNo', placeholder: 'TC No', keyboardType: 'numeric' },
    { key: 'IgA', placeholder: 'IgA Değeri', keyboardType: 'numeric' },
    { key: 'IgM', placeholder: 'IgM Değeri', keyboardType: 'numeric' },
    { key: 'IgG', placeholder: 'IgG Değeri', keyboardType: 'numeric' },
    { key: 'IgG1', placeholder: 'IgG1 Değeri', keyboardType: 'numeric' },
    { key: 'IgG2', placeholder: 'IgG2 Değeri', keyboardType: 'numeric' },
    { key: 'IgG3', placeholder: 'IgG3 Değeri', keyboardType: 'numeric' },
    { key: 'IgG4', placeholder: 'IgG4 Değeri', keyboardType: 'numeric' },
  ]

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.drawerTitle}>Yeni Hasta Ekle</Text>
      
      {inputFields.map((field) => (
        <TextInput
          key={field.key}
          style={styles.input}
          placeholder={field.placeholder}
          value={formData[field.key]}
          onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
          keyboardType={field.keyboardType}
        />
      ))}

      <View style={styles.drawerButtons}>
        <CustomButton
          buttonText="Kaydet"
          setWith="45%"
          handleOnPress={onSubmit}
        />
        <CustomButton
          buttonText="İptal"
          setWith="45%"
          handleOnPress={onClose}
        />
      </View>
    </ScrollView>
  )
}

export default AddPatientForm

const styles = StyleSheet.create({
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  drawerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
})
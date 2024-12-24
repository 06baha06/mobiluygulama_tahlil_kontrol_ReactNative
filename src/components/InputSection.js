import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CustomTextInput, CustomButton } from './index';

const InputSection = ({ state, setState, checkRange }) => (
  <View style={styles.inputContainer}>
    <View style={styles.pickerContainer}>
    {[...new Set([...state.data.cilv, ...state.data.ap, ...state.data.tjp, ...state.data.turkjmedsci, ...state.data.os].map(x => x.id))].map(testId => (
  <TouchableOpacity
    key={testId}
    style={[styles.igButton, state.selectedIg === testId && styles.selectedIgButton]}
    onPress={() => setState(prev => ({ ...prev, selectedIg: testId }))}
  >
    <Text style={[styles.igButtonText, state.selectedIg === testId && styles.selectedIgButtonText]}>
      {testId}
    </Text>
  </TouchableOpacity>
))}
    </View>
    
    {['Yaş (Ay)', 'Test Değeri'].map((title, i) => (
      <CustomTextInput
        key={title}
        title={title}
        isSecureText={false}
        handleOnChangeText={value => setState(prev => ({ 
          ...prev, 
          [i === 0 ? 'age' : 'testValue']: value 
        }))}
        handleValue={i === 0 ? state.age : state.testValue}
        handlePlaceholder={`${title}ni giriniz`}
      />
    ))}
    <CustomButton buttonText="Kontrol Et" setWith="100%" handleOnPress={checkRange} />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  igButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2196F3',
    backgroundColor: 'white',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedIgButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  igButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  selectedIgButtonText: {
    color: 'white',
  },
});

export default InputSection;
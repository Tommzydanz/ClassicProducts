import React from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {InputProps} from './interface';

const Input: InputProps = function Input({
  keyboardType,
  secure,
  labelHolder,
  value,
  onUpdateValue,
  isInvalid,
  label,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputText}>{label}</Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        placeholder={labelHolder}
        placeholderTextColor="gray"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        autoCapitalize="none"
        value={value}
        onChangeText={onUpdateValue}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 12,
  },
  inputText: {
    fontSize: 14,
    fontWeight: 'bold',
    alignItems: 'flex-start',
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
    borderColor: '#585858',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputInvalid: {
    borderColor: '#CB2222',
  },
});

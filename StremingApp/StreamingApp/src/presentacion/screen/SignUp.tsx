import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../../lib/supabse';
import bcrypt from 'react-native-bcrypt';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const addUsuario = async () => {
    try {
      if (!email.includes('@')) {
        setErrorMessage('Por favor, ingrese un correo electrónico válido.');
        return;
      }
  
      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
  
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        setErrorMessage(error.message);
        return;
      }
  
      setSuccessMessage('Usuario registrado correctamente');
      setErrorMessage('');
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const tipoUsuarioValue = tipoUsuario === "administrador" ? 1 : tipoUsuario === "cliente" ? 2 : null;

      const { error: insertError } = await supabase
        .from('usuarios')
        .insert([{ email, contraseña: hashedPassword, fecha_registro: new Date(), tipo_usuario: tipoUsuarioValue }]);
  
      if (insertError) {
        console.error('Error al insertar en la tabla usuarios:', insertError);
        setErrorMessage('Error al guardar los datos en la base de usuarios.');
      }
  
    } catch (error) {
      setErrorMessage('Error al registrar el usuario: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Picker
        selectedValue={tipoUsuario}
        style={styles.input}
        onValueChange={(itemValue) => setTipoUsuario(itemValue)}
      >
        <Picker.Item label="Seleccione tipo de usuario" value="" />
        <Picker.Item label="Cliente" value="cliente" />
        <Picker.Item label="Administrador" value="administrador" />
      </Picker>
      <Button title="Registrar" onPress={addUsuario} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
});
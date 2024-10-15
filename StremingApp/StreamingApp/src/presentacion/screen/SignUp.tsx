import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse'; // Asegúrate de tener Supabase correctamente configurado en lib/supabase.js

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const addUsuario = async () => {
    try {
      // Asegúrate de que el email tenga un formato válido
      if (!email.includes('@')) {
        setErrorMessage('Por favor, ingrese un correo electrónico válido.');
        return;
      }
  
      // Intenta registrar el usuario con Supabase
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      // Si hay un error, mostrar el mensaje
      if (error) {
        setErrorMessage(error.message);
        return;
      }
  
      // Si el registro es exitoso, mostrar el mensaje de éxito
      setSuccessMessage('Usuario registrado correctamente');
      setErrorMessage('');
  
      // Si el usuario se registró correctamente, guarda en la tabla 'usuarios'
      const { data, error: insertError } = await supabase
        .from('usuarios')
        .insert([{ email, contraseña: password }]);  // Asegúrate de hashear la contraseña antes de insertarla
  
      if (insertError) {
        console.error('Error al insertar en la tabla usuarios:', insertError);
      }
  
    } catch (error) {
      setErrorMessage('Error al registrar el usuario: ' + error.message);
    }
  };
  
  
  
  
  

  return (
    <View style={styles.container}>
      <Text>Registro de Usuario</Text>
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
      <Button title="Registrar" onPress={addUsuario} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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

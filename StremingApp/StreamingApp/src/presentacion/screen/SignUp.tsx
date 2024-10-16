import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse'; // Asegúrate de tener Supabase correctamente configurado en lib/supabase.js
import bcrypt from 'react-native-bcrypt'; // Instala bcrypt para manejar el hash de la contraseña

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const addUsuario = async () => {
    try {
      // Validar el formato del correo electrónico
      if (!email.includes('@')) {
        setErrorMessage('Por favor, ingrese un correo electrónico válido.');
        return;
      }
  
      // Validar longitud mínima de la contraseña
      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
  
      // Intentar registrar el usuario con Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      // Mostrar el error si ocurrió alguno durante el registro
      if (error) {
        setErrorMessage(error.message);
        return;
      }
  
      // Mostrar mensaje de éxito
      setSuccessMessage('Usuario registrado correctamente');
      setErrorMessage('');
  
      // Hashear la contraseña antes de almacenarla en la base de datos
      const salt = bcrypt.genSaltSync(10); // Generar un salt con bcrypt
      const hashedPassword = bcrypt.hashSync(password, salt); // Hashear la contraseña
  
      // Guardar el usuario en la tabla 'usuarios'
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert([{ email, contraseña: hashedPassword, fecha_registro: new Date() }]);
  
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

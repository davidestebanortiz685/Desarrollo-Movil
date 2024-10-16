// src/presentacion/screen/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(error.message);
    } else {
      // Sincronizar usuario con la base de datos
      await sincronizarUsuarios(email);
      
      // Navegar a la pantalla de perfil o home
      navigation.navigate('Home');
    }
  };

  const sincronizarUsuarios = async (email) => {
    // Obtener los datos del usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error obteniendo el usuario autenticado:', authError);
      return;
    }

    // Verificar si el usuario ya está en la tabla 'usuarios'
    const { data: usuarioData, error: userFetchError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (!usuarioData) {
      // Si no está, lo agregamos a la tabla 'usuarios'
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          email: email,
          nombre: user.user_metadata.full_name || 'Sin nombre',
          fecha_registro: new Date(),
        });

      if (insertError) {
        console.error('Error al insertar el usuario en la base de datos:', insertError.message);
      } else {
        console.log('Usuario sincronizado con éxito en la tabla usuarios.');
      }
    } else {
      console.log('El usuario ya está registrado en la base de datos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('SignUp')}
      >
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  link: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});

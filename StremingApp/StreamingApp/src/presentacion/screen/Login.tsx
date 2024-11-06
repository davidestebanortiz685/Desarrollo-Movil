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
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(loginError.message);
      return; // Termina la función si hay error en el login
    }

    // Sincronizar usuario con la base de datos
    await sincronizarUsuarios(email);
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
      .select('*, tipo_usuario(nombre_tipo)')
      .eq('email', email)
      .single();

    if (userFetchError) {
      console.error('Error al buscar usuario en la base de datos:', userFetchError.message);
      return;
    }

    if (!usuarioData) {
      setError('No tienes permiso para iniciar sesión.');
      console.error('El usuario no existe en la base de datos.');
      return;
    }

    // Verificar tipo de usuario
    const tipoUsuario = usuarioData.tipo_usuario?.nombre_tipo;
    if (tipoUsuario === 'administrador') {
      console.log('Usuario autorizado con rol: Administrador');
      navigation.navigate('Home'); // Navegar a la pantalla Home para administradores
    } else if (tipoUsuario === 'cliente') {
      console.log('Usuario autorizado con rol: Cliente');
      navigation.navigate('HomeCliente'); // Navegar a la pantalla HomeCliente para clientes
    } else {
      setError('No tienes permiso para iniciar sesión.');
      console.warn('Tipo de usuario no autorizado:', tipoUsuario);
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

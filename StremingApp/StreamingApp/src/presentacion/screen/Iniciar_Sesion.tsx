import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { signIn } from '../screen/services/authService'; // Servicio de autenticación

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.navigate('Profile'); // Redirigir a perfil si el inicio es exitoso
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to SignUp" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
};

export default Login;

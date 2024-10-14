import { supabase } from '../../../lib/supabse';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else if (session) {
        setUser(session.user);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate('Login');
  };

  if (!user) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>Email: {user.email}</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
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
});

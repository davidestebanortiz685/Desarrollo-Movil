import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
export default function InicioScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Start</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="SignUp"
            color="#f194ff"
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
  
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            color="#4CAF50"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

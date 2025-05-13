import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/rubik';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
    });
    if (!fontsLoaded) {
        return null;
    }

  function handleLogin() {
    console.log({ email, password });
    router.push('/');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.header}>
        <Text style={styles.headerBold}>Entre</Text> na sua conta
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <Text style={styles.resetText}>Redefinir senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
            styles.loginButton,
            !(email && password) && styles.loginButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={!(email && password)}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#C1272D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontFamily: 'Rubik_400Regular',
    marginTop: 20,
    color: '#333',
    marginBottom: 140,
  },
  headerBold: {
    fontWeight: 'bold',
    color: '#C1272D',
  },
  input: {
    height: 50,
    backgroundColor: '#F9F9F9',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginTop: 30,
  },
  resetText: {
    color: '#C1272D',
    marginTop: 10,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 30,
    backgroundColor: '#871015',
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    backgroundColor: '#C1272D',
  },  
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useFonts, Rubik_400Regular, Rubik_300Light } from '@expo-google-fonts/rubik';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_300Light,
  });
  if (!fontsLoaded) {
    return null;
  }

  function handleRegister() {
    console.log({ email, password });
    router.push('/');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.header}>
        <Text style={styles.headerBold}>Registre</Text> a sua conta!
      </Text>
      <Text style={styles.subtext}>
        Dê o primeiro passo para uma melhor gestão dos seus imóveis!
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

      <TouchableOpacity
        style={[
            styles.registerButton,
            !(email && password) && styles.registerButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={!(email && password)}
      >
        <Text style={styles.registerButtonText}>Registrar</Text>
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
  },
  headerBold: {
    fontWeight: 'bold',
    color: '#C1272D',
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'Rubik_300Light',
    color: '#333',
    marginTop: 5,
    marginBottom: 100,
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
  registerButton: {
    marginTop: 30,
    backgroundColor: '#871015',
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonDisabled: {
    backgroundColor: '#C1272D',
  },  
});

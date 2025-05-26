import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { useFonts, Rubik_900Black } from '@expo-google-fonts/rubik';

export default function Index() {
  const { user, loading } = useAuth();
  
  let [fontsLoaded] = useFonts({
    Rubik_900Black,
  });
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#C1272D" />
      </View>
    );
  }

  if (!fontsLoaded) {
      return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <Image source={require('../../assets/images/logo.svg')} style={styles.logo} />
      <Text style={styles.title}>rubik</Text>

      <View style={styles.spacer} />
      <Link href="/auth/login" style={styles.button} asChild>
        <TouchableOpacity>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/auth/register" style={styles.button} asChild>
        <TouchableOpacity>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F6DED8',
    paddingBottom: 30,
  },
  logo: {
    width: 170,
    height: 200,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#C1272D',
    marginBottom: 40,
    textTransform: 'lowercase',
    fontFamily: 'Rubik_900Black',
  },
  button: {
    width: '85%',
    marginTop: 15,
  },
  buttonText: {
    backgroundColor: '#C1272D',
    color: '#FFF',
    paddingVertical: 18,
    textAlign: 'center',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
});

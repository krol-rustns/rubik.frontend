import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { useFonts, Rubik_900Black } from '@expo-google-fonts/rubik';

export default function Home() {
  let [fontsLoaded] = useFonts({
    Rubik_900Black,
  });
  if (!fontsLoaded) {
      return null;
  }
  return (
    <View style={styles.container}>
      <Image source={require('/home/loli/Documents/working/rubikapp/assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>rubik</Text>
      <Link href="./login" style={styles.button} asChild>
        <TouchableOpacity>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Link>
      <Link href="./register" style={styles.button} asChild>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 60,
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
});

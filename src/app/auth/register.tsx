import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useFonts, Rubik_400Regular, Rubik_300Light } from '@expo-google-fonts/rubik';
import { ArrowLeft } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Senhas não conferem')
    .required('Confirmação de senha é obrigatória')
});

export default function Register() {
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_300Light,
  });
  
  if (!fontsLoaded) {
    return null;
  }
  
  const handleRegister = (values: any) => {
    // Chamada de API aqui
    console.log(values);
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft color="#FFFFFF" size={20} />
      </TouchableOpacity>
      
      <Text style={styles.header}>
        <Text style={styles.headerHighlight}>Registre</Text> a sua conta!
      </Text>
      <Text style={styles.subheader}>
        Dê o primeiro passo para uma melhor gestão dos seus imóveis!
      </Text>
      
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, isSubmitting }) => (
          <View style={styles.formContainer}>
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && errors.name ? errors.name : undefined}
            />
            
            <Input
              label="Email"
              placeholder="seu@email.com"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && errors.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Senha"
              placeholder="Sua senha"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && errors.password ? errors.password : undefined}
              secureTextEntry
            />
            
            <Input
              label="Confirme sua senha"
              placeholder="Digite novamente sua senha"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
              secureTextEntry
            />
            
            <Button
              title="Registrar"
              onPress={() => handleSubmit()}
              disabled={!isValid}
              loading={isSubmitting}
              style={styles.registerButton}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Entre</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )}
      </Formik>
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
    marginTop: 20,
  },
  header: {
    fontSize: 32,
    fontFamily: 'Rubik_400Regular',
    marginTop: 40,
    color: '#333',
  },
  headerHighlight: {
    fontFamily: 'Rubik_700Bold',
    color: '#C1272D',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  registerButton: {
    marginTop: 30,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#C1272D',
    fontSize: 16,
    fontWeight: '500',
  },
});
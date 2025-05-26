import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/rubik';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória')
});

export default function Login() {
  const { signIn } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
      Rubik_400Regular,
  });
  
  if (!fontsLoaded) {
      return null;
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoginError(null);
      await signIn(values.email, values.password);
    } catch (error) {
      setLoginError('Email ou senha inválidos');
    }
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
        <Text style={styles.headerHighlight}>Entre</Text> na sua conta
      </Text>
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, isSubmitting }) => (
          <View style={styles.formContainer}>
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
            
            <TouchableOpacity>
              <Text style={styles.resetText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
            
            {loginError && (
              <Text style={styles.errorText}>{loginError}</Text>
            )}
            
            <Button
              title="Entrar"
              onPress={() => handleSubmit()}
              disabled={!isValid}
              loading={isSubmitting}
              style={styles.loginButton}
            />
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Registre-se</Text>
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
    marginTop: 60,
    color: '#333',
    marginBottom: 60,
  },
  headerHighlight: {
    fontFamily: 'Rubik_700Bold',
    color: '#C1272D',
  },
  formContainer: {
    width: '100%',
  },
  resetText: {
    color: '#C1272D',
    marginTop: 10,
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  loginButton: {
    marginTop: 40,
  },
  errorText: {
    color: '#C1272D',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    color: '#666',
    fontSize: 16,
  },
  registerLink: {
    color: '#C1272D',
    fontSize: 16,
    fontWeight: '500',
  },
});
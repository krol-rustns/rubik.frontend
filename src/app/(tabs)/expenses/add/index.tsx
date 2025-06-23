import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import { storage } from '@/utils/storage';
import { router } from 'expo-router';

const expenseSchema = Yup.object().shape({
  cep: Yup.string().required('CEP é obrigatório'),
  tipo: Yup.string().required('Tipo é obrigatório'),
  parcelas: Yup.number().min(0, 'Deve ser maior ou igual a 1'),
  vencimento: Yup.string().required('Data de vencimento é obrigatória'),
  status: Yup.string().required('Status é obrigatório'),
  valor: Yup.number().required('Valor é obrigatório').min(1, 'Deve ser maior ou igual a 1'),
});

const formatToISO = (date: Date) => {
  return date.toISOString();
};

const formatISOTOBrazilian = (isoString: string) => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '';
    }
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (e) {
    return isoString;
  }
};

export default function AddExpense() {
  const [propertyError, setPropertyError] = useState<string | null>(null);

  const handleAddExpense = async (values: any) => {
    try {
      setPropertyError(null);

      const { cep, ...valuesWithoutCep } = values;
      await storage.addExpense(valuesWithoutCep, cep);

      router.back();
    } catch (error) {
      setPropertyError('Erro ao adicionar despesa');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>
          <Text style={styles.headerHighlight}>Preencha</Text> os campos abaixo
        </Text>

        <Formik
          initialValues={{
            cep: '',
            tipo: 'Energia',
            parcelas: 0,
            vencimento: formatToISO(new Date()),
            status: 'PENDENTE',
            valor: 1,
          }}
          validationSchema={expenseSchema}
          onSubmit={handleAddExpense}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, isSubmitting }) => (
            <View style={styles.formContainer}>
              <Input
                label="CEP"
                placeholder="Ex: 12345-678"
                value={values.cep}
                onChangeText={handleChange('cep')}
                onBlur={handleBlur('cep')}
                error={touched.cep && errors.cep ? errors.cep : undefined}
              />

              <Input
                label="Quantidade de parcelas (opcional)"
                placeholder="Ex: 10"
                value={String(values.parcelas)}
                onChangeText={handleChange('parcelas')}
                onBlur={handleBlur('parcelas')}
                keyboardType="numeric"
                error={touched.parcelas && errors.parcelas ? errors.parcelas : undefined}
              />

              <Input
                label="Valor"
                placeholder="Ex: 150"
                value={String(values.valor)}
                onChangeText={handleChange('valor')}
                onBlur={handleBlur('valor')}
                keyboardType="numeric"
                error={touched.valor && errors.valor ? errors.valor : undefined}
              />

              <Input
                label="Data de vencimento"
                placeholder="Ex: 2025-06-22 15:40:03"
                value={formatISOTOBrazilian(values.vencimento)}
                onChangeText={(text) => {
                    const parts = text.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
                    if (parts) {
                        const [, day, month, year, hours, minutes, seconds] = parts;
                        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
                        handleChange('vencimento')(date.toISOString());
                    } else {
                        handleChange('vencimento')(text);
                    }
                }}
                onBlur={handleBlur('vencimento')}
                error={touched.vencimento && errors.vencimento ? errors.vencimento : undefined}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Tipo</Text>
                <Picker
                  selectedValue={values.tipo}
                  onValueChange={handleChange('tipo')}
                  style={styles.picker}
                >
                  <Picker.Item label="Energia" value="Energia" />
                  <Picker.Item label="Água" value="Água" />
                  <Picker.Item label="Manutenção" value="Manutenção" />
                  <Picker.Item label="Seguro" value="Seguro" />
                  <Picker.Item label="Outro" value="Outro" />
                </Picker>
                {touched.tipo && errors.tipo && (
                  <Text style={styles.errorText}>{errors.tipo}</Text>
                )}
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Status</Text>
                <Picker
                  selectedValue={values.status}
                  onValueChange={handleChange('status')}
                  style={styles.picker}
                >
                  <Picker.Item label="PENDENTE" value="PENDENTE" />
                  <Picker.Item label="PAGO" value="PAGO" />
                </Picker>
                {touched.status && errors.status && (
                  <Text style={styles.errorText}>{errors.status}</Text>
                )}
              </View>

              {propertyError && <Text style={styles.errorText}>{propertyError}</Text>}

              <Button
                title="Adicionar Despesa"
                onPress={() => handleSubmit()}
                disabled={!isValid}
                loading={isSubmitting}
                style={styles.addButton}
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
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
    fontSize: 35,
    fontFamily: 'Rubik_400Regular',
    marginTop: 30,
    color: '#333',
    marginBottom: 40,
  },
  headerHighlight: {
    fontFamily: 'Rubik_700Bold',
    color: '#C1272D',
  },
  formContainer: {
    width: '100%',
  },
  pickerContainer: {
    marginTop: 5,
    marginBottom: 25,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#C1272D',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 40,
  },
});
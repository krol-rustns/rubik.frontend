import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Link, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import { useAuth } from '../../../../../context/AuthContext';
import { storage } from '@/utils/storage';

const propertySchema = Yup.object().shape({
  endereco: Yup.string().required('Endereço é obrigatório'),
  cidade: Yup.string().required('Cidade é obrigatória'),
  estado: Yup.string().required('Estado é obrigatório'),
  cep: Yup.string().required('CEP é obrigatório'),
  tipo: Yup.string().required('Tipo é obrigatório'),
  qtdQuartos: Yup.number().required('Quantidade de quartos é obrigatória').min(1, 'Deve ser maior ou igual a 1'),
  qtdBanheiro: Yup.number().required('Quantidade de banheiros é obrigatória').min(1, 'Deve ser maior ou igual a 1'),
  qtdVagasGaragem: Yup.number().required('Quantidade de vagas de garagem é obrigatória').min(1, 'Deve ser maior ou igual a 1'),
  dataAquisicao: Yup.string().required('Data de aquisição é obrigatória'),
  registroCartorio: Yup.string().required('Registro no cartório é obrigatório'),
  inscricaoIptu: Yup.string().required('Inscrição do IPTU é obrigatória'),
  inscricaoCaesb: Yup.string().required('Inscrição da CAESB é obrigatória'),
  inscricaoNeoenergia: Yup.string().required('Inscrição da Neoenergia é obrigatória'),
  valorVenal: Yup.number().required('Valor venal é obrigatório').min(1, 'Deve ser maior ou igual a 1'),
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

export default function AddProperty() {
  const [propertyError, setPropertyError] = useState<string | null>(null);

  const handleAddProperty = async (values: any) => {
    try {
      setPropertyError(null);

      const responseUser = await storage.getUser();
      const userData = {
        userEmail: responseUser?.email
      };

      values.userEmail = userData.userEmail
      
      const addedProperty = await storage.addProperty(values);

      console.log('Property Added:', values);
    } catch (error) {
      setPropertyError('Erro ao adicionar propriedade');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>
          <Text style={styles.headerHighlight}>Preencha</Text> os dados
        </Text>

        <Formik
          initialValues={{
            endereco: '',
            cidade: '',
            estado: '',
            cep: '',
            tipo: 'Casa',
            qtdQuartos: 1,
            qtdBanheiro: 1,
            qtdVagasGaragem: 1,
            dataAquisicao: formatToISO(new Date()),
            registroCartorio: '',
            inscricaoIptu: '',
            inscricaoCaesb: '',
            inscricaoNeoenergia: '',
            valorVenal: 1,
          }}
          validationSchema={propertySchema}
          onSubmit={handleAddProperty}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, isSubmitting }) => (
            <View style={styles.formContainer}>
              <Input
                label="Endereço"
                placeholder="Ex: Rua X, 123"
                value={values.endereco}
                onChangeText={handleChange('endereco')}
                onBlur={handleBlur('endereco')}
                error={touched.endereco && errors.endereco ? errors.endereco : undefined}
              />

              <Input
                label="Cidade"
                placeholder="Ex: São Paulo"
                value={values.cidade}
                onChangeText={handleChange('cidade')}
                onBlur={handleBlur('cidade')}
                error={touched.cidade && errors.cidade ? errors.cidade : undefined}
              />

              <Input
                label="Estado"
                placeholder="Ex: SP"
                value={values.estado}
                onChangeText={handleChange('estado')}
                onBlur={handleBlur('estado')}
                error={touched.estado && errors.estado ? errors.estado : undefined}
              />

              <Input
                label="CEP"
                placeholder="Ex: 12345-678"
                value={values.cep}
                onChangeText={handleChange('cep')}
                onBlur={handleBlur('cep')}
                error={touched.cep && errors.cep ? errors.cep : undefined}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Tipo</Text>
                <Picker
                  selectedValue={values.tipo}
                  onValueChange={handleChange('tipo')}
                  style={styles.picker}
                >
                  <Picker.Item label="Apartamento" value="Apartamento" />
                  <Picker.Item label="Casa" value="Casa" />
                  <Picker.Item label="Comercial" value="Comercial" />
                  <Picker.Item label="Galpão" value="Galpão" />
                  <Picker.Item label="Lote" value="Lote" />
                  <Picker.Item label="Chácara" value="Chácara" />
                  <Picker.Item label="Outro" value="Outro" />
                </Picker>
                {touched.tipo && errors.tipo && (
                  <Text style={styles.errorText}>{errors.tipo}</Text>
                )}
              </View>

              <Input
                label="Quantidade de quartos"
                placeholder="Ex: 3"
                value={String(values.qtdQuartos)}
                onChangeText={handleChange('qtdQuartos')}
                onBlur={handleBlur('qtdQuartos')}
                keyboardType="numeric"
                error={touched.qtdQuartos && errors.qtdQuartos ? errors.qtdQuartos : undefined}
              />

              <Input
                label="Quantidade de banheiros"
                placeholder="Ex: 2"
                value={String(values.qtdBanheiro)}
                onChangeText={handleChange('qtdBanheiro')}
                onBlur={handleBlur('qtdBanheiro')}
                keyboardType="numeric"
                error={touched.qtdBanheiro && errors.qtdBanheiro ? errors.qtdBanheiro : undefined}
              />

              <Input
                label="Quantidade de vagas de garagem"
                placeholder="Ex: 1"
                value={String(values.qtdVagasGaragem)}
                onChangeText={handleChange('qtdVagasGaragem')}
                onBlur={handleBlur('qtdVagasGaragem')}
                keyboardType="numeric"
                error={touched.qtdVagasGaragem && errors.qtdVagasGaragem ? errors.qtdVagasGaragem : undefined}
              />

              <Input
                label="Data de aquisição"
                placeholder="Ex: 2025-06-22 15:40:03"
                value={formatISOTOBrazilian(values.dataAquisicao)}
                onChangeText={(text) => {
                    const parts = text.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
                    if (parts) {
                        const [, day, month, year, hours, minutes, seconds] = parts;
                        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
                        handleChange('dataAquisicao')(date.toISOString());
                    } else {
                        handleChange('dataAquisicao')(text);
                    }
                }}
                onBlur={handleBlur('dataAquisicao')}
                error={touched.dataAquisicao && errors.dataAquisicao ? errors.dataAquisicao : undefined}
              />

              <Input
                label="Registro no cartório"
                placeholder="Ex: 123456789"
                value={values.registroCartorio}
                onChangeText={handleChange('registroCartorio')}
                onBlur={handleBlur('registroCartorio')}
                error={touched.registroCartorio && errors.registroCartorio ? errors.registroCartorio : undefined}
              />

              <Input
                label="Inscrição do IPTU"
                placeholder="Ex: 987654321"
                value={values.inscricaoIptu}
                onChangeText={handleChange('inscricaoIptu')}
                onBlur={handleBlur('inscricaoIptu')}
                error={touched.inscricaoIptu && errors.inscricaoIptu ? errors.inscricaoIptu : undefined}
              />

              <Input
                label="Inscrição da CAESB"
                placeholder="Ex: 123456789"
                value={values.inscricaoCaesb}
                onChangeText={handleChange('inscricaoCaesb')}
                onBlur={handleBlur('inscricaoCaesb')}
                error={touched.inscricaoCaesb && errors.inscricaoCaesb ? errors.inscricaoCaesb : undefined}
              />

              <Input
                label="Inscrição da Neoenergia"
                placeholder="Ex: 987654321"
                value={values.inscricaoNeoenergia}
                onChangeText={handleChange('inscricaoNeoenergia')}
                onBlur={handleBlur('inscricaoNeoenergia')}
                error={touched.inscricaoNeoenergia && errors.inscricaoNeoenergia ? errors.inscricaoNeoenergia : undefined}
              />

              <Input
                label="Valor venal"
                placeholder="Ex: 500000"
                value={String(values.valorVenal)}
                onChangeText={handleChange('valorVenal')}
                onBlur={handleBlur('valorVenal')}
                keyboardType="numeric"
                error={touched.valorVenal && errors.valorVenal ? errors.valorVenal : undefined}
              />

              {propertyError && <Text style={styles.errorText}>{propertyError}</Text>}

              <Button
                title="Adicionar Propriedade"
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
    fontSize: 30,
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
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { 
  MapPin, 
  Calendar, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Zap, 
  Waves,
  FileText,
  Plus,
  Edit3,
  Building2
} from 'lucide-react-native';
import { Property, Document } from '../../../../types';
import { storage } from '../../../../utils/storage';
import Button from '../../../../components/ui/Button';
import Card from '../../../../components/ui/Card';
import DocumentCard from '../../../../components/documents/DocumentCard';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => router.push(`../properties/edit/${id}`)}
        >
          <Edit3 size={20} color="#C1272D" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, id]);

  const loadProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      const data = await storage.getPropertyByCep(propertyId);
      if (data) {
        setProperty(data);
      } else {
        Alert.alert('Erro', 'Imóvel não encontrado');
        router.back();
      }
    } catch (error) {
      console.error('Error loading property:', error);
      Alert.alert('Erro', 'Falha ao carregar dados do imóvel');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleAddDocument = () => {
    // Doc picker
    Alert.alert('Funcionalidade', 'Adicionar documento');
  };

  const handleViewDocument = (document: Document) => {
    // Chamada para view o doc
    Alert.alert('Visualizar Documento', document.name);
  };

  const handleDeleteDocument = (document: Document) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o documento "${document.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Chama function que lida com a deleção do doc
            Alert.alert('Documento excluído com sucesso');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C1272D" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Imóvel não encontrado</Text>
        <Button 
          title="Voltar" 
          onPress={() => router.back()} 
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Home size={20} color="#FFFFFF" />
          <Text style={styles.typeText}>{property.tipo}</Text>
        </View>
        <Text style={styles.address}>{property.endereco}</Text>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#FFFFFF" />
          <Text style={styles.locationText}>
            {property.cidade}, {property.estado}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Bed size={20} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>{property.qtdQuartos}</Text>
                <Text style={styles.infoLabel}>Quartos</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Bath size={20} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>{property.qtdBanheiro}</Text>
                <Text style={styles.infoLabel}>Banheiros</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Car size={20} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>{property.qtdVagasGaragem}</Text>
                <Text style={styles.infoLabel}>Vagas</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoItemWide}>
              <Calendar size={20} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>{formatDate(property.dataAquisicao)}</Text>
                <Text style={styles.infoLabel}>Data de Aquisição</Text>
              </View>
            </View>
            
            <View style={styles.infoTextContainer}>
              <Text style={styles.priceValue}>{formatCurrency(property.valorVenal)}</Text>
              <Text style={styles.infoLabel}>Valor Investido</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.utilitiesCard}>
          <Text style={styles.sectionTitle}>Serviços Públicos</Text>
          
          <View style={styles.utilityItem}>
            <Zap size={20} color="#666" />
            <View style={styles.utilityContent}>
              <Text style={styles.utilityProvider}>Neoenergia</Text>
              <Text style={styles.utilityLabel}>Energia</Text>
            </View>
            <View style={styles.registrationContainer}>
              <Text style={styles.registrationLabel}>Registro:</Text>
              <Text style={styles.registrationValue}>{property.inscricaoNeoenergia}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.utilityItem}>
            <Waves size={20} color="#666" />
            <View style={styles.utilityContent}>
              <Text style={styles.utilityProvider}>CAESB</Text>
              <Text style={styles.utilityLabel}>Água</Text>
            </View>
            <View style={styles.registrationContainer}>
              <Text style={styles.registrationLabel}>Registro:</Text>
              <Text style={styles.registrationValue}>{property.inscricaoCaesb}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.utilityItem}>
            <Building2 size={20} color="#666" />
            <View style={styles.utilityContent}>
              <Text style={styles.utilityProvider}>Registro Cartório</Text>
              <Text style={styles.utilityLabel}>Inscrição</Text>
            </View>
            <View style={styles.registrationContainer}>
              <Text style={styles.registrationLabel}>Registro:</Text>
              <Text style={styles.registrationValue}>{property.registroCartorio}</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.documentsCard}>
          <View style={styles.documentsHeader}>
            <View style={styles.documentsHeaderLeft}>
              <FileText size={20} color="#666" style={{ marginBottom: 16, marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Documentos</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.addDocumentButton}
              onPress={handleAddDocument}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addDocumentText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyDocuments}>
            <Text style={styles.emptyText}>Nenhum documento cadastrado</Text>
          </View>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Ver Despesas"
            onPress={() => router.push(`../expenses`)}
            style={styles.button}
          />
          {/*<Button
            title="Adicionar Despesa"
            variant="outline"
            onPress={() => Alert.alert('Funcionalidade', 'Adicionar despesa')}
            style={styles.button}
          />*/}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  errorButton: {
    minWidth: 200,
  },
  header: {
    backgroundColor: '#C1272D',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  address: {
    fontSize: 24,
    fontFamily: 'Rubik_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Rubik_500Medium',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItemWide: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  infoTextContainer: {
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceValue: {
    fontSize: 18,
    fontFamily: 'Rubik_700Bold',
    color: '#C1272D',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 16,
  },
  utilitiesCard: {
    marginBottom: 16,
  },
  utilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  utilityContent: {
    marginLeft: 12,
    flex: 1,
  },
  utilityProvider: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  utilityLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  registrationContainer: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
  },
  registrationLabel: {
    fontSize: 10,
    color: '#999',
  },
  registrationValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  documentsCard: {
    marginBottom: 16,
  },
  documentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C1272D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addDocumentText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyDocuments: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    padding: 10,
  },
});
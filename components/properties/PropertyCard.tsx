import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Home, Waves, Zap, Eye, EyeClosed } from 'lucide-react-native';
import { Property } from '../../types';
import Card from '../ui/Card';

interface PropertyCardProps {
  property: Property;
  onPress: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  const [isPriceVisible, setPriceVisible] = useState(false);
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Card onPress={() => onPress(property)} style={styles.card}>
      <View style={styles.typeContainer}>
        <Home size={18} color="#C1272D" />
        <Text style={styles.typeText}>{property.tipo}</Text>
      </View>
      
      <Text style={styles.address} numberOfLines={1}>{property.endereco}</Text>
      
      <View style={styles.locationContainer}>
        <MapPin size={16} color="#666" />
        <Text style={styles.locationText}>
          {property.cidade}, {property.estado}
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Text style={styles.detailValue}>{property.qtdQuartos}</Text>
          <Text style={styles.detailLabel}>Quartos</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailValue}>{property.qtdBanheiro}</Text>
          <Text style={styles.detailLabel}>Banheiros</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailValue}>{property.qtdVagasGaragem}</Text>
          <Text style={styles.detailLabel}>Vagas</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.utilityContainer}>
        <View style={styles.utility}>
          <Zap size={16} color="#666" />
          <Text style={styles.utilityText} numberOfLines={1}>
            {property.inscricaoNeoenergia}
          </Text>
        </View>
        <View style={styles.utility}>
          <Waves size={16} color="#666" />
          <Text style={styles.utilityText} numberOfLines={1}>
            {property.inscricaoCaesb}
          </Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {isPriceVisible ? formatCurrency(property.valorVenal) : 'R$ *******'}
        </Text>
        <TouchableOpacity onPress={() => setPriceVisible(!isPriceVisible)} style={styles.eyeIcon}>
          {isPriceVisible ? (
            <Eye size={24} color="#871015" />
          ) : (
            <EyeClosed size={24} color="#871015" />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    color: '#C1272D',
    fontWeight: '500',
    marginLeft: 6,
  },
  address: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detail: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 16,
  },
  utilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  utility: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  utilityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#871015',
  },
});

export default PropertyCard;
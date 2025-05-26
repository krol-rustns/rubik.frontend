import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Search, FilterX, Filter } from 'lucide-react-native';
import { Property } from '../../../../types';
import { storage } from '../../../../utils/storage';
import PropertyCard from '../../../../components/properties/PropertyCard';
import Button from '../../../../components/ui/Button';

export default function PropertiesScreen() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    city: '',
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await storage.getProperties();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterProperties();
  }, [searchQuery, filters, properties]);

  const filterProperties = () => {
    let result = [...properties];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        property => 
          property.address.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.state.toLowerCase().includes(query)
      );
    }
    
    if (filters.type) {
      result = result.filter(property => property.type === filters.type);
    }
    
    if (filters.city) {
      result = result.filter(
        property => property.city.toLowerCase() === filters.city.toLowerCase()
      );
    }
    
    setFilteredProperties(result);
  };

  const resetFilters = () => {
    setFilters({ type: '', city: '' });
    setShowFilters(false);
  };

  const handlePropertyPress = (property: Property) => {
    router.push(`../properties/${property.id}`);
  };

  const getCities = () => {
    const cities = properties.map(property => property.city);
    return [...new Set(cities)].sort();
  };

  const getPropertyTypes = () => {
    const types = properties.map(property => property.type);
    return [...new Set(types)].sort();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C1272D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar imóveis..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#C1272D" />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filtros</Text>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Tipo:</Text>
            <View style={styles.filterOptions}>
              {getPropertyTypes().map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    filters.type === type && styles.filterOptionActive
                  ]}
                  onPress={() => setFilters({ ...filters, type: filters.type === type ? '' : type })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.type === type && styles.filterOptionTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Cidade:</Text>
            <View style={styles.filterOptions}>
              {getCities().map(city => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.filterOption,
                    filters.city === city && styles.filterOptionActive
                  ]}
                  onPress={() => setFilters({ ...filters, city: filters.city === city ? '' : city })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.city === city && styles.filterOptionTextActive
                  ]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.resetFiltersButton}
            onPress={resetFilters}
          >
            <FilterX size={16} color="#666" />
            <Text style={styles.resetFiltersText}>Limpar filtros</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {filteredProperties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {properties.length === 0 
              ? 'Você ainda não possui imóveis cadastrados.'
              : 'Nenhum imóvel encontrado com os filtros aplicados.'}
          </Text>
          {properties.length === 0 && (
            <Button
              title="Adicionar Imóvel"
              onPress={() => router.push('../properties/add')}
              style={styles.addButton}
            />
          )}
          {properties.length > 0 && (
            <Button
              title="Limpar Filtros"
              variant="outline"
              onPress={resetFilters}
              style={styles.addButton}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={handlePropertyPress}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('../properties/add')}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flex: 1,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Rubik_500Medium',
    color: '#333',
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#C1272D',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  resetFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 8,
  },
  resetFiltersText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    minWidth: 200,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#C1272D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Plus, Search, FilterX, Filter, CheckSquare, AlertTriangle, Clock } from 'lucide-react-native';
import { Expense, Property } from '../../../../types';
import { storage } from '../../../../utils/storage';
import ExpenseCard from '../../../../components/expenses/ExpenseCard';
import Button from '../../../../components/ui/Button';

export default function ExpensesScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  //const [properties, setProperties] = useState<Property[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
  });

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const expensesData = await storage.getExpenses();
      setExpenses(expensesData);
      setFilteredExpenses(expensesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filterExpenses = useCallback(() => {
    let result = [...expenses];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        expense => expense.tipo.toLowerCase().includes(query)
      );
    }

    if (filters.type) {
      result = result.filter(expense => expense.tipo === filters.type);
    }

    if (filters.status) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (filters.status) {
        case 'paid':
          result = result.filter(expense => expense.status === 'PAGO');
          break;
        case 'pending':
          result = result.filter(expense => {
            const dueDate = new Date(expense.vencimento);
            dueDate.setHours(0, 0, 0, 0);
            return expense.status !== 'PAGO' && dueDate >= today;
          });
          break;
        case 'overdue':
          result = result.filter(expense => {
            const dueDate = new Date(expense.vencimento);
            dueDate.setHours(0, 0, 0, 0);
            return expense.status !== 'PAGO' && dueDate < today;
          });
          break;
      }
    }

    setFilteredExpenses(result);
  }, [searchQuery, filters, expenses]);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const resetFilters = () => {
    setFilters({
      type: '',
      status: '',
    });
    setSearchQuery('');
    setShowFilters(false);
  };

  const getExpenseTypes = () => {
    const types = expenses.map(expense => expense.tipo);
    return [...new Set(types)].sort();
  };

  const handleExpensePress = () => {
    setIsExpenseModalVisible(true);
  };

  const confirmExpenseAction = () => {
    console.log('Action confirmed!');
    setIsExpenseModalVisible(false);
  };

  const cancelExpenseAction = () => {
    console.log('Action cancelled.');
    setIsExpenseModalVisible(false);
  };

  //const getPropertyName = (propertyId: string) => {
  //  const property = properties.find(p => p.id === propertyId);
  //  return property ? property.address.split(',')[0] : 'Desconhecido';
  //};

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
            placeholder="Buscar despesas por tipo..."
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
              {getExpenseTypes().map(type => (
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
          
          {/*{!propertyId && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Imóvel:</Text>
              <View style={styles.filterOptions}>
                {properties.map(property => (
                  <TouchableOpacity
                    key={property.id}
                    style={[
                      styles.filterOption,
                      filters.property === property.id && styles.filterOptionActive
                    ]}
                    onPress={() => setFilters({ 
                      ...filters, 
                      property: filters.property === property.id ? '' : property.id 
                    })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.property === property.id && styles.filterOptionTextActive
                    ]}>
                      {property.address.split(',')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )} */}
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOptionWithIcon,
                  filters.status === 'paid' && styles.filterOptionActive
                ]}
                onPress={() => setFilters({ 
                  ...filters, 
                  status: filters.status === 'paid' ? '' : 'paid' 
                })}
              >
                <CheckSquare size={14} color={filters.status === 'paid' ? '#FFFFFF' : '#4CAF50'} />
                <Text style={[
                  styles.filterOptionText,
                  filters.status === 'paid' && styles.filterOptionTextActive
                ]}>
                  Pagas
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterOptionWithIcon,
                  filters.status === 'pending' && styles.filterOptionActive
                ]}
                onPress={() => setFilters({ 
                  ...filters, 
                  status: filters.status === 'pending' ? '' : 'pending' 
                })}
              >
                <Clock size={14} color={filters.status === 'pending' ? '#FFFFFF' : '#FFC107'} />
                <Text style={[
                  styles.filterOptionText,
                  filters.status === 'pending' && styles.filterOptionTextActive
                ]}>
                  Pendentes
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterOptionWithIcon,
                  filters.status === 'overdue' && styles.filterOptionActive
                ]}
                onPress={() => setFilters({ 
                  ...filters, 
                  status: filters.status === 'overdue' ? '' : 'overdue' 
                })}
              >
                <AlertTriangle size={14} color={filters.status === 'overdue' ? '#FFFFFF' : '#F44336'} />
                <Text style={[
                  styles.filterOptionText,
                  filters.status === 'overdue' && styles.filterOptionTextActive
                ]}>
                  Atrasadas
                </Text>
              </TouchableOpacity>
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
      
      {filteredExpenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {expenses.length === 0 
              ? 'Não há despesas cadastradas.'
              : 'Nenhuma despesa encontrada com os filtros aplicados.'}
          </Text>
          {expenses.length > 0 && (
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
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              {/* {!propertyId && !filters.property && (
                <Text style={styles.propertyName}>
                  {getPropertyName(item.propertyId)}
                </Text>
              )} */}
              <ExpenseCard
                expense={item}
                onPress={handleExpensePress}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('../expenses/add')}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isExpenseModalVisible}
        onRequestClose={cancelExpenseAction}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Deseja prosseguir alterando o estado para PAGO?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={confirmExpenseAction}>
                <Text style={styles.modalButtonText}>Sim</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={cancelExpenseAction}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  filterOptionWithIcon: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: '#C1272D',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
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
  expenseItem: {
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    paddingLeft: 8,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Rubik_500Medium',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    backgroundColor: '#C1272D',
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Rubik_500Medium',
  },
});
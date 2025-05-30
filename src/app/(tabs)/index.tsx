import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { storage } from '../../../utils/storage';
import { Property, Expense } from '../../../types';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { router } from 'expo-router';
import { Building2, Receipt, AlertCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const propertiesData = await storage.getProperties();
        const expensesData = await storage.getExpenses();
        
        setProperties(propertiesData);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPendingExpenses = () => {
    return expenses.filter(expense => !expense.isPaid);
  };

  const getOverdueExpenses = () => {
    const today = new Date();
    return expenses.filter(expense => {
      const dueDate = new Date(expense.dueDate);
      return !expense.isPaid && dueDate < today;
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getTotalPropertyValue = () => {
    return 0;
  };

  const getPendingExpensesValue = () => {
    return getPendingExpenses().reduce((total, expense) => total + expense.value, 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bem-vindo de volta ao Rubik!</Text>
        <Text style={styles.welcomeMessage}>Olá, {user?.name || 'Usuário'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {properties.length}
          </Text>
          <Text style={styles.statLabel}>Imóveis</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {getTotalPropertyValue()}
          </Text>
          <Text style={styles.statLabel}>Imóveis alugados</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {getPendingExpenses().length}
          </Text>
          <Text style={styles.statLabel}>Despesas Pendentes</Text>
        </Card>
      </View>

      {getOverdueExpenses().length > 0 && (
        <Card style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <AlertCircle size={20} color="#F44336" />
            <Text style={styles.alertTitle}>Atenção!</Text>
          </View>
          <Text style={styles.alertMessage}>
            Você tem {getOverdueExpenses().length} despesas vencidas no valor total de {formatCurrency(getOverdueExpenses().reduce((total, expense) => total + expense.value, 0))}
          </Text>
          <Button
            title="Ver Despesas"
            variant="outline"
            style={styles.alertButton}
            onPress={() => router.push('../expenses')}
          />
        </Card>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Building2 size={20} color="#C1272D" />
          <Text style={styles.sectionTitle}>Meus Imóveis</Text>
        </View>
        
        {properties.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Você ainda não possui imóveis cadastrados</Text>
            <Button
              title="Adicionar Imóvel"
              variant="secondary"
              style={styles.emptyButton}
              onPress={() => router.push('../properties/add')}
            />
          </Card>
        ) : (
          <View style={styles.actionButtonsContainer}>
            <Button
              title="Ver Todos"
              style={styles.actionButton}
              onPress={() => router.push('../properties')}
            />
            <Button
              title="Adicionar Novo"
              variant="outline"
              style={styles.actionButton}
              onPress={() => router.push('../properties/add')}
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Receipt size={20} color="#C1272D" />
          <Text style={styles.sectionTitle}>Despesas</Text>
        </View>
        
        <View style={styles.expenseSummaryContainer}>
          <Card style={styles.expenseSummaryCard}>
            <Text style={styles.expenseSummaryLabel}>Pendentes</Text>
            <Text style={styles.expenseSummaryValue}>
              {formatCurrency(getPendingExpensesValue())}
            </Text>
          </Card>
          
          <Card style={styles.expenseSummaryCard}>
            <Text style={styles.expenseSummaryLabel}>Próximo Vencimento</Text>
            {getPendingExpenses().length > 0 ? (
              <Text style={styles.expenseSummaryDate}>
                {new Date(
                  Math.min(
                    ...getPendingExpenses().map(e => new Date(e.dueDate).getTime())
                  )
                ).toLocaleDateString('pt-BR')}
              </Text>
            ) : (
              <Text style={styles.expenseSummaryNoData}>Nenhuma</Text>
            )}
          </Card>
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
  header: {
    backgroundColor: '#C1272D',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Rubik_400Regular',
  },
  welcomeMessage: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Rubik_700Bold',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: -20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Rubik_700Bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  alertCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Rubik_500Medium',
    color: '#F44336',
    marginLeft: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  alertButton: {
    marginTop: 8,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Rubik_500Medium',
    color: '#333',
    marginLeft: 8,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  expenseSummaryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  expenseSummaryCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  expenseSummaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  expenseSummaryValue: {
    fontSize: 18,
    fontFamily: 'Rubik_700Bold',
    color: '#333',
  },
  expenseSummaryDate: {
    fontSize: 16,
    fontFamily: 'Rubik_500Medium',
    color: '#333',
  },
  expenseSummaryNoData: {
    fontSize: 16,
    color: '#999',
  },
  manageButton: {
    width: '100%',
  },
});
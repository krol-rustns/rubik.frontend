import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { storage } from '../../../utils/storage';
import { Property, Expense, UserData, User } from '../../../types';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { router } from 'expo-router';
import { Building2, Receipt, AlertCircle, SquareCheckBig } from 'lucide-react-native';

export default function HomeScreen() {
  const [properties, setProperties] = React.useState<User | null>(null);
  const [userInformations, setUserInformations] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await storage.getUserData();
        const userPropertiesData = await storage.getUser();
        
        setUserInformations(userData);
        setProperties(userPropertiesData)
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  console.log()

  const isOverdue = (): boolean => {
    if (!userInformations?.proximoVencimento) return false;

    const today = new Date();
    const dueDate = new Date(userInformations.proximoVencimento);

    return dueDate < today;
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
        <Text style={styles.welcomeMessage}>Olá, {userInformations?.nome || 'Usuário'}</Text>
        <Text style={styles.greeting}>Bem-vindo(a) de volta ao Rubik!</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {userInformations?.qtdImoveis}
          </Text>
          <Text style={styles.statLabel}>Seus Imóveis</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            0 {/* Placeholder para "Imóveis alugados" */}
          </Text>
          <Text style={styles.statLabel}>Imóveis alugados</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {userInformations?.qtdDespesasPendentes || 0}
          </Text>
          <Text style={styles.statLabel}>Despesas Pendentes</Text>
        </Card>
      </View>

      <Card 
        style={[styles.alertCard, { borderColor: isOverdue() ? '#F44336' : '#665' }]}>
        <View style={styles.alertHeader}>
          {isOverdue() ? (
            <AlertCircle size={20} color="#F44336" />
          ) : (
            <SquareCheckBig size={20} color="#665" />
          )}
          
          <Text style={[styles.alertTitle, { color: isOverdue() ? '#F44336' : '#665' }]}>
            {isOverdue() ? "Atenção!" : "Tudo certo!"}
          </Text>
        </View>

        <Text style={[styles.alertMessage, { color: isOverdue() ? '#F44336' : '#665' }]}>
          {isOverdue() 
            ? "Você possui despesas vencidas, clique no botão abaixo para acompanhar os pagamentos."
            : "Você não tem despesas vencidas! Continue acompanhando seus pagamentos."}
        </Text>

        {isOverdue() && (
          <Button
            title="Ver Despesas"
            variant="outline"
            style={styles.alertButton}
            onPress={() => router.push('../expenses')}
          />
        )}
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Building2 size={20} color="#C1272D" />
          <Text style={styles.sectionTitle}>Meus Imóveis</Text>
        </View>
        
        {userInformations?.qtdImoveis === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Você ainda não possui imóveis cadastrados</Text>
            <Button
              title="Adicione aqui"
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
              {formatCurrency(userInformations?.valorDespesas || 0)}
            </Text>
          </Card>
          
          <Card style={styles.expenseSummaryCard}>
            <Text style={styles.expenseSummaryLabel}>Próximo Vencimento</Text>
            {userInformations?.proximoVencimento ? (
              <Text style={styles.expenseSummaryDate}>
                {userInformations?.proximoVencimento}
              </Text>
            ) : (
              <Text style={[styles.expenseSummaryNoData, { fontStyle: 'italic' }]}>Nenhuma</Text>
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
    paddingTop: 50,
    paddingBottom: 40,
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
    marginBottom: 4,
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
    marginTop: 8,
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
    marginTop: 10,
    marginHorizontal: 16,
    marginBottom: 10,
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
    marginTop: 10,
    marginBottom: 10,
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
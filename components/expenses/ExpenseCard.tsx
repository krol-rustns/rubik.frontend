import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarClock, Check, X } from 'lucide-react-native';
import { Expense } from '../../types';
import Card from '../ui/Card';

interface ExpenseCardProps {
  expense: Expense;
  onPress: (expense: Expense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data Inválida';
      }
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error('Error parsing date:', dateString, e);
      return 'Erro na Data';
    }
  };

  const getPaymentStatus = () => {
    if (expense.status === 'PAGO') {
      return 'paid';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(expense.vencimento);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return 'overdue';
    } else {
      return 'pending';
    }
  };

  const currentStatus = getPaymentStatus();

  const getTypeColor = () => {
    switch (expense.tipo) {
      case 'Energia':
        return '#FFC107';
      case 'Água':
        return '#2196F3';
      case 'Manutenção':
        return '#9C27B0';
      case 'Seguro':
        return '#3F51B5';
      case 'Outro':
        return '#3F51B5';
      default:
        return '#607D8B';
    }
  };

  return (
    <Card onPress={() => onPress(expense)} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor() }]} />
        <Text style={styles.type}>{expense.tipo}</Text>
        {expense.parcelas > 0 && (
          <View style={styles.installmentContainer}>
            <Text style={styles.installmentText}>
              {/* Depois implementar pagamento de parcelas, individualmente */}
              0/{expense.parcelas}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>Tipo de Despesa: {expense.tipo}</Text>

      <View style={styles.detailsRow}>
        <View style={styles.dateContainer}>
          <CalendarClock size={16} color="#666" />
          <Text style={[
            styles.dateText,
            currentStatus === 'overdue' && styles.pastDueText
          ]}>
            {formatDate(expense.vencimento)}
          </Text>
        </View>

        <View style={[
          styles.statusContainer,
          currentStatus === 'paid' ? styles.paidContainer :
          currentStatus === 'overdue' ? styles.pastDueContainer : styles.pendingContainer
        ]}>
          {currentStatus === 'paid' ? (
            <Check size={14} color="#4CAF50" />
          ) : currentStatus === 'overdue' ? (
            <X size={14} color="#F44336" />
          ) : (
            <CalendarClock size={14} color="#FFC107" />
          )}
          <Text style={[
            styles.statusText,
            currentStatus === 'paid' ? styles.paidText :
            currentStatus === 'overdue' ? styles.pastDueText : styles.pendingText
          ]}>
            {currentStatus === 'paid' ? 'Pago' : currentStatus === 'overdue' ? 'Atrasado' : 'Pendente'}
          </Text>
        </View>
      </View>

      <Text style={styles.value}>{formatCurrency(expense.valor)}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  type: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  installmentContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  installmentText: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paidContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  pendingContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  pastDueContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  paidText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FFC107',
  },
  pastDueText: {
    color: '#F44336',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
});

export default ExpenseCard;
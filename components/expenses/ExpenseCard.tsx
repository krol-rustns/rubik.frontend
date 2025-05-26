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
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isPastDue = () => {
    const today = new Date();
    const dueDate = new Date(expense.dueDate);
    return !expense.isPaid && today > dueDate;
  };

  const getTypeColor = () => {
    switch (expense.type) {
      case 'Energy':
        return '#FFC107';
      case 'Water':
        return '#2196F3';
      case 'Tax':
        return '#4CAF50';
      case 'Maintenance':
        return '#9C27B0';
      case 'Insurance':
        return '#3F51B5';
      default:
        return '#607D8B';
    }
  };

  return (
    <Card onPress={() => onPress(expense)} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor() }]} />
        <Text style={styles.type}>{expense.type}</Text>
        {expense.installments && (
          <View style={styles.installmentContainer}>
            <Text style={styles.installmentText}>
              {expense.installments.current}/{expense.installments.total}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.description}>{expense.description}</Text>
      
      <View style={styles.detailsRow}>
        <View style={styles.dateContainer}>
          <CalendarClock size={16} color="#666" />
          <Text style={[
            styles.dateText, 
            isPastDue() && styles.pastDueText
          ]}>
            {formatDate(expense.dueDate)}
          </Text>
        </View>
        
        <View style={[
          styles.statusContainer, 
          expense.isPaid ? styles.paidContainer : 
          isPastDue() ? styles.pastDueContainer : styles.pendingContainer
        ]}>
          {expense.isPaid ? (
            <Check size={14} color="#4CAF50" />
          ) : isPastDue() ? (
            <X size={14} color="#F44336" />
          ) : (
            <CalendarClock size={14} color="#FFC107" />
          )}
          <Text style={[
            styles.statusText,
            expense.isPaid ? styles.paidText : 
            isPastDue() ? styles.pastDueText : styles.pendingText
          ]}>
            {expense.isPaid ? 'Pago' : isPastDue() ? 'Atrasado' : 'Pendente'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.value}>{formatCurrency(expense.value)}</Text>
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
import { Stack } from 'expo-router';

export default function AddExpensesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#C1272D',
        headerTitleStyle: {
          fontFamily: 'Rubik_500Medium',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Adicionar Despesa',
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}
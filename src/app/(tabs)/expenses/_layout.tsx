import { Stack } from 'expo-router';

export default function ExpensesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
          title: 'Despesas',
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}
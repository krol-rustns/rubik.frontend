import { Stack } from 'expo-router';

export default function AddPropertiesLayout() {
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
          title: 'Adicionar imóvel',
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}
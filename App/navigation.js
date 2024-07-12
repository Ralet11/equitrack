import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import LogoScreen from './screens/LogoScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/signUpScreen';
import SignUpScreen2 from './screens/SingUpScreen2';
import HorsesScreen from './screens/HorsesScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import styles from './styles/NavigationStyles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const scheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Pet') {
            iconName = focused ? 'horse-variant' : 'horse-variant';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account';
          }else if (route.name === 'Historial') {
            iconName = focused ? 'folder-multiple' : 'folder-multiple';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: scheme === 'dark' ? styles.tabBarDark : styles.tabBar,
        tabBarLabelStyle: scheme === 'dark' ? styles.tabBarLabelDark : styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Pet"
        component={HorsesScreen}
        options={{ tabBarLabel: 'Palenque' }}
      />
      <Tab.Screen
        name="Historial"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Historial' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Coach' }}
      />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  const token = useSelector((state) => state.user.token);
  const initialRoute = token ? 'Main' : 'Login';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Logo" component={LogoScreen} />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignUp2" component={SignUpScreen2} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;

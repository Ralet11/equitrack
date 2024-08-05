import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import LogoScreen from './screens/LogoScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/signUpScreen';
import HorsesScreen from './screens/HorsesScreen';
import ActivityScreen from './screens/ActivityScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import HorseDetail from './screens/HorseDetail';
import styles from './styles/NavigationStyles';
import colors from './theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {

  const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);
  const currentColors = isDarkTheme ? colors.dark : colors.light;

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
          } else if (route.name === 'Historial') {
            iconName = focused ? 'folder-multiple' : 'folder-multiple';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentColors.txtPrimary,
        tabBarInactiveTintColor: currentColors.disabled,
        tabBarActiveBackgroundColor: currentColors.primary,
        tabBarItemStyle: { margin: 20, borderRadius: 10 },
        tabBarStyle: [styles.tabBar, { backgroundColor: currentColors.bgContainer }]
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen
        name="Pet"
        component={HorsesScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: '' }}
      />
    </Tab.Navigator>
  );
}

const Navigation = () => {

  const token = useSelector((state) => state.user.token);
  const initialRoute = token ? 'Main' : 'Login';

  return (
    <NavigationContainer>
      <StatusBar barStyle='dark-content' backgroundColor="#000" />
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
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        <Stack.Screen name="HorseDetail" component={HorseDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;

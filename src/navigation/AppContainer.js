import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useTheme, TouchableRipple } from 'react-native-paper'

import WishlistScreen from '../screens/Wishlist'
import MapScreen from '../screens/Map'
import Authentification from '../screens/Authentification'
import SignupScreen from '../screens/Signup'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom'


export default function AppContainerScreen({ navigation }) {

  const Tab = createBottomTabNavigator()
  const Stack = createStackNavigator();
  const { colors } = useTheme()
  const [token, setToken] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)


  const renderIcon = (iconSource) => ({ focused, size }) => (
    <TouchableRipple rippleColor={colors.primary}>
      <Icon name={iconSource} size={size} color={focused ? colors.primary : colors.divider} />
    </TouchableRipple>
  )

  useEffect(() => {
    getToken()
  }, [])

  const getToken = async () => {

    try {
      const value = await AsyncStorage.getItem('@bearerToken')
      setToken(value);
      const isAdmin = await AsyncStorage.getItem('@isAdmin')
      setIsAdmin((isAdmin === 'true'))
      if (value !== null) {
      }
    } catch (e) {
      console.log(e)
    }
  }

  const tabnavigator = () => {
    return (


      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: colors.primary,
          activeBackgroundColor: colors.background,
          inactiveBackgroundColor: colors.background,
          style: { borderTopWidth: 0 }
        }}>
        <Tab.Screen
          name="Wishlist"
          options={{
            tabBarIcon: renderIcon('format-list-bulleted-square'),
            tabBarLabel: 'Souhait'
          }}
          component={WishlistScreen}
        />
        <Tab.Screen
          name="Map"
          options={{
            tabBarIcon: renderIcon('map'),
            tabBarLabel: 'Map'
          }}
          component={MapScreen}
        />
      </Tab.Navigator>
    )
  }

  const stack = (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Login"
          component={Authentification}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />
        <Stack.Screen
          name="Bottom" component={tabnavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
  return stack
}

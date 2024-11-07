import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import CategoryScreen from '../screens/CategoryScreen';
import PersonalScreen from '../screens/PersonalScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PassDetailsScreen from '../screens/PassDetailsScreen';
import AddCredentialsScreen from '../screens/AddCredentialsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    headerShown: false
                }}
            />

            <Tab.Screen
                name='Category'
                component={CategoryScreen}
                options={{
                    headerShown: false
                }}
            />

            <Tab.Screen
                name='Personal'
                component={PersonalScreen}
                options={{
                    headerShown: false
                }}
            />

            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
}

function StackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='TabNavigator'
                component={TabNavigator}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name='EditProfile'
                component={EditProfileScreen}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name='PassDetails'
                component={PassDetailsScreen}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name='AddCredentials'
                component={AddCredentialsScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    );
}
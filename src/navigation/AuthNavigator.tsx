import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/subScreens/LoginScreen";
import RegisterScreen from "../screens/subScreens/RegisterScreen";

const Stack = createStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}
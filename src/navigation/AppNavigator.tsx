import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ActivityIndicator, View } from "react-native";
// import WelcomeScreen from "../screens/Home/WelcomeScreen";
// import { NavigationContainer } from "@react-navigation/native";
// import { useFirstLaunch } from "../hooks/useFirstLaunch";

export default function AppNavigator() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // ALL COMMENTED BELOW
    //    const firstLaunch = useFirstLaunch()


    // if (firstLaunch === null) {
    // return (
    // <View style={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // }}>
    //     <ActivityIndicator size="large" />
    // </View>
    // null
    // )
    // }

    return (

        // Supposedly only working way of this below 1 line of code
        isAuthenticated ? <MainNavigator /> : <AuthNavigator />

        // <NavigationContainer>
        //     {
        //         isAuthenticated
        //             ? <MainNavigator />
        //             : <AuthNavigator />
        //     }
        // </NavigationContainer>


        // <NavigationContainer>
        //{/* {firstLaunch */}
        // ? <WelcomeScreen />
        // : isAuthenticated
        // ? <MainNavigator />
        // : <AuthNavigator />}
        //{/* </NavigationContainer> */}
    )
}
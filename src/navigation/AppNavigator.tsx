import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

export default function AppNavigator() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        isAuthenticated ? <MainNavigator /> : <AuthNavigator />
    )
}
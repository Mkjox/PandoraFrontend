import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useFirstLaunch() {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)

    useEffect(() => {
        ;(async () => {
            const val = await AsyncStorage.getItem('hasLaunched')
            if(val === null) {
                setIsFirstLaunch(true)
                await AsyncStorage.setItem('hasLaunched', true)
            }
            else {
                setIsFirstLaunch(false)
            }
        })()
    }, [])

    return isFirstLaunch
}
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import AuthService from '@services/AuthService';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import CustomCard from '@components/CustomCard';

const SessionsScreen = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const [sessions, setSessions] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSessions = async () => {
            const result = await AuthService.getSessions();
            if (result.success && result.data) {
                setSessions(result.data);
                setMessage(result.message);
            } else {
                setMessage(result.message);
            }
        };
        fetchSessions();
    }, []);

    return (
        <ScrollView contentContainerStyle={[styles.container, theme.styles.container, StyleSheet.absoluteFill]}>
            <Text style={[styles.title, theme.styles.text]}>Active Sessions</Text>

            {sessions.length > 0 ? (
                sessions.map((session, index) => (
                    <CustomCard key={index} style={[styles.sessionCard, theme.styles.card]}>
                        <Text>Id: {session.id}</Text>
                        <Text>IP: {session.ipAddress}</Text>
                        <Text>User Agent: {session.userAgent}</Text>
                        <Text>Created: {session.createdAt}</Text>
                        <Text>Expires: {session.expiresAt}</Text>
                        <Text>Current: {session.isCurrentSession ? 'Yes' : 'No'}</Text>
                    </CustomCard>
                ))
            ) : (
                <View>
                    <Text style={[styles.message, theme.styles.textGray]}>{message}</Text>
                    <Text style={styles.empty}>No active sessions found.</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
    },
    message: {
        color: '#666',
        marginBottom: 10,
    },
    sessionCard: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 3
    },
    empty: {
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default SessionsScreen;

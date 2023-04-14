import React from 'react';
import { Text } from 'react-native';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import AuthStack from './authStack';
import UserStack from './userStack';

export default function RootNavigation() {

    const { user } = useAuthentication();

    return user ? <UserStack /> : <AuthStack />;
}
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenManager {
    constructor() {
        this.accessToken = null
    }

    getAccessToken() {
        return this.accessToken
    }

    async updateTokens(accessToken) {
        try {
            await AsyncStorage.setItem('accessToken', accessToken)
            this.accessToken = accessToken
        } catch (e) {
            console.log(e);
        }
    }

    async _loadTokens() {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken')
            this.accessToken = accessToken
        } catch (e) {
            console.log(e);
        }
    }

    async unloadTokens() {
        try {
            await AsyncStorage.removeItem('accessToken')
            this.accessToken = null
        } catch (e) {
            console.log(e);
        }
    }

}

export const tokenManager = new TokenManager()

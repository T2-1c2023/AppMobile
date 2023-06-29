import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

class TokenManager {
    constructor() {
        this.accessToken = null
        this.payload = {
            fullname: '',
            id: '',
            is_athlete: false, 
            is_trainer: false,
        }
    }

    getName() {
        return this.payload.fullname
    }

    getUserId() {
        return this.payload.id
    }

    isMixedUser() {
        return this.payload.is_athlete && this.payload.is_trainer
    }

    isAthlete() {
        return this.payload.is_athlete
    }

    isTrainer() {
        return this.payload.is_trainer
    }

    getAccessToken() {
        return this.accessToken
    }

    tokenLoaded() {
        return this.accessToken !== null
    }

    getPayload() {
        return this.payload
    }

    updatePayload() {
        this.payload = jwt_decode(this.accessToken)
    }

    async updateTokens(accessToken) {
        try {
            await AsyncStorage.setItem('accessToken', accessToken)
            this.accessToken = accessToken
            accessToken && this.updatePayload()
        } catch (e) {
            console.log(e);
        }
    }

    async _loadTokens() {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken')
            this.accessToken = accessToken
            accessToken && this.updatePayload()
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

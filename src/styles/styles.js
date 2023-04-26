import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

// var { colors } = useTheme();

export default StyleSheet.create({
    scrollView: {
        backgroundColor: '#DED8E1',
    },
    
    container: {
        backgroundColor: '#DED8E1',
        flex: 1,
        alignItems: 'center',
    },
    loginImage: {
        aspectRatio: 488/537, 
        maxHeight: 140,
    },

    fingerprintImage: {
        aspectRatio: 1/1,
        maxHeight: 140,
    },

    textHeader: {
        textAlign: 'center',
    },
    ImageLoginFingerPrint: {
        aspectRatio: 1/1, 
        maxWidth: 50,
        alignSelf: 'center',
        flexGrow: 1,
    },
    
    textDetails: {
        color: '#605D64',
        width: 250,
        textAlign: 'center',
    },

    textWarning: {
        color: 'red',
        width: 250,
        textAlign: 'center',
    },

    textLinked: {
        color: '#21005D', 
        fontWeight: 'bold',
    },

    inputData: {
        backgroundColor: '#CCC2DC',
        width: 250,
    },

    textBox: {
        color: '#605D64',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        width: 350,
        fontSize: 26,
        backgroundColor: 'transparent',
        minHeight: 40,
        textAlignVertical: 'top',
    },

    daysWord: { 
        fontSize: 26, 
        marginLeft: 10,
        marginTop: 10,
        color: '#605D64'
    },

    daysBox: {
        color: '#605D64',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        width: 100,
        height: 50,
        fontSize: 26,
        backgroundColor: 'transparent',
        textAlignVertical: 'top',
        textAlign: 'center',
        marginLeft: 20,
    },

    pinInput: {
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#CCC2DC',
        fontSize: 50,
    },

    phoneInput: {
        backgroundColor: '#CCC2DC',
        borderWidth: 1,
        borderRadius: 40,
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

// var { colors } = useTheme();

export default StyleSheet.create({
    scrollView: {
        backgroundColor: '#DED8E1',
        flex: 1,
    },
    
    scrollViewWithFooter: {
        backgroundColor: '#DED8E1',
        flex: 0.9,
    },

    footerContainer: {
        flex: 0.1, 
    },

    container: {
        backgroundColor: '#DED8E1',
        flex: 1,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginImage: {
        aspectRatio: 699/699, 
        height: 140,
    },

    fingerprintImage: {
        aspectRatio: 1/1,
        maxHeight: 140,
    },

    textHeader: {
        textAlign: 'center',
        color: 'black',
    },

    textProfileName: {
        color: 'black',
        fontWeight: 'bold',
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
    
    textDetailsNotFixedWidth: {
        color: '#605D64',
        textAlign: 'center',
    },

    textDetailsLeft: {
        color: '#605D64',
        width: 350,
        textAlign: 'left',
        fontSize: 14,
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
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        width: 350,
        fontSize: 26,
        backgroundColor: 'transparent',
        minHeight: 40,
        textAlignVertical: 'top',
    },

    textBoxNonEditable: {
        color: 'black',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        width: 350,
        fontSize: 26,
        backgroundColor: '#BDBDBD',
        minHeight: 40,
        textAlignVertical: 'top',
    },

    texBoxCounter: { 
        alignSelf: 'flex-end', 
        marginRight: 25
    },

    flexibleTextBox: {
        color: '#605D64',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        fontSize: 18,
        backgroundColor: 'transparent',
        minHeight: 40,
        textAlignVertical: 'top',
    },

    flexibleTextBoxCounter: {
        alignSelf: 'flex-end',
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
        fontSize: 20,
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

    confirmationButton: { 
        backgroundColor: '#21005D',
    },

    cancelButton: {
        backgroundColor: 'grey',
    },

    buttonStandard: {
    },
});
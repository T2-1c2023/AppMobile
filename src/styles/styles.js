import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

// var { colors } = useTheme();

export default StyleSheet.create({
    container: {
        backgroundColor: '#DED8E1',
        flex: 1,
        alignItems: 'center',
    },
    loginImage: {
        aspectRatio: 488/537, 
        maxHeight: 140,
        marginTop: 15,
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
        width: 200,
        textAlign: 'center',
    },

    // used in PinInput Component
    pinInput: {
        
    },
});
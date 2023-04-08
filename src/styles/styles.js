import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

// var { colors } = useTheme();

export default StyleSheet.create({
    loginImage: {
        aspectRatio: 488/537, 
        height: 140
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    LoginFingerPrintImage: {
        aspectRatio: 1, 
        height: 50
    },    
});
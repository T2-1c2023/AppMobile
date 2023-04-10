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
        marginBottom: 0,
    },
    textHeader: {
        marginTop: 0,
        marginBottom: 20,
        
    },
    ImageLoginFingerPrint: {
        aspectRatio: 1/1, 
        maxWidth: 50,
        alignSelf: 'center',
        flexGrow: 1,
    },
});
import { View } from 'react-native';
import { Text, Divider, Button } from 'react-native-paper';

export const TextHeader = (props) => {
    return (
        <Text variant="displayLarge">
            {props.body}
        </Text>
    )
}

export const DividerWithMiddleText = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
            <Text style={{ marginHorizontal: 10 }}>{props.text}</Text>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
        </View>

    )
}

export const ButtonStandard = (props) => {
    return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Button 
                        mode="contained"
                        onPress={props.onPress}>
                        {props.title}
                    </Button>
        </View>
    )
}
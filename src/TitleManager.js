import { Text } from "react-native"

class TitleManager {

    setTitle(navigation, title, fontSize) {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={{ fontSize: fontSize, textAlign: 'center' }}>
                    {title}
                </Text>
            )
        })
    }
}

export const titleManager = new TitleManager()
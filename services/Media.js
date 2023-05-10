import * as ImagePicker from 'expo-image-picker';

export async function uploadImage() {
   let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
   });

   console.log(result);

   return result.assets[0].uri;
}
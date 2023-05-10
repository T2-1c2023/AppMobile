import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';

export async function uploadImage() {
   // Let user pick image from library
   let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
   });

   console.log(result);

   if (!result.canceled) {
      try {
         // Image id for firebase storage
         const imageId = Date.now().toString();
         const storageRef = storage().ref().child(`images/${imageId}`);
         await storageRef.putFile(result.assets[0].uri);
         console.log('Imagen subida a firebase storage');
         // For future requests of image stored in firebase storage
         return imageId;
      } catch (error) {
         console.error(error);
      }
   }
}

export async function downloadImage(firebaseId) {
   try {
      const uri = await storage().ref().child(`images/${firebaseId}`).getDownloadURL();
      return uri;
   } catch (error) {
      console.error(error);
      return null;
   }
   
}
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';

// Lets user pick image from library, returns uri of selected image
export async function selectImage() {
   const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1
   });

   if (!result.canceled) {
      return result.assets[0].uri;
   } else return null;
}

// Tries to upload image to firebase. On succes, returns the stored image id
export async function uploadImageFirebase(uri) {
   try {
      // Image id for firebase storage
      const imageId = Date.now().toString();
      const storageRef = storage().ref().child(`images/${imageId}`);
      await storageRef.putFile(uri);
      // For future requests of image stored in firebase storage
      return imageId;
   } catch (error) {
      console.error(error);
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

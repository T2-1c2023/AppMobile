import axios from 'axios';

const url = "http://nominatim.openstreetmap.org/reverse?format=json&zoom=18&";

export async function getLocation(latitude, longitude) {
    try {
        const response = await axios.get(url + `lat=${latitude}&lon=${longitude}`);
        
        return response.data.display_name;
    } catch (error) {
        alert('El servicio Nominatim no se encuentra disponible para obtener la dirección', error);
        return '';
    }
}
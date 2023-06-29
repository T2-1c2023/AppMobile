import axios from 'axios';

const url = "http://nominatim.openstreetmap.org/reverse?format=json&zoom=18&";

export async function getLocation(latitude, longitude) {
    try {
        const response = await axios.get(url + `lat=${latitude}&lon=${longitude}`);
        const location = response.data;

        let locationString = "";
        if (location.address.postcode) locationString += location.address.postcode + ", ";
        
        if (location.address.road) locationString += location.address.road + ", ";

        if (location.address.city) locationString += location.address.city + ", ";

        else if (location.address.state_district)
            locationString += location.address.state_district + ", ";

        if (location.address.state) locationString += location.address.state;

        if (location.address.country)
            locationString += ", " + location.address.country;
            
        return locationString;
    } catch (error) {
        //alert('El servicio Nominatim no se encuentra disponible para obtener la dirección', error);
        console.error(error);
        return '';
    }
}
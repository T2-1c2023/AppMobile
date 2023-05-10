# FiuFitApp

## Instalación

### Requisitos previos
- Node.js
- Expo CLI (instalado de manera global):
  `npm i -g eas-cli`

### Pasos
1. Abrir una terminal en el directorio raíz del proyecto.
2. Ejecutar `npm install` para instalar las dependencias necesarias.
3. Ejecutar `eas login` e ingresar las credenciales de tu cuenta Expo. Es necesario tener permisos de desarrollador en el proyecto.
4. Si se está usando un emulador de Android:
   - Ejecutar `eas build --profile development --platform android` para compilar la aplicación.
   - Ejecutar `npx expo start --dev-client` para iniciar el servidor de desarrollo.
   - Una vez cargado el metro bundler, presionar `a` en la terminal para instalar la aplicación en el emulador.
5. Si se está usando un dispositivo Android:
   - Seguir los pasos indicados en la documentación oficial de Expo para crear un APK de desarrollo e instalarlo en el dispositivo. (https://docs.expo.dev/develop/development-builds/create-a-build/#create-a-development-build-for-the-device)


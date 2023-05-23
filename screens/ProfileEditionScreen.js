
getRole() {
    const { is_trainer, is_athlete } = this.props.data;
    if (is_trainer && is_athlete) {
        return 'Trainer and Athlete';
    } else if (is_trainer) {
        return 'Trainer';
    } else if (is_athlete) {
        return 'Athlete';
    } else {
        return 'N/A';
    }
}

// TODO: (extra) modularizar para que sea más legible?
uploadProfilePicture = async () => {
    const imageLocalUri = await selectImage();
    if (imageLocalUri != null) {
        this.setState({ profilePic: { uri: imageLocalUri } });

        const imageId = await uploadImageFirebase(imageLocalUri);

        // Update image id on back end
        const url = API_GATEWAY_URL + 'users/' + this.props.data.id;
        const body = {
            photo_id: imageId
        }
        // TODO: Es mejor hacer un load con await?
        axios.patch(url, body, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error)
            });
    }
}


// Lets user choose a profile picture from library
handleProfilePicturePress = async () => {

    Alert.alert(
        'Editar foto de perfil',
        'Desea modificar la foto de perfil?',
        [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Continuar',
                onPress: async () => {
                    this.uploadProfilePicture();
                }
            }
        ]
    );
}


{/* {this.props.data && (
                        <>
                            <TouchableOpacity onPress={this.handleProfilePicturePress}>
                                <Image
                                    source={this.state.profilePic}
                                    style={{... styles_hs.userImage, marginTop: 40}}
                                />
                                <View style={styles_hs.editIcon}>
                                    <Ionicons name="pencil" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text style={{... styles_hs.text, marginTop: 40}}>Welcome {fullname}!</Text>
                            <Text style={styles_hs.text}>Email: {mail}</Text>
                            <Text style={{... styles_hs.text, marginBottom: 20}}>Role: {this.getRole()}</Text>
                        </>
                    )} */}

                    const styles_hs = StyleSheet.create({
                        container: {
                            flex: 1,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        text: {
                            fontSize: 20,
                            marginTop: 10,
                        },
                        userImage: {
                            width: 140,
                            height: 140,
                            borderRadius: 140 / 2
                        },
                        editIcon: {
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: 140 / 2,
                            padding: 5
                        }
                    });
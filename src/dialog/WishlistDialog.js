import React, { useEffect, useRef, useState } from 'react'
import { Button, Dialog, TextInput } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown';
import { StyleSheet, Keyboard } from 'react-native';
import ky from 'ky'

import { apiUrl } from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * @author LMF
 * @since 2020-11
 * @version 1.0
 */
export default function WishlistDialog({ wishlistPopup, wishlist: initialTitle = {}, visible, onDismiss, onSubmit }) {
    // Initialisation de l'état interne du composant
    const [wishlist, setTitle] = useState(initialTitle)

    // Références pour changer le focus automatiquement
    const designationRef = useRef(null)
    const dureeRef = useRef(null)
    const imageRef = useRef(null)

    const styles = StyleSheet.create({
        containerStyle: {
            flex: 1,
            marginHorizontal: 20,
            justifyContent: 'center',
        },
    });


    return (
        <Dialog onPress={Keyboard.dismiss} visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>{wishlistPopup}</Dialog.Title>
            <Dialog.Content>
                <TextInput
                    label="Nom du voeu"
                    value={wishlist.nom}
                    onChangeText={(nom) => setTitle({ ...wishlist, nom })}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    onSubmitEditing={() => dureeRef.current.focus()}
                />
                <TextInput
                    ref={dureeRef}
                    label="Date"
                    onChangeText={(date) => setTitle({ ...wishlist, date })}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    onSubmitEditing={() => imageRef.current.focus()}
                />
                <TextInput
                    ref={imageRef}
                    label="Latitude"
                    onChangeText={(latitude) => setTitle({ ...wishlist, latitude })}
                    keyboardType="numeric"
                    returnKeyType="done"
                    blurOnSubmit={false}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                <TextInput
                    ref={imageRef}
                    label="Longitude"
                    onChangeText={(longitude) => setTitle({ ...wishlist, longitude })}
                    keyboardType="numeric"
                    returnKeyType="done"
                    blurOnSubmit={false}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                

            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => { onSubmit(wishlist) }}>Valider</Button>
            </Dialog.Actions>
        </Dialog>
    )



}

import React, { useEffect, useState } from 'react'
import { FlatList, View, StyleSheet, Dimensions } from 'react-native'
import { ActivityIndicator, TouchableRipple, Button, Appbar, Card, Text, Dialog, FAB, Paragraph, Portal, Snackbar, Surface, TextInput } from 'react-native-paper'
import ky from 'ky'
import { apiUrl } from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MapView, { Polyline } from 'react-native-maps';
import Marker from 'react-native-maps';
import Icon from 'react-native-ico-new-year';
import MapViewDirections from 'react-native-maps-directions';

/**
 * @author Matthieu BACHELIER
 * @since 2020-11
 * @version 1.0
 */
export default function MapScreen({ navigation }) {
    const [wishlists, setWishlists] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)

    const [wishlist, setWishlist] = useState({})
    const [token, setToken] = useState(false)
    const [emailUser, setEmailUser] = useState("")
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [caribou, setCaribou] = useState(0)
    const [firstPoint, setFirstPoint] = useState({})
    const [secondPoint, setSecondPoint] = useState({})


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        mapStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
    });

    useEffect(() => {
        setLoading(true)
        getTokenEmailAdmin()

        const unsubscribe = navigation.addListener('focus', () => {
            if (emailUser != '') {
                getWishlists();
            }
        });

        return unsubscribe;

        //getWishlists()

    }, [navigation])

    const getTokenEmailAdmin = async () => {
        try {
            const value = await AsyncStorage.getItem('@bearerToken')
            const emailUserr = await AsyncStorage.getItem('@emailUser')
            setEmailUser(emailUserr)
            setToken(value)
            getWishlistToken(value, emailUserr) // A revoir plus tard
        } catch (e) {
            // error reading value
        }
    }

    const getWishlistToken = async (tokenn, emailUser) => { // A revoir plus tard

        // API Setup

        const api = ky.extend({
            hooks: {
                beforeRequest: [
                    request => {
                        request.headers.set('Authorization', 'Bearer ' + tokenn);
                        request.headers.set('Content-Type', 'application/json');
                    }
                ]
            }
        });

        // API Setup

        const res = await api.get(`${apiUrl}/wishlists/user/` + emailUser);

        if (res) {
            const data = await res.json()
            setWishlists(data)
        } else {
            setMessage('Erreur réseau')
        }
        setLoading(false)
    }

    const getWishlists = async () => {

        // API Setup



        const api = ky.extend({
            hooks: {
                beforeRequest: [
                    request => {
                        request.headers.set('Authorization', 'Bearer ' + token);
                        request.headers.set('Content-Type', 'application/json');
                    }
                ]
            }
        });

        // API Setup
        console.log(emailUser)
        console.log("sddsssddsdssd")
        const res = await api.get(`${apiUrl}/wishlists/user/` + emailUser);

        if (res) {
            const data = await res.json()
            setWishlists(data)
        } else {
            setMessage('Erreur réseau')
        }
        setLoading(false)
    }

    const deleteToken = async () => {
        try {
            await AsyncStorage.removeItem('@bearerToken')
            return null
        } catch (e) {
            // remove error
        }
    }

    const goToDiconnect = () => {
        deleteToken()
        navigation.navigate('Login');
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    const renderIcon = (iconSource) => ({ focused, size }) => (
        <TouchableRipple>
            <Icon name={iconSource} size={size} />
        </TouchableRipple>
    )

    function sortFloat(a, b) {
        return a.latitude - b.latitude;
    }

    const calcCaribou = async () => {
        const api = ky.extend({
            hooks: {
                beforeRequest: [
                    request => {
                        request.headers.set('Authorization', 'Bearer ' + token);
                        request.headers.set('Content-Type', 'application/json');
                    }
                ]
            }
        });
        const res = await api.get(`${apiUrl}/wishlists/user/distance/` + emailUser);

        if (res) {
            const km = await res.text()
            console.log(km);
            setMessage("Le papa noel a parcouru " + km + " kilomètres")
        } else {
            setMessage('Erreur réseau')
        }
        setLoading(false)
    }
    return (
        <Surface style={{ flex: 1 }}>

            <Appbar.Header style={{ backgroundColor: '#2F8D96' }}>
                <Appbar.Content title="Map" />
                <Appbar.Action icon="logout" onPress={() => { goToDiconnect() }} />
            </Appbar.Header>
            {loading ? (
                <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignContent: 'center', height: '100%' }} />
            ) : (
                    <View style={styles.container}>
                        <MapView style={styles.mapStyle}>
                            {wishlists.map((wishlist, index) => (
                                <MapView.Marker
                                    key={index}
                                    coordinate={{
                                        latitude: wishlist.latitude,
                                        longitude: wishlist.longitude
                                    }}
                                    title={wishlist.nom}
                                    description={wishlist.nom}
                                />

                            ))}

                            <Polyline coordinates={[{
                                latitude: wishlists[0].latitude,
                                longitude: wishlists[0].longitude,
                            }, {
                                latitude: wishlists[1].latitude,
                                longitude: wishlists[1].longitude,
                            }]} />

                            <Polyline coordinates={[{
                                latitude: wishlists[1].latitude,
                                longitude: wishlists[1].longitude,
                            }, {
                                latitude: wishlists[2].latitude,
                                longitude: wishlists[2].longitude,
                            }]} />
                        </MapView>

                    </View>

                )}
            <FAB
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 16,
                    bottom: 0
                }}
                icon={renderIcon("deer")}
                onPress={() => calcCaribou()}
            />
            {message && (
                <Snackbar visible={message !== null} onDismiss={() => setMessage(null)} duration={Snackbar.DURATION_SHORT}>
                    {message}
                </Snackbar>
            )}
        </Surface>
    )
}

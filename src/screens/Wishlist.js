import React, { useEffect, useState } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { ActivityIndicator, Button, Appbar, Card, Text, Dialog, FAB, Paragraph, Portal, Snackbar, Surface, TextInput } from 'react-native-paper'
import ky from 'ky'
import { CheckBox } from 'react-native-elements'
import { apiUrl } from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserDialog from '../dialog/UserDialog'
import WishlistDialog from '../dialog/WishlistDialog'
/**
 * @author Matthieu BACHELIER
 * @since 2020-11
 * @version 1.0
 */
export default function WishlistScreen({ navigation }) {
  const [wishlists, setWishlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [wishlist, setWishlist] = useState({})
  const [token, setToken] = useState(false)
  const [emailUser, setEmailUser] = useState("")

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 0,
      bottom: 25,
      backgroundColor: "white"
    },
  })

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

  const addWishlist = async (a) => {
    try {

      a.user = { email: emailUser };
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


      const res = await api.post(`${apiUrl}/wishlist`, { json: a })
      if (res) {
        getWishlists()
        setMessage('Nouvel auteur ajouté !')
      } else {
        setMessage("Erreur lors de l'ajout")
      }
    } catch (error) {
      setMessage("Erreur lors de l'ajout")
    }
    setShowAddDialog(false)
  }

  const editWishlist = async (a) => {


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
    try {
      const res = await api.put(`${apiUrl}/wishlist`, { json: a })
      if (res) {
        getWishlists()
        setMessage('Auteur modifié !')
      } else {
        setMessage('Erreur lors de la modification')
      }
    } catch (error) {
      setMessage('Erreur lors de la modification')
    }
    setShowEditDialog(false)
  }

  const deleteWishlist = async (item) => {

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

    const res = await api.delete(`${apiUrl}/wishlist/` + item.id)
    if (res) {
      setLoading(true)
      getWishlists()
    } else {
      setMessage('Erreur réseau')
    }
    setShowDeleteDialog(false)
  }

  const deleteToken = async () => {
    try {
      await AsyncStorage.removeItem('@bearerToken')
      return null
    } catch (e) {
      // remove error
    }
  }

  const setChecked = async (item) => {
    // API Setup
    item.checked = !item.checked;
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

    const res = await api.put(`${apiUrl}/wishlist`, { json: item })
    if (res) {
      const data = await res.json()
      setWishlists(data)
    } else {
      setMessage('Erreur réseau')
    }
    setLoading(false)
  }

  const goToDiconnect = () => {
    deleteToken()
    navigation.navigate('Accueil');
  }
  const renderWishlist = ({ item, index }) => {


    return (
      <Card style={{ margin: 16, elevation: 4 }}>
        <Card.Content>
          <CheckBox
            title={item.nom}
            checked={item.checked}
            iconType='material'
            checkedIcon='clear'
            uncheckedIcon='add'
            checkedColor='red'
            onPress={() => setChecked(item)}
          />
        </Card.Content>
        <Card.Content>
          <FAB
            style={styles.fab}
            small
            color="red"
            icon="delete"
            onPress={() => deleteWishlist(item)}
          />
        </Card.Content>
      </Card>
    )
  }

  return (
    <Surface style={{ flex: 1 }}>

      <Appbar.Header style={{ backgroundColor: '#2F8D96' }}>
        <Appbar.Content title="Souhait" />
        <Appbar.Action icon="logout" onPress={() => { goToDiconnect() }} />
      </Appbar.Header>
      {loading ? (
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignContent: 'center', height: '100%' }} />
      ) : (
          <>
            <FlatList
              data={wishlists}
              extraData={wishlists}
              renderItem={renderWishlist}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{ marginBottom: 48 }} />}
            />
          </>
        )}
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 16,
          bottom: 0
        }}
        icon="playlist-plus"
        onPress={() => setShowAddDialog(true)}
      />
      {message && (
        <Snackbar visible={message !== null} onDismiss={() => setMessage(null)} duration={Snackbar.DURATION_SHORT}>
          {message}
        </Snackbar>
      )}
      <Portal>
        <WishlistDialog titlePopup="Ajouter un souhait" visible={showAddDialog} onDismiss={() => setShowAddDialog(false)} onSubmit={addWishlist} />
        {wishlist && showEditDialog && (
          <WishlistDialog
            titlePopup="Modifier un souhait"
            wishlist={wishlist}
            visible={showEditDialog}
            onDismiss={() => {
              setShowEditDialog(false)
              setWishlist(null)
            }}
            onSubmit={editWishlist}
          />
        )}
        <Dialog visible={showDeleteDialog}>
          <Dialog.Title>Confirmer votre action</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Êtes-vous sûr de vouloir supprimer cet auteur ?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <View>
              <Button onPress={() => {
                deleteWishlist(wishlist)
                setShowDeleteDialog(false)
              }}>Oui</Button>
              <Button onPress={() => {
                setShowDeleteDialog(false)
              }}>Non</Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  )
}

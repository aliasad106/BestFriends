import React, {Component} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    Image, Dimensions,
    PermissionsAndroid,
    AppState
} from 'react-native';
import FriendsList from '../Components/FriendsList';
import RadioGroup from "react-native-custom-radio-group";
import Styles from '../Styles'
import Contacts from 'react-native-contacts';
import realmModel from './../Models/Realm';

export default class Friends extends Component {
    static navigationOptions = {header: null}; // hide the default header of the navigation of react native

    constructor(props) {
        super(props)

        let allFriends = Array.from(realmModel.objects('FriendModel'));
        let friends = allFriends.map((contact) => {
            return {id: contact.id, name: contact.name, number: contact.number, rating: contact.rating};
        })

        this.state = {
            contactsWithNameAndNumber: friends,
            name:"ali"
        }

        this.fetchContacts()
    }


    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            this.fetchContacts();
        }
    };

    fetchContacts() {
        console.log("fetching contacts");
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.'
                }
            ).then(() => {
                Contacts.getAll((err, contacts) => {
                    if (err === 'denied') {

                    } else {
                        this.syncContacts(contacts)
                    }
                })
            })

        } else {
            Contacts.getAll((err, contacts) => {
                if (err) {
                    throw err;
                }
                this.syncContacts(contacts)

            })
        }
    }

    syncContacts(contacts) {

        let contactsWithNameAndNumber = this.state.contactsWithNameAndNumber;
        contacts.map((contact) => {
            let givenName = contact.givenName ? contact.givenName : "";
            let familyName = contact.familyName ? contact.familyName : "";
            let fullName = (givenName + " " + familyName).trim()
            let number = (contact.phoneNumbers[0] ? contact.phoneNumbers[0].number : "").trim()

            let realmObjects = realmModel.objects('FriendModel');
            let filteredObjects = realmObjects.filtered(`number = "${number}"`);
            if (Array.from(filteredObjects).length == 0) {
                let id = realmModel.objects('FriendModel') ? realmModel.objects('FriendModel').length : 0;
                realmModel.write(() => {
                    realmModel.create('FriendModel', {
                        id: id,
                        name: fullName,
                        number: number,
                        rating: 0.0
                    })
                })
                contactsWithNameAndNumber.push({id:id,name: fullName, number: number, rating:0.0})
                this.setState({
                    contactsWithNameAndNumber: contactsWithNameAndNumber,
                });
            }

        });
    }

    onSelectNewTransaction(transactionType) {
        this.props.navigation.navigate('TransactionScreen', {transactionType: transactionType});
    }

    render() {
        return (
            <KeyboardAvoidingView style={Styles.keyboardAvoidingView}
                                  behavior={(Platform.OS === 'ios') ? "padding" : null}>
                <SafeAreaView style={Styles.safeAreaView}>
                    <View style={Styles.headerContainer}>
                        <View/>
                        <Text style={Styles.pn_r_white18}>Select your friend</Text>
                        <TouchableOpacity>
                            <Image source={require('./../../assets/settingsButton.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={FriendsScreenStyle.friendsListStyle}>
                        <FriendsList
                            friendsContacts={this.state.contactsWithNameAndNumber}
                            navigation={this.props.navigation}
                            detination={"RelationshipScreen"}
                        />
                    </View>
                    <View style={FriendsScreenStyle.addNewTransactionContainer}>
                        <RadioGroup
                            onChange={(selectedValue) => {
                                this.onSelectNewTransaction(selectedValue)
                            }}
                            containerStyle={{
                                width: Dimensions.get('window').width - 96,
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                            buttonContainerStyle={{
                                width: 130,
                                marginLeft: 6,
                                marginRight: 6,
                                fontSize: 18,
                                borderWidth: 1,
                                borderColor: '#4D4F5C',
                                height: 40,
                            }}
                            buttonContainerActiveStyle={{
                                backgroundColor: 'white',
                                fontSize: 18,
                                fontWeight: 'normal',
                                fontFamily: 'ProximaNova-SemiBold',
                            }}
                            buttonContainerInactiveStyle={{
                                backgroundColor: 'white',
                                fontSize: 18,
                                fontWeight: 'normal',
                                fontFamily: 'ProximaNova-SemiBold',
                            }}

                            buttonTextActiveStyle={{
                                color: '#4D4F5C',
                                fontSize: 18,
                                fontWeight: 'normal',
                                fontFamily: 'ProximaNova-SemiBold',
                            }}
                            buttonTextInactiveStyle={{
                                color: '#4D4F5C',
                                fontSize: 18,
                                fontWeight: 'normal',
                                fontFamily: 'ProximaNova-SemiBold',
                            }}

                            radioGroupList={[{
                                label: '- Given',
                                value: '0'
                            }, {
                                label: '+ Received',
                                value: '1'
                            }]}
                        />
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

}
const FriendsScreenStyle = StyleSheet.create({
    friendsListStyle: {
        marginTop: 8,
        // flex: 4,
        height: Dimensions.get('window').height - 210
    },
    addNewTransactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 16,
        paddingBottom: 24,
        height: 60,
        flex: 0.5,
    },
});
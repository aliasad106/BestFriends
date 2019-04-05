import React from "react";
import {View, Text, Dimensions, Image, TouchableOpacity, StyleSheet, Keyboard} from "react-native";
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";
import {Rating} from 'react-native-elements';
import Styles from "../Styles";
import ImageButton from "./ImageButton";
import SearchTextField from "./SearchTextField";

export default class FriendsList extends React.Component {

    constructor(props) {
        super(props);


        let friendsContacts = props.friendsContacts
        friendsContacts = [{name:"", number:""}].concat(friendsContacts);

        this.ViewTypes = {
            HEADER_ROW: 0,
            CONTACT_ROW: 1,
        };

        this.friendsDataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });


        this.state = {
            headerLoadingMessage: friendsContacts.length == 1?'Loading...':'',
            showHeaderMessage: friendsContacts.length == 1?true:false,
            dataProvider: this.friendsDataProvider.cloneWithRows(friendsContacts), // init data provider with one element to at least show header
            searchedText: '',
            friendsContacts: friendsContacts, // one element to at least show header
        }


        this.friendsListLayoutProvider = new LayoutProvider(
            index => {
                if (index === 0) {
                    return this.ViewTypes.HEADER_ROW; // header
                } else {
                    return this.ViewTypes.CONTACT_ROW;
                }
            },
            (type, dim) => {
                dim.width = Dimensions.get("window").width;
                if (type === this.ViewTypes.HEADER_ROW && friendsContacts.length == 1) {
                    dim.height = 140; // initially only for header, next will update when contacts received from props
                } else {
                    dim.height = 70;
                }
            }
        );

        this._rowRenderer = this._rowRenderer.bind(this);

    }

    updateFriendsListLayout() {
        this.friendsListLayoutProvider = new LayoutProvider(
            index => {
                if (index === 0) {
                    return this.ViewTypes.HEADER_ROW; // header
                } else {
                    return this.ViewTypes.CONTACT_ROW; // other rows
                }
            },
            (type, dim) => {
                dim.width = Dimensions.get("window").width;
                if (this.state.showHeaderMessage && type === this.ViewTypes.HEADER_ROW) {
                    dim.height = 140;
                } else {
                    dim.height = 70;
                }
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {

            let friendsContacts = nextProps.friendsContacts


            const filteredData = friendsContacts.filter(item => {
                return item.name.toString().toLowerCase().search(this.state.searchedText.toLowerCase()) !== -1
            });

            const headerAddedData = [{name:"", number:""}].concat(filteredData);
            this.setState({
                friendsContacts: headerAddedData,
                dataProvider: this.friendsDataProvider.cloneWithRows(headerAddedData)
            });

            if (headerAddedData.length == 1) {
                this.setState({
                    headerLoadingMessage: "No Contacts Found!",
                    showHeaderMessage: true
                });

            } else {
                this.setState({
                    showHeaderMessage: false
                });
            }
            this.updateFriendsListLayout()
        }
    }

    onSearchFriendTextChanged(searchedText) {
        this.setState({searchedText});
        const filteredData = this.state.friendsContacts.filter(item => {
            return item.name.toString().toLowerCase().search(searchedText.toLowerCase()) !== -1
        });

        let headerAddedData = [];

        if (searchedText === '') {
            headerAddedData = filteredData;
        } else {
            headerAddedData = [{name:"", number:""}].concat(filteredData);
        }

        this.setState({
            dataProvider: this.friendsDataProvider.cloneWithRows(headerAddedData)
        });

        if (headerAddedData.length == 1) {
            this.setState({
                headerLoadingMessage: "No Contacts Found!",
                showHeaderMessage: true
            });
        } else {
            this.setState({
                showHeaderMessage: false
            });
        }
        this.updateFriendsListLayout()
    }

    //Given type and data return the view component
    _rowRenderer(type, data) {
        switch (type) {
            case this.ViewTypes.HEADER_ROW: {
                return (
                    <View>
                        <View style={FriendsListStyle.listHeaderStyle}>
                            <ImageButton source={require('./../../assets/FriendsScreenAssets/sortButon.png')}/>
                            <SearchTextField title={"Search..."}
                                             value={this.state.searchedText}
                                             containerStyle={{
                                                 width: Dimensions.get("window").width - 116,
                                                 marginLeft: 8,
                                                 marginRight: 8
                                             }}
                                             onChangeText={(searchedText) => this.onSearchFriendTextChanged(searchedText)}/>
                            <ImageButton source={require('./../../assets/FriendsScreenAssets/editButton.png')}/>
                        </View>
                        {this.state.showHeaderMessage && <Text style={[Styles.pn_sm_darkGray18, {marginLeft: 16}]}>{this.state.headerLoadingMessage}</Text>}
                    </View>
                );

            }
            case this.ViewTypes.CONTACT_ROW: {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate(this.props.detination,{friendId: data.id})}>
                        <View style={FriendsListStyle.listItemContainer}>
                            <View style={FriendsListStyle.listItem}>
                                <View style={[Styles.inputViewContainer, FriendsListStyle.listImageContainer]}>
                                    <Image style={FriendsListStyle.listImage}
                                           source={require('./../../assets/FriendsScreenAssets/image1.jpeg')}/>
                                </View>
                                <View style={FriendsListStyle.listItemDetailContainer}>
                                    <View style={FriendsListStyle.listItemDetail}>
                                        <Text style={[Styles.pn_sm_darkGray18, FriendsListStyle.friendName]}>
                                            {data.name}
                                        </Text>
                                        <View style={FriendsListStyle.listItemContactImagesContainer}>
                                            <View style={FriendsListStyle.listItemContactImage}>
                                                <Image
                                                    source={require('./../../assets/FriendsScreenAssets/Phone.png')}/>
                                            </View>
                                            <View style={FriendsListStyle.listItemContactImage}>
                                                <Image
                                                    source={require('./../../assets/FriendsScreenAssets/Messages.png')}/>
                                            </View>
                                            <View style={FriendsListStyle.listItemContactImage}>
                                                <Image
                                                    source={require('./../../assets/FriendsScreenAssets/Facebook.png')}/>
                                            </View>
                                        </View>
                                        <View style={FriendsListStyle.ratingContainer}>
                                            <Rating
                                                startingValue={parseFloat(data.rating.toFixed(1))}
                                                imageSize={12}
                                                readonly
                                                type='custom'
                                                ratingImage={require('./../../assets/transparentStar.png')}
                                                ratingColor='#F8BB48'
                                                ratingBackgroundColor='#E2ECF5'
                                            />

                                            <Text style={[FriendsListStyle.ratingLabel, Styles.pn_sm_yellow14]}>
                                                {data.rating.toFixed(1)}

                                            </Text>
                                        </View>
                                    </View>
                                    <View style={FriendsListStyle.addTransactionButtonsContainer}>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate("TransactionScreen", {transactionType: 0,friendId:data.id})}>
                                            <Image
                                                source={require('./../../assets/FriendsScreenAssets/removeTransaction.png')}
                                                style={{width: 36, height: 36}}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate("TransactionScreen", {transactionType: 1,friendId:data.id})}>
                                            <Image
                                                source={require('./../../assets/FriendsScreenAssets/addTransaction.png')}
                                                style={{width: 36, height: 36}}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </TouchableOpacity>

                );
            }
            default: {
                return null
            }
        }

    }

    render() {

        return (
            <RecyclerListView style={{height: Dimensions.get('window').height - 250}}
                              layoutProvider={this.friendsListLayoutProvider}
                              onScroll={(rawEvent, offsetX, offsetY) => {
                                  Keyboard.dismiss()
                              }} dataProvider={this.state.dataProvider}
                              rowRenderer={this._rowRenderer}
            />
        );
    }
}
const FriendsListStyle = StyleSheet.create({
    listItemContainer: {
        borderBottomColor: '#E7E7E7',
        borderBottomWidth: 1
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',

        height: 72,
        marginRight: 18,
        marginLeft: 18,

    },
    listHeaderStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 8,
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 15

    },
    listImageContainer: {
        marginLeft: 0,
        marginRight: 0
    },
    listImage: {
        height: 48,
        width: 48,
        borderRadius: 24,
        resizeMode: 'cover',

    },
    listItemDetailContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    listItemDetail: {
        flexDirection: 'column',
        justifyContent: 'center',

        height: 65,
        paddingTop: 6,
        paddingBottom: 6,
        marginLeft: 6,
        width: Dimensions.get("window").width / 2,
    },
    friendName: {
        marginLeft: 8,
        fontSize: 0.04 * Dimensions.get("window").width
    },
    listItemContactImagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    listItemContactImage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        marginLeft: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        shadowColor: "#9DA0B3",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        justifyContent: 'flex-start',
        marginTop: 4
    },
    addTransactionButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 80
    },
    ratingLabel: {
        marginLeft: 10,
    }
});

import React, {Component} from 'react';
import {
    Dimensions,
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    Switch,
    Platform,
    Modal,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    TouchableOpacity,
    TouchableHighlight,
    DatePickerIOS,
    Image,
} from 'react-native';
import RadioGroup from 'react-native-custom-radio-group';
import SearchTextField from '../Components/SearchTextField';
import SimpleTextField from './../Components/SimpleTextField';
import CategoryTextField from './../Components/CategoryTextField';
import DatePicker from 'react-native-datepicker'
import {Rating} from 'react-native-elements';
import ImageButton from "../Components/ImageButton";
import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';
import Styles from './../Styles';
import Popover from 'react-native-popover-view';
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";
import realmModel from './../Models/Realm';

export default class Transaction extends Component {
    static navigationOptions = {header: null}; // hide the default header of the navigation of react native
    friendsDataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    categoriesDataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    constructor(props) {
        super(props);

        console.log(Array.from(realmModel.objects('TransactionModel')));

        let {width} = Dimensions.get("window");
        this._layoutListProvider = new LayoutProvider(
            index => {
                return 1;
            },
            (type, dim) => {
                dim.width = width;
                dim.height = 36;
            }
        );

        let realmCategoriesObjects = Array.from(realmModel.objects('CategoryModel'));
        let allCategories = realmCategoriesObjects.map((category) => {
            return category.categoryName;
        });


        let allFriends = Array.from(realmModel.objects('FriendModel'));
        let friends = allFriends.map((contact) => {
            return {id: contact.id, name: contact.name};
        });

        let selectedFriend = (friends.filter((friend) => friend.id === this.props.navigation.getParam('friendId')))[0];


        this.data = friends
        this.categories = allCategories
        this.state = {
            activeSwitch: String(this.props.navigation.getParam('transactionType')),
            isIOSdateModalVisible: false,
            chosenDate: new Date(),
            tempDate : new Date(),
            platform: Platform.OS,

            friendsDataProvider: this.friendsDataProvider.cloneWithRows(this.data),
            categoriesDataProvider: this.categoriesDataProvider.cloneWithRows(this.categories),

            isSearchFriendPopoverVisible: false,
            isSearchCategoryPopoverVisible: false,

            searchFriendText: selectedFriend ? selectedFriend.name : '',
            searchCategoryText: '',

            amount: '',
            note: '',
            repeatingAccount: false,
            rating: 0.0,

            friendsListHeight: 216,
            categoriesListHeight: 216,

        };

        this.setIOSdateModalVisible = this.setIOSdateModalVisible.bind(this);
        this._rowFriendRenderer.bind(this);
        this.saveTransaction.bind(this);
    }

    onFriendInputTextInputFocused() {

        if (!this.state.isSearchFriendPopoverVisible) {
            this.showSearchFriendPopover()
        }

        let searchFriendText = this.state.searchFriendText
        let filteredData = this.data.filter(item => {
            return item.name.toLowerCase().search(searchFriendText.toLowerCase()) !== -1
        });

        if (filteredData.length < 6) {
            this.setState({
                friendsDataProvider: this.friendsDataProvider.cloneWithRows(filteredData),
                friendsListHeight: 36 * (filteredData.length !== 0 ? filteredData.length : 1)
            });
            if (filteredData.length == 0) {
                this.closeSearchFriendPopover()
            }
        } else if (filteredData.length >= 6) {
            this.setState({
                friendsDataProvider: this.friendsDataProvider.cloneWithRows(filteredData),
                friendsListHeight: 216
            });
        }

    }

    onFriendInputTextChanged(searchFriendText) {

        this.setState({searchFriendText});
        this.showSearchFriendPopover();
        if (this.friendListRef) {
            this.friendListRef.scrollToIndex(0, true);
        }
        let filteredData = this.data.filter(item => {
            return item.name.toLowerCase().search(searchFriendText.toLowerCase()) !== -1
        });

        if (filteredData.length < 6) {
            this.setState({
                friendsDataProvider: this.friendsDataProvider.cloneWithRows(filteredData),
                friendsListHeight: 36 * (filteredData.length !== 0 ? filteredData.length : 1)
            });
            if (filteredData.length == 0) {
                this.closeSearchFriendPopover()
            }
        } else if (filteredData.length >= 6) {
            this.setState({
                friendsDataProvider: this.friendsDataProvider.cloneWithRows(filteredData),
                friendsListHeight: 216
            });
        }

    }

    onCategoriesInputTextInputFocused() {

        if (!this.state.isSearchCategoryPopoverVisible) {
            this.showCategoriesPopover()
        }

        let searchCategoryText = this.state.searchCategoryText

        let filteredData = this.categories.filter(item => {
            return item.toLowerCase().search(searchCategoryText.toLowerCase()) !== -1
        });

        if (filteredData.length < 6) {
            this.setState({
                categoriesDataProvider: this.categoriesDataProvider.cloneWithRows(filteredData),
                categoriesListHeight: 36 * (filteredData.length !== 0 ? filteredData.length : 1)
            });
            if (filteredData.length == 0) {
                this.closeCategoriesPopover()
            }
        } else if (filteredData.length >= 6) {
            this.setState({
                categoriesDataProvider: this.categoriesDataProvider.cloneWithRows(filteredData),
                categoriesListHeight: 216
            });
        }

    }

    onCategoriesInputTextChanged(searchCategoryText) {

        this.setState({searchCategoryText});
        this.showCategoriesPopover();

        if (this.categoriesListRef) {
            this.categoriesListRef.scrollToIndex(0, true);
        }

        let filteredData = this.categories.filter(item => {
            return item.toLowerCase().search(searchCategoryText.toLowerCase()) !== -1
        });

        if (filteredData.length < 6) {
            this.setState({
                categoriesDataProvider: this.categoriesDataProvider.cloneWithRows(filteredData),
                categoriesListHeight: 36 * (filteredData.length !== 0 ? filteredData.length : 1)
            });
            if (filteredData.length == 0) {
                this.closeCategoriesPopover()
            }
        } else if (filteredData.length >= 6) {
            this.setState({
                categoriesDataProvider: this.categoriesDataProvider.cloneWithRows(filteredData),
                categoriesListHeight: 216
            });
        }

    }

    setIOSdateModalVisible(visible) {
        this.setState({isIOSdateModalVisible: visible});
    }

    showSearchFriendPopover() {
        this.setState({isSearchFriendPopoverVisible: true});
    }

    closeSearchFriendPopover() {
        this.setState({isSearchFriendPopoverVisible: false});
    }

    showCategoriesPopover() {
        this.setState({isSearchCategoryPopoverVisible: true});
    }

    closeCategoriesPopover() {
        this.setState({isSearchCategoryPopoverVisible: false});
    }

    _rowFriendRenderer(type, data) {
        return (
            <TouchableOpacity
                onPress={() =>
                {
                    this.extendedState.setState({searchFriendText: data.name})
                    this.extendedState.closeSearchFriendPopover()}
                }
            >
                <View style={TransactionScreenStyle.friendsListRowContainer}>
                    <Text
                        style={[Styles.pn_sm_white18, {fontSize: 0.04 * Dimensions.get("window").width}]}>{data.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _rowCategoryRenderer(type, data) {
        return (
            <TouchableOpacity
                onPress={() =>
                {
                    this.extendedState.setState({searchCategoryText: data})
                    this.extendedState.closeCategoriesPopover()}
                }

            >
                <View style={TransactionScreenStyle.friendsListRowContainer}>
                    <Text style={Styles.pn_sm_white18}>{data}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    friendsPopoverStyle() {
        return {
            width: Dimensions.get('window').width - 140,
            height: this.state.friendsListHeight,
            backgroundColor: '#4D4F5C'
        }
    }

    categoriesPopoverStyle() {
        return {
            width: Dimensions.get('window').width - 140,
            height: this.state.categoriesListHeight,
            backgroundColor: '#4D4F5C'
        }
    }

    showAlert(msg) {
        Alert.alert('Failed', msg, [{text: 'OK'},]);
    }

    saveTransaction() {
        let amountRegex = /^(?=.*[1-9])\d{0,20}(\.\d{1,2})?$/;
        if (this.state.searchFriendText.trim() === '') {
            this.showAlert("Name is required!")
        } else if (this.state.amount.trim() === '') {
            this.showAlert("Amount is required!")
        } else if (!amountRegex.test(this.state.amount.trim())) {
            this.showAlert("Invalid Amount!")
        } else if (this.state.note.trim() === '') {
            this.showAlert("Note is required!")
        } else if (this.state.searchCategoryText.trim() === '') {
            this.showAlert("Category is required!")
        } else {
            console.log("saving");
            let transactionId = Array.from(realmModel.objects('TransactionModel')) ? Array.from(realmModel.objects('TransactionModel')).length : 0;
            let friendId = this.saveFriendIfNot(this.state.searchFriendText.trim());
            let categoryId = this.saveCategoryIfNot(this.state.searchCategoryText.trim());
            let type = parseInt(this.state.activeSwitch);
            let amount = parseFloat(this.state.amount);
            let note = this.state.note;
            let repeatingAccount = this.state.repeatingAccount;
            let date = this.state.chosenDate;
            let rating = parseFloat(this.state.rating);

            let selectedFriend = (Array.from((realmModel.objects('FriendModel')).filtered(`id = "${friendId}"`)))[0];

            let totalTransactionsWithSelectedFriend = ((realmModel.objects('TransactionModel')).filtered(`friendId = "${friendId}"`)).length;
            if (totalTransactionsWithSelectedFriend > 0) {
                console.log("exiting rating", selectedFriend.rating);
                let totalRating = parseFloat(selectedFriend.rating) + rating
                if ((totalRating === 0.0 || totalRating === 0)) {
                    rating = 0.0
                } else {
                    rating = (totalRating) / 2
                }
            }
            rating = parseFloat(rating.toFixed(1));
            console.log("new rating", rating);

            try {
                realmModel.write(() => {
                    realmModel.create('TransactionModel', {
                        id: transactionId,
                        friendId: friendId,
                        categoryId: categoryId,
                        type: type, // 0 for given 1 for received
                        amount: amount,
                        note: note,
                        repeatingAccount: repeatingAccount,
                        date: date
                    })
                    selectedFriend.rating = rating;
                    const {goBack} = this.props.navigation;
                    Alert.alert('Success', "Transaction Saved Successfully", [{text: 'OK', onPress: () => goBack()},]);
                })

            } catch (error) {
                this.showAlert(error);
            }

        }

    }

    saveFriendIfNot(friendName) {
        let realmObjects = Array.from(realmModel.objects('FriendModel'));
        let friendNames = realmObjects.map((contact) => {
            return {id: contact.id, name: contact.name};
        });
        let selectedFriend = (friendNames.filter((friend) => friend.name === friendName));
        if (selectedFriend.length > 0) {
            return selectedFriend[0].id
        } else {
            let id = realmObjects ? realmObjects.length : 0
            realmModel.write(() => {
                realmModel.create('FriendModel', {
                    id: id,
                    name: friendName,
                    number: '',
                    rating: 0.0
                })
            })
            return id;
        }
    }

    saveCategoryIfNot(categoryName) {
        let realmObjects = Array.from(realmModel.objects('CategoryModel'));
        let allCategories = realmObjects.map((category) => {
            return {id: category.id, categoryName: category.categoryName};
        });
        let selectedCategory = (allCategories.filter((category) => category.categoryName === categoryName));
        if (selectedCategory.length > 0) {
            return selectedCategory[0].id
        } else {
            let id = realmObjects ? realmObjects.length : 0
            realmModel.write(() => {
                realmModel.create('CategoryModel', {
                    id: id,
                    categoryName: categoryName,
                })
            })
            return id;
        }
    }

    render() {
        const {goBack} = this.props.navigation;
        return (
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={(Platform.OS === 'ios') ? "padding" : null}>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isIOSdateModalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>

                    <SafeAreaView style={TransactionScreenStyle.modalSafeArea}>
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 12
                        }}>

                            <Calendar
                                onChange={
                                    (date) => {
                                        let selectedDate = date.toDate();
                                        let hours = this.state.tempDate.getHours();
                                        selectedDate.setHours(hours);
                                        let minutes = this.state.tempDate.getMinutes()
                                        selectedDate.setMinutes(minutes);
                                        let milliseconds = this.state.tempDate.getMilliseconds();
                                        selectedDate.setMilliseconds(milliseconds);
                                        this.setState({tempDate: selectedDate})
                                    }
                                }
                                selected={new Moment(this.state.tempDate)}
                                style={{
                                    height: 275,

                                }}
                                minDate={Moment("19800101", "YYYYMMDD")}
                                maxDate={Moment().add(50, 'years')}

                                daySelectedText={[{
                                    borderWidth: 1,
                                    fontSize: 14,
                                    fontFamily: 'ProximaNova-Semibold',
                                    color: '#31323A',
                                }]}
                                barText={Styles.pn_r_darkGray18}
                                dayHeaderText={Styles.pn_r_darkGray14}
                                dayText={Styles.pn_r_darkGray14}
                                monthText={Styles.pn_r_darkGray14}
                                yearText={Styles.pn_r_darkGray14}
                            />

                            <DatePickerIOS
                                onDateChange={(time) => {
                                    let selectedDate = this.state.tempDate
                                    selectedDate.setHours(time.getHours());
                                    selectedDate.setMinutes(time.getMinutes());
                                    selectedDate.setMilliseconds(time.getMilliseconds());
                                    this.setState({tempDate: selectedDate});

                                }}
                                date={this.state.tempDate}
                                mode={"time"}
                                style={Styles.pn_r_darkGray14}
                            />

                            <View style={TransactionScreenStyle.modalButtons}>
                                <ImageButton
                                    title={"Cancel"}
                                    onPress={() => {
                                        this.setIOSdateModalVisible(!this.state.isIOSdateModalVisible);
                                    }}
                                    source={require('./../../assets/TransectionScreenAssets/cancelButton.png')}
                                />
                                <ImageButton
                                    title={"Ok"}
                                    onPress={() => {
                                        this.setIOSdateModalVisible(!this.state.isIOSdateModalVisible);
                                        this.setState({chosenDate:this.state.tempDate});
                                        console.log(this.state.chosenDate)
                                    }}
                                    source={require('./../../assets/TransectionScreenAssets/saveButton.png')}
                                />

                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
                <SafeAreaView style={Styles.safeAreaView}>
                    <View style={Styles.headerContainer}>
                        <TouchableOpacity onPress={() => goBack()}
                                          style={Styles.headerBackButton}>
                            <Text style={Styles.pn_r_white18}>Back</Text>
                        </TouchableOpacity>
                        <Text style={Styles.pn_r_white18}>Transactions</Text>
                        <TouchableOpacity onPress={()=> this.saveTransaction()} style={Styles.headerBackButton}>
                            <Text style={Styles.pn_r_white18}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <SearchTextField
                            containerStyle={{marginTop: 24}}
                            title={"Search for a friend..."}
                            value={this.state.searchFriendText}
                            onChangeText={(searchFriendText) => this.onFriendInputTextChanged(searchFriendText)}
                            onFocus={() => this.onFriendInputTextInputFocused()}
                            ref={ref => this.friendSearchTextInput = ref}
                        />

                        <View style={TransactionScreenStyle.radioGroup}>
                            <RadioGroup
                                initialValue={this.state.activeSwitch}
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
                                    borderColor: '#4D4F5C'
                                }}
                                buttonContainerActiveStyle={Styles.darkGrayBackground}
                                buttonContainerInactiveStyle={Styles.whiteBackground}
                                buttonTextActiveStyle={Styles.pn_sm_white18}
                                buttonTextInactiveStyle={Styles.pn_sm_darkGray18}

                                radioGroupList={[{
                                    label: 'Given',
                                    value: '0'
                                }, {
                                    label: 'Received',
                                    value: '1'
                                }]}
                                onChange={(value) => this.setState({activeSwitch: value})}
                            />
                        </View>
                        <SimpleTextField
                            placeholder={"Enter Amount"}
                            keyboardType={'numeric'}
                            onChangeText={(text) => this.setState({amount: text})}
                            maxLength={20}
                        />
                        <SimpleTextField
                            placeholder={"Add Note"}
                            onChangeText={(text) => this.setState({note: text})}
                        />
                        <CategoryTextField
                            title={"Category"}
                            value={this.state.searchCategoryText}
                            onChangeText={(searchCategoryText) => this.onCategoriesInputTextChanged(searchCategoryText)}
                            onFocus={() => this.onCategoriesInputTextInputFocused()}
                            ref={ref => this.categoriesSearchTextInput = ref}
                            categoryIconPressed={()=>this.onCategoriesInputTextInputFocused()}
                        />
                        <TouchableHighlight style={[Styles.inputViewContainer, TransactionScreenStyle.switchContainer]}
                                            underlayColor={'white'}
                                            onPress={() => this.setState({repeatingAccount: !this.state.repeatingAccount})}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flex: 1
                            }}>
                                <Text style={Styles.pn_r_darkGray14}>Repeating account?</Text>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .8}]}}
                                        value={this.state.repeatingAccount}
                                        onChange={() => this.setState({repeatingAccount: !this.state.repeatingAccount})}/>
                            </View>
                        </TouchableHighlight>


                        {this.state.platform == "ios" &&
                        <TouchableOpacity style={[Styles.inputViewContainer, TransactionScreenStyle.switchContainer]}
                                          onPress={() => {
                                              this.setIOSdateModalVisible(true);
                                          }}>
                            <Text
                                style={Styles.pn_r_darkGray14}>{Moment(this.state.chosenDate).format('D-MMMM-YYYY, h:mm a')}</Text>
                            <Image style={{right: 8, width: 30, height: 28}}
                                   source={require('./../../assets/TransectionScreenAssets/calendar.png')}/>
                        </TouchableOpacity>
                        }

                        {this.state.platform == "android" &&
                        <View style={{
                            marginTop: 8,
                        }}>
                            <View style={Styles.inputViewContainer}>
                                <DatePicker
                                    style={{
                                        width: Dimensions.get('window').width - 96,
                                    }}

                                    date={this.state.chosenDate}
                                    minDate={"01-01-1980"}
                                    maxDate={"31-12-2069"}
                                    mode="datetime"
                                    placeholder="Select Datetime"
                                    format="D-MMMM-YYYY, h:mm a"
                                    confirmBtnText="Confirm"
                                    iconSource={require('./../../assets/TransectionScreenAssets/calendar.png')}
                                    cancelBtnText="Cancel"

                                    customStyles={{
                                        dateIcon: {
                                            right: 20,
                                        },
                                        dateInput: {
                                            borderWidth: 0,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            paddingLeft: 18,
                                        }
                                    }}
                                    allowFontScaling={true}
                                    onDateChange={(date) => {

                                        let selectedDate = new Date(date);

                                        this.setState({chosenDate: selectedDate});
                                        console.log(this.state.chosenDate)
                                    }}
                                />
                            </View>
                        </View>
                        }
                        <View style={[TransactionScreenStyle.ratingViewContainer, Styles.inputViewContainer]}>
                            <Rating
                                startingValue={0}
                                imageSize={24}
                                fractions={2}
                                type='custom'
                                ratingImage={require('./../../assets/transparentStar.png')}
                                ratingColor='#F8BB48'
                                ratingBackgroundColor='#E2ECF5'
                                onFinishRating={(rating) => {
                                    this.setState({rating: rating});
                                }}
                            />
                            <Text style={TransactionScreenStyle.ratingLabel}>
                                0.0
                            </Text>
                        </View>
                        <View style={TransactionScreenStyle.saveButtonContainer}>
                            <TouchableOpacity style={[Styles.inputViewContainer, {
                                width: Dimensions.get('window').width - 160,
                                backgroundColor: '#31323A',
                                justifyContent: 'center'
                            }]}
                                              onPress={() => {
                                                  this.saveTransaction()
                                              }}>
                                <Text style={Styles.pn_r_white18}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                    <Popover
                        fromView={this.friendSearchTextInput}
                        popoverStyle={this.friendsPopoverStyle()}
                        isVisible={this.state.isSearchFriendPopoverVisible}
                        showInModal={false}
                        showBackground={false}
                        onClose={() => this.closeSearchFriendPopover()}>
                        <RecyclerListView
                            layoutProvider={this._layoutListProvider}
                            dataProvider={this.state.friendsDataProvider}
                            rowRenderer={this._rowFriendRenderer}
                            extendedState={this}
                            ref={(ref) => {
                                this.friendListRef = ref;
                            }}
                        />
                    </Popover>
                    <Popover
                        fromView={this.categoriesSearchTextInput}
                        popoverStyle={this.categoriesPopoverStyle()}
                        isVisible={this.state.isSearchCategoryPopoverVisible}
                        showInModal={false}
                        showBackground={false}
                        onClose={() => this.closeCategoriesPopover()}>
                        <RecyclerListView
                            extendedState={this}
                            layoutProvider={this._layoutListProvider}
                            dataProvider={this.state.categoriesDataProvider}
                            rowRenderer={this._rowCategoryRenderer}
                            ref={(ref) => {
                                this.categoriesListRef = ref;
                            }}
                        />
                    </Popover>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}
const TransactionScreenStyle = StyleSheet.create({

    modalSafeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft:14,
        marginRight:14,
        marginBottom:12
    },
    friendsListRowContainer: {
        height: 36,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    searchTextFieldLabel: {
        alignSelf: 'center',
        marginLeft: 52,
        marginRight: 52,
        marginTop: 16,
        marginBottom: 8,
        color: '#31323A',
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'ProximaNova-Semibold',
    },

    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    radioGroup: {
        marginTop: 8,
        marginBottom: 8,
        alignSelf: 'center'
    },
    switchContainer: {
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 4,
    },
    ratingViewContainer: {
        width: Dimensions.get('window').width - 160,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    ratingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        color: '#FEC75C',
        fontSize: 24,
        fontFamily: 'ProximaNova-SemiBold',
    },
    saveButtonContainer: {
        marginTop: 8,
        alignSelf: 'center',
    },

});
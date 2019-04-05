import React, {Component} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageButton from '../Components/ImageButton';
import DataProvider from "recyclerlistview/dist/reactnative/core/dependencies/DataProvider";
import LayoutProvider from "recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider";
import RecyclerListView from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import Styles from '../Styles'
import realmModel from "../Models/Realm";

export default class Relationship extends Component {
    static navigationOptions = {header: null}; // hide the default header of the navigation of react native

    constructor(args) {
        super(args);

        let {width} = Dimensions.get("window");

        let dataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });

        this._layoutProvider = new LayoutProvider(
            index => {
                return 1;
            },
            (type, dim) => {
                dim.width = width;
                dim.height = 66;
            }
        );

        let friendId = this.props.navigation.getParam('friendId');
        let friendTransactions = Array.from((realmModel.objects('TransactionModel')).filtered(`friendId = "${friendId}"`));
        let friendObject = Array.from(realmModel.objects('FriendModel').filtered(`id = "${friendId}"`))[0];

        let totalGiven = 0.0;
        let totalReceived = 0.0;
        let owesMe = 300.0;
        let owesHim = 550.0;

        friendTransactions.map((transaction) => {
            if (transaction.type == 0) { //given
                totalGiven += transaction.amount

            } else { // received
                totalReceived += transaction.amount
            }
        });

        this._rowRenderer = this._rowRenderer.bind(this);

        const max = Math.max.apply(Math, [totalReceived, totalGiven, owesMe, owesHim]);
        console.log(max);
        let graphCenterColor = ""
        switch (max) {
            case totalReceived: {
                graphCenterColor = "#5CD8FC";
                break;
            }
            case totalGiven: {
                graphCenterColor = "#FD8476";
                break;
            }
            case owesHim : {
                graphCenterColor ="#FED989";
                break;
            }
            case owesMe : {
                graphCenterColor = "#A3A2F8";
                break;
            }
            default: {
                break;
            }
        }

        this.state = {
            dataProvider: dataProvider.cloneWithRows(
                friendTransactions
            ),
            friendObject:friendObject,
            totalGiven: totalGiven,
            totalReceived: totalReceived,
            owesMe: owesMe,
            owesHim: owesHim,
            graphCenterColor: graphCenterColor
        };


    }

    _rowRenderer(type, data) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return (
            <View>
                <View style={RelationshipStyle.listItemContainer}>
                    <View style={RelationshipStyle.listItem}>
                        <Text style={[RelationshipStyle.dateLabel, Styles.pn_sm_darkGray10]}>
                            {new Date() <= data.date && <Text>Processing</Text>}
                            {new Date() > data.date &&
                            <Text>{monthNames[data.date.getMonth()]} {data.date.getFullYear()}</Text>}
                        </Text>
                        <View style={RelationshipStyle.listItemDetail}>
                            <View style={RelationshipStyle.transactionReason}>
                                <View style={RelationshipStyle.transactionIconContainer}>
                                    <Image style={RelationshipStyle.transactionIcon}
                                           source={require('./../../assets/RelationshipScreenAssets/giftbox-1.png')}/>
                                </View>
                                <Text
                                    style={[RelationshipStyle.transactionTitle, Styles.pn_sm_darkGray14]}> {data.note}</Text>
                            </View>


                            {data.type === 0 &&
                            <View style={RelationshipStyle.transactionAmountContainer}>
                                <Icon name="chevron-down" size={14} color={'#FC104A'}/>
                                <Text
                                    style={[RelationshipStyle.transactionAmount, Styles.pm_b_darkGray14]}>-{data.amount}</Text>
                            </View>
                            }
                            {data.type === 1 &&
                            <View style={RelationshipStyle.transactionAmountContainer}>
                                <Icon name="chevron-up" size={14} color={'#1DA9FC'}/>
                                <Text
                                    style={[RelationshipStyle.transactionAmount, Styles.pm_b_darkGray14]}>+{data.amount}</Text>
                            </View>
                            }


                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const {goBack} = this.props.navigation;
        const data = [this.state.owesHim, this.state.totalGiven, this.state.totalReceived, this.state.owesMe];
        const colors = ['#A3A2F8', '#FD8476', '#5CD8FC', '#FED989'];
        const pieData = data
            .filter(value => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: colors[index],
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
            }))
        return (
            <SafeAreaView style={[Styles.safeAreaView, RelationshipStyle.safeAreaStyle]}>
                <View style={RelationshipStyle.mainView}>
                    <TouchableOpacity onPress={() => goBack()}
                                      style={Styles.headerBackButton}>
                        <Text style={Styles.pn_r_white18}>Back</Text>
                    </TouchableOpacity>
                    <Text style={Styles.pn_r_white18}>Relationship with</Text>
                    <TouchableOpacity>
                        <Image source={require('./../../assets/settingsButton.png')}/>
                    </TouchableOpacity>
                </View>

                <View style={RelationshipStyle.profileContainer}>
                    <View style={RelationshipStyle.profilePictureContainer}>
                        <Image style={RelationshipStyle.profilePicture}
                               source={require('./../../assets/RelationshipScreenAssets/dpImage.jpeg')}/>
                    </View>
                    <Text style={[RelationshipStyle.nameContainer, Styles.pn_sm_darkGray18]}>
                        {this.state.friendObject.name}
                    </Text>
                    <View style={RelationshipStyle.profileButtonsContainer}>
                        <TouchableOpacity style={RelationshipStyle.profileButton}>
                            <Image
                                source={require('./../../assets/FriendsScreenAssets/Phone.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={RelationshipStyle.profileButton}>
                            <Image
                                source={require('./../../assets/FriendsScreenAssets/Messages.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={RelationshipStyle.profileButton}>
                            <Image
                                source={require('./../../assets/FriendsScreenAssets/Facebook.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={RelationshipStyle.graphContainer}>
                    <Text style={[RelationshipStyle.graphHeaderLabel, Styles.pn_sm_darkGray14]}>
                        Summary
                    </Text>
                    <View style={RelationshipStyle.pieChartStyle}>
                        <PieChart
                            padAngle={0}
                            style={{
                                height: 94,
                                width: 94,
                                marginTop: 10,
                            }}
                            data={pieData}
                        >
                            <View style={RelationshipStyle.pieChartInnerContainer}>
                                <View style={RelationshipStyle.graphInnerLabelContainer}>


                                    <Icon name="chevron-up" size={8} color={this.state.graphCenterColor}
                                    />
                                    <Text style={RelationshipStyle.graphInnerLabel}>
                                        ${Math.max.apply(Math, [this.state.totalReceived, this.state.totalGiven, this.state.owesMe, this.state.owesHim])}
                                    </Text>
                                </View>
                            </View>
                        </PieChart>
                        <View>
                            <View style={RelationshipStyle.graphOuterLabelContainer}>
                                <Icon name="circle-o" size={14} color={'#FD8476'}/>
                                <Text style={[RelationshipStyle.graphOuterLabel, Styles.pn_sm_darkGray14]}>
                                    Total given: ${this.state.totalGiven}
                                </Text>
                            </View>
                            <View style={RelationshipStyle.graphOuterLabelContainer}>
                                <Icon name="circle-o" size={14} color={'#5CD8FC'}/>
                                <Text style={[RelationshipStyle.graphOuterLabel, Styles.pn_sm_darkGray14]}>
                                    Total received: ${this.state.totalReceived}
                                </Text>
                            </View>
                            <View style={RelationshipStyle.graphOuterLabelContainer}>
                                <Icon name="circle-o" size={14} color={'#FED989'}/>
                                <Text style={[RelationshipStyle.graphOuterLabel, Styles.pn_sm_darkGray14]}>
                                    Owes me: ${this.state.owesMe}
                                </Text>
                            </View>
                            <View style={RelationshipStyle.graphOuterLabelContainer}>
                                <Icon name="circle-o" size={14} color={'#A3A2F8'}/>
                                <Text style={[RelationshipStyle.graphOuterLabel, Styles.pn_sm_darkGray14]}>
                                    Ow him: ${this.state.owesHim}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={RelationshipStyle.smallButtonsContainer}>
                    <ImageButton source={require('./../../assets/FriendsScreenAssets/sortButon.png')}/>
                    <ImageButton source={require('./../../assets/FriendsScreenAssets/exportButton.png')}/>
                </View>
                <View style={RelationshipStyle.listContainer}>
                    <RecyclerListView layoutProvider={this._layoutProvider} dataProvider={this.state.dataProvider}
                                      rowRenderer={this._rowRenderer}/>
                </View>
            </SafeAreaView>
        )
    }
}
const RelationshipStyle = StyleSheet.create({
    safeAreaStyle: {
        backgroundColor: '#EEEEEE'
    },

    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        paddingLeft: 21,
        paddingRight: 21,
        backgroundColor: "#34363E",
        justifyContent: 'space-between',

        shadowColor: "#31323A",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },

    headerTitleStyle: {
        fontFamily: 'ProximaNova-Regular',
        fontSize: 18,
        color: '#FFFFFF',
    },
    backButtonStyle: {
        fontFamily: 'ProximaNova-Regular',
        fontSize: 18,
        color: '#FFFFFF',
    },

    profileContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    profilePictureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        height: 48,
        width: 48,
        borderRadius: 24,

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
    profilePicture: {
        height: 48,
        width: 48,
        borderRadius: 24,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    nameContainer: {
        marginTop: 4,
        alignSelf: 'center'
    },
    profileButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginRight: 24
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        marginLeft: 24,
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
    graphContainer: {
        backgroundColor: 'white',
        marginTop: 8,
        shadowColor: "#9DA0B3",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        paddingBottom: 12,
    },
    pieChartStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 42,
        marginRight: 42
    },
    pieChartInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    graphOuterLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },

    graphHeaderLabel: {
        marginTop: 12,
        marginLeft: 12,
    },
    graphOuterLabel: {
        marginLeft: 4
    },
    graphInnerLabelContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    graphInnerLabel: {
        color: '#5CD8FC',
        fontSize: 10,
        fontFamily: 'ProximaNova-SemiBold',
    },
    smallButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 12,
    },
    listContainer: {
        flex: 4
    },
    listItemContainer: {
        borderBottomColor: '#E7E7E7',
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    listItem: {
        height: 65,
        marginRight: 18,
        marginLeft: 18,
    },
    dateLabel: {
        marginTop: 10,
        marginBottom: 4
    },
    listItemDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10
    },
    transactionReason: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        height: 14,
        width: 12,
    },
    transactionIcon: {
        height: 14,
        width: 12,
        resizeMode: 'cover',
    },
    transactionTitle: {
        marginLeft: 10
    },
    transactionAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    transactionAmount: {
        marginLeft: 10
    }

});
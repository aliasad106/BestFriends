import React, {Component} from 'react';
import {Platform, View, TextInput, StyleSheet, Image} from 'react-native';
import Styles from './../Styles';

export default class SearchTextField extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[Styles.inputViewContainer, this.props.containerStyle ? this.props.containerStyle : {}]}>
                <Image source={require('../../assets/FriendsScreenAssets/SearchIcon.png')}
                       style={SearchTextFieldStyle.textFieldIconImage}/>
                <TextInput
                    style={[Styles.pn_r_lightGray18, SearchTextFieldStyle.textFieldStyle]}
                    placeholder={this.props.title ? this.props.title : ''}
                    value={this.props.value ? this.props.value : ''}
                    onFocus={() => this.props.onFocus ? this.props.onFocus() : null}
                    onChangeText={(searchedText) => this.props.onChangeText ? this.props.onChangeText(searchedText) : null}
                />
            </View>
        );
    }
}
const SearchTextFieldStyle = StyleSheet.create({
    textFieldIconImage: {
        width: 14,
        height: 14,
        marginLeft: 18,
    },
    textFieldStyle: {
        color: 'black',
        marginLeft: 14,

        flex: 1,
        ...Platform.select({
            ios: {
                height: 30,
            },
            android: {
                height: 42,
                fontSize: 14,
            },
        }),

    }
});

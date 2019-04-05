import React, {Component} from 'react';
import {Platform, View, TextInput, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from './../Styles';

export default class CategoryTextField extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={Styles.inputViewContainer}>
                <TextInput style={[Styles.pn_r_lightGray18, SearchTextFieldStyle.textFieldStyle]}
                           placeholder={this.props.title}
                           value={this.props.value ? this.props.value : ''}
                           onFocus={() => this.props.onFocus ? this.props.onFocus() : null}
                           onChangeText={(searchedText) => this.props.onChangeText?this.props.onChangeText(searchedText):null}
                />
                <Icon name="chevron-down" style={SearchTextFieldStyle.dropDownIcon} onPress={()=>this.props.categoryIconPressed?this.props.categoryIconPressed():null}/>
            </View>
        );
    }
}
const SearchTextFieldStyle = StyleSheet.create({
    dropDownIcon: {
        width: 14,
        height: 14,
        marginRight: 18,
        color: '#9DA0B3',
    },
    textFieldStyle: {
        textAlign: 'center',
        marginLeft: 14,
        color: 'black',
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

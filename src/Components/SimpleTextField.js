import React, {Component} from 'react';
import {Platform, View, TextInput, StyleSheet, Image} from 'react-native';
import Styles from './../Styles';

export default class SimpleTextField extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(text) {
        this.props.handleOnChange(text);
    }

    render() {

        return (
            <View style={Styles.inputViewContainer}>
                <TextInput
                    style={[Styles.pn_r_lightGray18,SearchTextFieldStyle.textFieldStyle]}
                    placeholder={this.props.placeholder?this.props.placeholder:null}
                    keyboardType={this.props.keyboardType?this.props.keyboardType:'default'}
                    onChangeText={(text) => this.props.onChangeText ? this.props.onChangeText(text) : null}
                    maxLength={this.props.maxLength?this.props.maxLength:null}
                />
            </View>
        );
    }
}
const SearchTextFieldStyle = StyleSheet.create({
    textFieldStyle: {
        flex: 1,
        color:'black',
        textAlign:'center',
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

import React, {Component} from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import Styles from "../Styles";

export default class ImageButton extends Component {
    render() {
        return (
            <TouchableOpacity style={[SmallButtonStyle.buttonStyle]}
                              onPress={this.props.onPress ? this.props.onPress : null}>
                <View>
                    <Image source={this.props.source ? this.props.source : null}
                           style={SmallButtonStyle.buttonImageStyle}/>
                </View>
            </TouchableOpacity>
        );
    }
}
const SmallButtonStyle = StyleSheet.create({
    buttonImageStyle: {
        width: 24,
        height: 24
    },
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        backgroundColor: 'white',
        shadowColor: "#9DA0B3",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 12,
    }
});
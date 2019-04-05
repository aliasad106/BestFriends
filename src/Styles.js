import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1
    },
    safeAreaView: {
        flex: 1,
        flexDirection: 'column'
    },
    headerContainer: {
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
    headerBackButton: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputViewContainer: {
        marginLeft:56,
        marginRight:56,

        flexDirection: 'row',
        alignItems:'center',

        borderRadius:100,
        backgroundColor:'white',
        shadowColor: "#9DA0B3",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,

        height: 42,
        marginTop: 8,
        marginBottom:8
    },
    whiteBackground:{
        backgroundColor: 'white',
    },
    lightGrayBackground: {
        backgroundColor: '#9DA0B3',
    },
    darkGrayBackground:{
        backgroundColor: '#4D4F5C',
    },

    pn_r_white18: {
        fontFamily: 'ProximaNova-Regular',
        color: '#FFFFFF',
        fontSize: 18
    },
    pn_sm_white18: {
        fontFamily: 'ProximaNova-SemiBold',
        color: '#FFFFFF',
        fontSize: 18
    },
    pn_r_lightGray18: {
        fontFamily: 'ProximaNova-Regular',
        color: '#9DA0B3',
        fontSize: 18
    },
    pn_r_lightGray14: {
        fontFamily: 'ProximaNova-Regular',
        color: '#9DA0B3',
        fontSize: 14
    },
    pn_sm_darkGray10: {
        fontFamily: 'ProximaNova-SemiBold',
        color: '#4D4F5C',
        fontSize: 10
    },
    pn_sm_darkGray14: {
        fontFamily: 'ProximaNova-SemiBold',
        color: '#4D4F5C',
        fontSize: 14
    },
    pn_r_darkGray18: {
        fontFamily: 'ProximaNova-Regular',
        color: '#4D4F5C',
        fontSize: 18
    },


    pn_sm_darkGray18: {
        fontFamily: 'ProximaNova-SemiBold',
        color: '#4D4F5C',
        fontSize: 18
    },
    pn_r_darkGray14: {
        fontFamily: 'ProximaNova-Regular',
        color: '#4D4F5C',
        fontSize: 14
    },
    pn_sm_yellow14: {
        fontFamily: 'ProximaNova-SemiBold',
        color: '#FEC75C',
        fontSize: 14
    },

    pm_b_darkGray14: {
        fontFamily: 'ProximaNova-Bold',
        color: '#4D4F5C',
        fontSize: 14
    }

});
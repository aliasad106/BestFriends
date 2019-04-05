import React from 'react';
import Friends from './src/Screens/Friends';
import Transaction from './src/Screens/Transaction';
import Relationship from './src/Screens/Relationship';

import {createStackNavigator, createAppContainer} from 'react-navigation';


const AppNavigator = createStackNavigator(
    {
        HomeScreen: Friends,
        TransactionScreen: Transaction,
        RelationshipScreen:Relationship
    },
    {
        initialRouteName: "HomeScreen"
    }
);
export default  createAppContainer(AppNavigator);
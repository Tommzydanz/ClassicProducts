import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {IClassicProductsParamList} from './interfaces';
import HomeStack from './HomeStack';
import Notification from '../screens/Notification/Notification';

const ClassicProductsStack = function ClassicProductsStack() {
  const Tab = createBottomTabNavigator<IClassicProductsParamList>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#C1BDB1'},
        tabBarStyle: {
          backgroundColor: '#efefef',
          position: 'absolute',
          marginBottom: 5, //add border top left radius
        },
      }}>
      <Tab.Screen
        name="ClassicProducts"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Icon name={'home'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name={'alarm'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ClassicProductsStack;

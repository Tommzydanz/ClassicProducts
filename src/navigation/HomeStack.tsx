import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {IHomeStackParamList} from './interfaces';
import Home from '../screens/Home/Home';
import AddProduct from '../screens/AddProduct/AddProduct';
import {Pressable, StyleSheet} from 'react-native';

const HomeStack = function HomeStack() {
  const Stack = createStackNavigator<IHomeStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#C1BDB1'},
        headerTintColor: '#1E1814',
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({navigation}) => ({
          headerTitle: 'Classic Products',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: ({tintColor}) => (
            <Pressable
              style={({pressed}) => [styles.button, pressed && styles.pressed]}
              onPress={() => navigation.navigate('AddProduct')}>
              <Icon name={'add'} size={24} color={tintColor} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{
          headerTitle: 'Upload a Product',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

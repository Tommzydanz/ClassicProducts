import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Notification = function Notification() {
  return (
    <View style={styles.rootContainer}>
      <Text>Notification</Text>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignContent: 'center',
  },
});

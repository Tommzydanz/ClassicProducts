import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotificationProps} from './interface';

const Notification: NotificationProps = function Notification() {
  const [notifications, setNotifications] = useState<any[]>();

  useEffect(() => {
    // Retrieve notifications from AsyncStorage on component mount
    const getNotifications = async () => {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    };
    getNotifications();
  }, []);

  if (!notifications || notifications.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No notification available</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.notificationContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignContent: 'center',
  },
  title: {
    fontSize: 16,
    color: 'black',
    textAlign: 'justify',
  },
  body: {
    fontSize: 12,
    color: 'black',
    textAlign: 'justify',
  },
  notificationContainer: {
    backgroundColor: '#d2d1d1',
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: 'black',
  },
});

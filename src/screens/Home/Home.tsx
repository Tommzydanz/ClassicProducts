import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Home = function Home() {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Popular</Text>
      <View>
        <Text>Home</Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

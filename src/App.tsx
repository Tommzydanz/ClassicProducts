import {useEffect} from 'react';
import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigationContainer from './navigation/AppNavigationContainer';

const App = () => {
  useEffect(function componentDidMount() {
    return function componentWillUnmount() {};
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigationContainer />
    </SafeAreaProvider>
  );
};

export default App;

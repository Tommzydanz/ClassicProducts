import {useEffect} from 'react';
import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigationContainer from './navigation/AppNavigationContainer';
import ProductProvider from './provider/ProductProvider/ProductProvider';

const App = () => {
  useEffect(function componentDidMount() {
    return function componentWillUnmount() {};
  }, []);

  return (
    <SafeAreaProvider>
      <ProductProvider>
        <AppNavigationContainer />
      </ProductProvider>
    </SafeAreaProvider>
  );
};

export default App;

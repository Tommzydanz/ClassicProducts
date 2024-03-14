import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ClassicProductsStack from './ClassicProductsStack';

const AppNavigationContainer: React.FC<{}> = function AppNavigationContainer() {
  return (
    <NavigationContainer>
      <ClassicProductsStack />
    </NavigationContainer>
  );
};

export default AppNavigationContainer;

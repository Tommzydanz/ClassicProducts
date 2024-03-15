import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {IClassicProductsStackParamList} from '../../navigation/interfaces';

export type HomeProps = React.FC<
  StackScreenProps<IClassicProductsStackParamList, 'ClassicProducts'>
>;

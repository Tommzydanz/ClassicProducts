import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {IHomeStackParamList} from '../../navigation/interfaces';

export type AddProductProps = React.FC<
  StackScreenProps<IHomeStackParamList, 'AddProduct'>
>;

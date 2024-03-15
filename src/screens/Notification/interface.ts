import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {IClassicProductsStackParamList} from '../../navigation/interfaces';

export type NotificationProps = React.FC<
  StackScreenProps<IClassicProductsStackParamList, 'Notification'>
>;

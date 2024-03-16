import React from 'react';
import {ImageSourcePropType, StyleProp, TextProps} from 'react-native';

export type IProductItemProps = React.FC<
  StyleProp<any> &
    TextProps & {
      productName: string;
      price: string;
      onPress: () => void;
      image: ImageSourcePropType;
    }
>;

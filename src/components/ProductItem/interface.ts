import React from 'react';
import {ImageSourcePropType, StyleProp, TextProps} from 'react-native';

export type IProductItemProps = React.FC<
  StyleProp<any> &
    TextProps & {
      children: React.ReactNode;
      onPress: () => void;
      image: ImageSourcePropType;
    }
>;

import React from 'react';
import {StyleProp, TextProps} from 'react-native';

export type IButtonProps = React.FC<
  StyleProp<any> &
    TextProps & {
      children: React.ReactNode;
      onPress: () => void;
    }
>;

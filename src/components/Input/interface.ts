import React from 'react';
import {KeyboardTypeOptions} from 'react-native';

export type InputProps = React.FC<{
  keyboardType: KeyboardTypeOptions;
  secure?: boolean;
  labelHolder?: string;
  value?: string;
  onUpdateValue?: (value: string) => void;
  isInvalid?: boolean;
  label: string;
}>;

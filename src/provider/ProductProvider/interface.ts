import React from 'react';

export type IProductProviderProps = React.FC<{
  children: any;
}>;

export interface IProduct {
  id: string;
  name: string | undefined;
  image: string | null;
  price: string | undefined;
}

export type IProductContext = {
  product?: IProduct;
  setProduct?: (product: IProduct) => void;
  saveProduct?: (product: IProduct) => Promise<void>;
};

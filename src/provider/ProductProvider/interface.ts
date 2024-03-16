import React from 'react';

export type IProductProviderProps = React.FC<{
  children: any;
}>;

export interface IProduct {
  id: string;
  product: string | undefined;
  productImg: string | null;
  price: string | undefined;
}

export type IProductContext = {
  product?: IProduct[];
  setProduct?: (product: IProduct[]) => void;
  saveProduct?: (products: IProduct[]) => Promise<void>;
};

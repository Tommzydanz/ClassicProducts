import React from 'react';
import {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProductContext} from './ProductContext';
import {IProduct, IProductProviderProps} from './interface';

const ProductProvider: IProductProviderProps = function ProductProvider({
  children,
}) {
  const [product, setProduct] = useState<IProduct>();

  const saveProduct = useCallback(
    async (newProduct: IProduct): Promise<void> => {
      const newProductsList = [newProduct];
      await AsyncStorage.setItem(
        'CLASSIC_PRODUCT',
        JSON.stringify(newProductsList),
      );
      setProduct(newProduct);
    },
    [],
  );

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        saveProduct,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

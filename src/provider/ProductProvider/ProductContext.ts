import {createContext, useContext, useEffect} from 'react';
import {IProductContext} from './interface';

export const ProductContext = createContext<IProductContext>({});

export const useProductContext = function useProductContext() {
  const context = useContext(ProductContext);

  useEffect(
    function componentDidMount() {
      if (context?.product === undefined) {
        console.error(
          'useQuestion can only be used where QuestionProvider is its parent',
        );
      }
    },
    [context?.product],
  );
  return useContext;
};

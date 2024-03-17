import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {HomeProps} from './interface';
import ProductItem from '../../components/ProductItem/ProductItem';
import {IProduct} from '../../provider/ProductProvider/interface';

const Home: HomeProps = function Home() {
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      const list: any = [];

      await firestore()
        .collection('products')
        .orderBy('uploadTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach(prod => {
            const {product, price, productImg} = prod.data();
            list.push({
              id: prod.id,
              product,
              price,
              productImg,
            });
          });
        });

      setProducts(list);

      if (isLoading) {
        setIsLoading(false);
      }

      console.log('Classic Products: ', list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(function componentDidMount() {
    fetchProducts();
    return function componentWillUnmount() {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <View style={styles.fallbackContainer}>
        <ActivityIndicator size={'large'} color="black" />
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          No product added yet - start adding some
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Popular</Text>
      <FlatList
        data={products}
        renderItem={({item}) => (
          <ProductItem
            productName={item.product}
            price={item.price}
            image={{uri: item.productImg}}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: 'black',
  },
});

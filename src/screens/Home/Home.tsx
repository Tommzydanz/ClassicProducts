import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {HomeProps} from './interface';
import ProductItem from '../../components/ProductItem/ProductItem';
import {IProduct} from '../../provider/ProductProvider/interface';

const Home: HomeProps = function Home() {
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
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
  }, [isLoading]);

  const deleteFirestoreData = useCallback((productId: string) => {
    firestore()
      .collection('products')
      .doc(productId)
      .delete()
      .then(() => {
        Alert.alert(
          'Product deleted.',
          'The product has been deleted successfully',
        );
      })
      .catch(err => console.log('Error deleting product from list', err));
  }, []);

  const deleteProduct = useCallback(
    (productId: string) => {
      console.log('Delete Product', productId);

      firestore()
        .collection('products')
        .doc(productId)
        .get()
        .then((documentSnapshot: any) => {
          if (documentSnapshot.exists) {
            const {productImg} = documentSnapshot.data();

            if (productImg != null) {
              const storageRef = storage().refFromURL(productImg);
              const imageRef = storage().ref(storageRef.fullPath);

              imageRef
                .delete()
                .then(() => {
                  console.log(`${productImg} has been deleted successfully`);
                  deleteFirestoreData(productId);
                  setIsDeleted(true);
                })
                .catch(e => {
                  console.log('Error while deleting product', e);
                });
            }
          }
        });
    },
    [deleteFirestoreData],
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      Alert.alert(
        'Delete Product',
        'Are you sure you want to delete this product?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => deleteProduct(productId),
          },
        ],
        {cancelable: false},
      );
    },
    [deleteProduct],
  );

  useEffect(function componentDidMount() {
    fetchProducts();
    return function componentWillUnmount() {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    function componentDidMount() {
      fetchProducts();
      setIsDeleted(false);
      return function componentWillUnmount() {};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDeleted],
  );

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
            onPress={() => handleDeleteProduct(item.id)}
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

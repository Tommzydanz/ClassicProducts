import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IProductItemProps} from './interface';

const ProductItem: IProductItemProps = function ProductItem({
  productName,
  price,
  image,
}) {
  return (
    <Pressable style={({pressed}) => [styles.item, pressed && styles.pressed]}>
      <Image style={styles.image} source={image} resizeMode="contain" />
      <View style={styles.product}>
        <Text style={styles.name}>{productName}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.9,
  },
  item: {
    marginTop: 12,
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingRight: 50,
    borderRadius: 8,
  },
  product: {
    flex: 2,
    padding: 18,
  },
  name: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    color: '#339005',
    fontSize: 18,
    fontStyle: 'italic',
  },
});

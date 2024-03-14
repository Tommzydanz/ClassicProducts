import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IProductItemProps} from './interface';

const ProductItem: IProductItemProps = function ProductItem({children, image}) {
  return (
    <Pressable style={({pressed}) => [styles.item, pressed && styles.pressed]}>
      <Image style={styles.image} source={image} />
      <View style={styles.product}>
        <Text style={styles.name}>{children}</Text>
        <Text style={styles.price}>{children}</Text>
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
    borderRadius: 8,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.15,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
  product: {
    flex: 2,
    padding: 18,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

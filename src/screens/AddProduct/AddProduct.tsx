import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Input from '../../components/Input/Input';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button/Button';
import {AddProductProps} from './interface';
import {ProductContext} from '../../provider/ProductProvider/ProductContext';
import {IProductContext} from '../../provider/ProductProvider/interface';

const AddProduct: AddProductProps = function AddProduct() {
  const [enteredName, setEnteredName] = useState<string | null>('');
  const [enteredPrice, setEnteredPrice] = useState<string | null>('');
  const [pickedImage, setPickedImage] = useState(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [transferred, setTransferred] = useState<number>(0);

  const {product} = useContext<IProductContext>(ProductContext);

  const handleNameChange = useCallback((enteredText: string) => {
    setEnteredName(enteredText);
  }, []);

  const handlePriceChange = useCallback((priceText: string) => {
    setEnteredPrice(priceText);
  }, []);

  const takePhotoFromCamera = () => {
    ImageCropPicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri: any =
        Platform.OS === 'android' ? image.path : image.sourceURL;
      setPickedImage(imageUri);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri: any =
        Platform.OS === 'android' ? image.path : image.sourceURL;
      setPickedImage(imageUri);
    });
  };

  const handleImage = useCallback(() => {
    Alert.alert('Image Options', 'select an option', [
      {
        text: 'Open Camera',
        onPress: () => {
          takePhotoFromCamera();
        },
      },
      {
        text: 'Choose Photo',
        onPress: () => {
          choosePhotoFromLibrary();
        },
      },
    ]);
  }, []);

  let imagePreview = <Text>No Image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image source={{uri: pickedImage}} style={styles.image} />;
  }

  const addProduct = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('name: ', enteredName);
    console.log('price: ', enteredPrice);

    firestore()
      .collection('products')
      .add({
        product: enteredName,
        price: enteredPrice,
        productImg: imageUrl,
        uploadTime: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log('Product Uploaded!');
        Alert.alert(
          'Classic Product Uploaded!',
          'Your product has been uploaded Successfully!',
        );
        setEnteredName(null);
        setEnteredPrice(null);
      })
      .catch(error => {
        console.log(
          'Something went wrong with added post to firestore.',
          error,
        );
      });
  };

  const uploadImage = async () => {
    if (pickedImage == null) {
      return null;
    }
    const uploadUri: any = pickedImage;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setIsUploading(true);

    const storageRef = storage().ref(`photos/${filename}`);

    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setIsUploading(false);
      setPickedImage(null);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <ScrollView style={styles.form}>
      <View>
        <Input
          keyboardType={'default'}
          label={'Name'}
          onUpdateValue={handleNameChange}
        />
        <Input
          keyboardType={'default'}
          label={'Price'}
          onUpdateValue={handlePriceChange}
        />
        <View style={styles.imagePreview}>{imagePreview}</View>
        <Pressable
          onPress={handleImage}
          style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Icon name={'camera'} size={18} color={'black'} />
          <Text style={styles.title}>Take Image</Text>
        </Pressable>
        <Button onPress={addProduct}>
          {isUploading ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{paddingVertical: 10}}> {transferred} % </Text>
              <ActivityIndicator
                size={'small'}
                color="black"
                style={styles.spinner}
              />
            </View>
          ) : (
            <Text>Add Product</Text>
          )}
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  button: {
    margin: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'black',
  },
  spinner: {
    paddingVertical: 10,
  },
});

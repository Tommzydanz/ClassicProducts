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
import React, {useCallback, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import notifee from '@notifee/react-native';
import Input from '../../components/Input/Input';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button/Button';
import {AddProductProps} from './interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProduct: AddProductProps = function AddProduct({navigation}) {
  const [enteredName, setEnteredName] = useState<string | null>('');
  const [enteredPrice, setEnteredPrice] = useState<string | null>('');
  const [pickedImage, setPickedImage] = useState(null);
  const [_notifications, setNotifications] = useState<any[]>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [transferred, setTransferred] = useState<number>(0);

  const continueToNext = useCallback(
    (screenName: string) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: screenName}],
        }),
      );
    },

    [navigation],
  );

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

  let imagePreview = <Text style={{color: 'black'}}>No Image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image source={{uri: pickedImage}} style={styles.image} />;
  }

  async function onDisplayNotification() {
    try {
      // Request permissions (required for iOS)
      await notifee.requestPermission();

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      // Display a notification
      const notificationId = await notifee.displayNotification({
        title: 'Upload Limit Reached!',
        body: 'You have reached the maximum upload limit of 5 products.',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });

      // Store the notification data in AsyncStorage
      const notificationData = {
        id: notificationId,
        title: 'Upload Limit Reached!',
        body: 'You have reached the maximum upload limit of 5 products.',
      };
      const existingNotifications = await AsyncStorage.getItem('notifications');
      const updatedNotifications: any[] = existingNotifications
        ? [...JSON.parse(existingNotifications), notificationData]
        : [notificationData];
      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(updatedNotifications),
      );

      // Update the notifications state
      setNotifications(updatedNotifications);
    } catch (error) {
      console.log('Error displaying notification:', error);
    }
  }

  const uploadImage = useCallback(async () => {
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
  }, [pickedImage]);

  const addProduct = useCallback(async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('name: ', enteredName);
    console.log('price: ', enteredPrice);

    const productSnapshot = await firestore().collection('products').get();
    const totalProducts = productSnapshot.size;

    if (totalProducts >= 5) {
      // Display a notification or alert when the limit is reached
      onDisplayNotification();

      Alert.alert(
        'Product Limit Reached',
        'You have reached the limit of 5 products. You cannot add another product.',
        [{text: 'OK', onPress: () => continueToNext('Home')}],
      );
      return; // Stop the function execution
    }

    if (imageUrl === null || enteredName === '' || enteredPrice === '') {
      Alert.alert(
        'No Product Added',
        'Please input a name, price and photo to add product.',
      );
      return;
    }

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
          [{text: 'OK', onPress: () => continueToNext('Home')}],
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
  }, [continueToNext, enteredName, enteredPrice, uploadImage]);

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

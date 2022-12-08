import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from PIL import ImageFile, Image
import cv2
from numpy import expand_dims
from werkzeug.utils import secure_filename
import sys
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
import keras.utils as image
ImageFile.LOAD_TRUNCATED_IMAGES = True
import numpy as np
import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator
import os
IMAGE_SIZE = 200
BATCH_SIZE = 64
print("kh")

data_generator = ImageDataGenerator(
    samplewise_center=True, 
    samplewise_std_normalization=True,
    brightness_range=[0.6, 1.0],
    zoom_range=[0.5, 1.5],
    validation_split=0.1,
    rotation_range=40,
    shear_range=0.3,
    fill_mode='nearest'
)
model_loc=os.path.abspath(os.path.join(os.getcwd(), os.pardir))+"\\backend\\model_name.model"
model = tf.keras.models.load_model(model_loc)
classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


# model = ResNet50(weights='imagenet')

def getPrediction(img_bytes, model):
    # print(img_bytes.read())
    # file_bytes = numpy.fromstring(img_bytes.read(), numpy.uint8)
    # Loads the image and transforms it to (224, 224, 3) shape
    original_image = Image.open(img_bytes)
    # # return silatra.recognise_hand_pose(original_image)
    # test_image = cv2.imdecode(file_bytes,cv2.IMREAD_COLOR)
 
    # try:
    #     img = test_image.copy()
    #     del(img)
    #     result = silatra.recognise_hand_pose(test_image, model_path='F:\\Study Material\\major\\react-flask-keras-app\\backend\\Models\\silatra_gesture_signs.sav')
    #     print('The recognised Hand pose is -> '+result)
    # except AttributeError: print('Image file does not exist. Please check the image path', file=sys.stderr)

    original_image = original_image.convert('RGB')
    original_image = original_image.resize((224, 224), Image.NEAREST)
    
    numpy_image = image.img_to_array(original_image)
    image_batch = expand_dims(numpy_image, axis=0)

    processed_image = preprocess_input(image_batch, mode='caffe')
    preds = model.predict(processed_image)
    # print(preds)
    return preds

def classifyImage(file):
    file_bytes = np.fromstring(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes,cv2.IMREAD_COLOR)
    # img = cv2.imread("F:/Study Material/major/sign-language-using-python-and-CNN/1.jpg")
    img = cv2.resize(img, (IMAGE_SIZE, IMAGE_SIZE))
    img = np.array(img) / 255.
    img = img.reshape((1, IMAGE_SIZE, IMAGE_SIZE, 3))
    img = data_generator.standardize(img)
    prediction = np.array(model.predict(img))
    print(prediction)
    predicted = classes[prediction.argmax()]
    print('Actual class: {} - Predicted class: {}'.format(0, predicted), end=' ')
    return predicted
    # import cv2
    # import tensorflow as tf
    # import numpy as np
    # import scipy.ndimage as sci
    # import time
    # import os
    # import numpy


    # def resizeIt(img,size=100,median=2):
    #     img=np.float32(img)
    #     r,c=img.shape
    #     resized_img=cv2.resize(img,(size,size))
    #     filtered_img=sci.median_filter(resized_img,median)
    #     return np.uint8(filtered_img)

    # def preprocessing(img0,IMG_SIZE=100):
    #     img_resized=resizeIt(img0,IMG_SIZE,1)
    #     img_blur = cv2.GaussianBlur(img_resized,(5,5),0)
    #     imgTh=cv2.adaptiveThreshold(img_blur,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,7,3)
    #     ret,img_th = cv2.threshold(imgTh,0,255,cv2.THRESH_TOZERO+cv2.THRESH_OTSU)
    #     return img_th

    # ALPHABET =  ['0','1','2','3','4','5','6','7','8','9'] 

    # prev=""
    # model = tf.keras.models.load_model("F:/Study Material/major/react-flask-keras-app/backend/model_name.modelprev")

    # prev_time = time.time()
    # # path = "1.jpg"

    # # src = cv2.imread(path)
    
    # file_bytes = numpy.fromstring(file.read(), numpy.uint8)
    # src = cv2.imdecode(file_bytes,cv2.IMREAD_COLOR)

    
    # img_gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    # IMG_SIZE = 200

    # img_test = preprocessing(img_gray,IMG_SIZE)

    # # cv2.imshow('whole input frame', np.uint8(img_gray))
    # cv2.imshow('qwerty',img_test)
    # time.sleep(2)

    # prediction = model.predict([img_test.reshape(-1, IMG_SIZE, IMG_SIZE, 1)])
    # print(prediction)

    # print(prediction[0])
        
    # text = ALPHABET[int(np.argmax(prediction[0]))]
    # _ = os.system('cls')
    # print(prediction)

    # print(prediction[0])
    # print('Alphabet: '+text+' Time Required: '+str(time.time()-prev_time))
    # prev_time = time.time()
    # return text
    # # # Returns a probability scores matrix 
    # # preds = getPrediction(file, model)
    # # # Decode the matrix to the following format (class_name, class_description, score) and pick the highest score
    # # # We are going to use class_description, since that describes what the model sees
    # # prediction = decode_predictions(preds, top=1)
    # # # prediction[0][0][1] is equal to the first batch, top prediction and class_description
    # # result = str(prediction[0][0][1])
    # # return result


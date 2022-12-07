import cv2
import numpy as np
import os
import string


# Create the directory structure
if not os.path.exists("myData"):
    os.makedirs("myData")
if not os.path.exists("myData/train"):
    os.makedirs("myData/train")
if not os.path.exists("myData/test"):
    os.makedirs("myData/test")

for i in range(10):
    if not os.path.exists("myData/train/" + str(i)):
        os.makedirs("myData/train/" + str(i))
    if not os.path.exists("myData/test/" + str(i)):
        os.makedirs("myData/test/" + str(i))

# If you want to make only specific character directory folder
# string.ascii_uppercase = ['C', 'I', 'L', 'O', 'U', 'V']

for i in ('pnr','train'):
    if not os.path.exists("myData/train/" + i):
        os.makedirs("myData/train/" + i)
    if not os.path.exists("myData/test/" + i):
        os.makedirs("myData/test/" + i)


# Train or test
mode = "train"
directory = "myData/" + mode + "/"
minValue = 90

cap = cv2.VideoCapture(cv2.CAP_DSHOW)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
interrupt = -1

while True:
    _, frame = cap.read()
    # Simulating mirror image
    frame = cv2.flip(frame, 1)

    # Getting count of existing images
    count = {
        "0": len(os.listdir(directory + "/0")),
        # "1": len(os.listdir(directory + "/1")),
        "1": len(os.listdir(directory + "/1")),
        "2": len(os.listdir(directory + "/2")),
        "3": len(os.listdir(directory + "/3")),
        "4": len(os.listdir(directory + "/4")),
        "5": len(os.listdir(directory + "/5")),
        "6": len(os.listdir(directory + "/6")),
        "7": len(os.listdir(directory + "/7")),
        "8": len(os.listdir(directory + "/8")),
        "9": len(os.listdir(directory + "/9")),
        "pnr": len(os.listdir(directory + "/pnr")),
        "train": len(os.listdir(directory + "/train"))
    }

    # Printing the count in each set to the screen
    cv2.putText(
        frame,
        "0 : " + str(count["0"]),
        (10, 80),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    # cv2.putText(
    #     frame,
    #     "1 : " + str(count["1"]),
    #     (10, 90),
    #     cv2.FONT_HERSHEY_PLAIN,
    #     1,
    #     (0, 255, 255),
    #     1,
    # )
    cv2.putText(
        frame,
        "1 : " + str(count["1"]),
        (10, 100),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "2 : " + str(count["2"]),
        (10, 110),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "3 : " + str(count["3"]),
        (10, 120),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "4 : " + str(count["4"]),
        (10, 130),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "5 : " + str(count["5"]),
        (10, 140),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "6 : " + str(count["6"]),
        (10, 150),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "7 : " + str(count["7"]),
        (10, 160),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "8 : " + str(count["8"]),
        (10, 170),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "9 : " + str(count["9"]),
        (10, 180),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "pnr : " + str(count["pnr"]),
        (10, 190),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )
    cv2.putText(
        frame,
        "train : " + str(count["train"]),
        (10, 200),
        cv2.FONT_HERSHEY_PLAIN,
        1,
        (0, 255, 255),
        1,
    )

    # Coordinates of the ROI
    x1 = int(0.5 * frame.shape[1])
    y1 = 10
    x2 = frame.shape[1] - 10
    y2 = int(0.5 * frame.shape[1])

    # Drawing the ROI
    # The increment/decrement by 1 is to compensate for the bounding box
    cv2.rectangle(frame, (x1, y1 + 4), (x2, y2 + 2), (255, 0, 0), 1)
    # Extracting the ROI
    roi = frame[y1 : x1 + 1, y2 : x2 - 1]
    # roi = frame[10:410, 220:520]
    roi = cv2.resize(roi, (128, 128))

    cv2.imshow("Frame", frame)
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # th3 = cv2.adaptiveThreshold(
    #     blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

    ret, test_image = cv2.threshold(
        blur, minValue, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    test_image = cv2.resize(test_image, (310, 310))
    cv2.imshow("test", test_image)

    interrupt = cv2.waitKey(10)
    if interrupt & 0xFF == 27:  # esc key
        break
    if interrupt & 0xFF == ord("0"):
        cv2.imwrite(directory + "0/" + "0" + str(count["0"]) + ".jpg", roi)
    # if interrupt & 0xFF == ord("1"):
    # cv2.imwrite(directory + "1/" + "1" + str(count["1"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("1"):
        cv2.imwrite(directory + "1/" + "1" + str(count["1"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("2"):
        cv2.imwrite(directory + "2/" + "2" + str(count["2"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("3"):
        cv2.imwrite(directory + "3/" + "3" + str(count["3"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("4"):
        cv2.imwrite(directory + "4/" + "4" + str(count["4"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("5"):
        cv2.imwrite(directory + "5/" + "5" + str(count["5"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("6"):
        cv2.imwrite(directory + "6/" + "6" + str(count["6"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("7"):
        cv2.imwrite(directory + "7/" + "7" + str(count["7"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("8"):
        cv2.imwrite(directory + "8/" + "8" + str(count["8"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("9"):
        cv2.imwrite(directory + "9/" + "9" + str(count["9"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("p"):
        cv2.imwrite(directory + "pnr/" + "pnr" + str(count["pnr"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("t"):
        cv2.imwrite(directory + "train/" + "train" + str(count["train"]) + ".jpg", roi)
    if interrupt & 0xFF == ord("z"):
        break

cap.release()
cv2.destroyAllWindows()

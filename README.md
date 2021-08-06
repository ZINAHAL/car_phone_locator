## ***INRODUCTION
The app is divided into 2 sections: Car, Phone.  
The aim is to allow you find these items when lost. Works in a similar manner to Cerberus app: https://www.cerberusapp.com/help/en/1   
It is targeted for Android versions below 6. 

## ***PHONE
* The app listens to all incoming sms messages. When an sms message contains the phrase:
  * "soundalarmnow" (this is an example. The user can specify their own phrase), the app responds by sounding an alarm at the highest volume for 3 minutes (even if the phone is on mute or connected to headphones). A notification is provided which allows the user to stop the alarm. The notification will disappear and the alarm is stopped after 3 minutes.
  * "sendgpsnow" (this is an example. The user can specify their own phrase), the app responds back by sending an sms message with the phone's battery percentage + phone's current gps.
* The app forces you to set up a login screen for your phone.
* If a feature is not compatible with the phone's Android version, then it will be disabled and you will be notified.  
    
![cflocator_errors_final](https://user-images.githubusercontent.com/23452999/128425549-7642b918-ff57-4bbf-bfc5-dd06d202ea39.gif)
![cflocator](https://user-images.githubusercontent.com/23452999/128568743-0bbf7bcf-4da3-45ba-943d-5016626b4884.png)

## ***CAR
This section allows you to find your parked car, incase you forgot. Just press "Remember Location" before you leave your car, go about your day, then press "Get Me to My Car!" button for the app to guide you back to your parked car.  
  
  
![cflocator_car_demo](https://user-images.githubusercontent.com/23452999/128430554-6cd64e4c-ba13-4c9f-a456-cf185dd81cb5.gif)

## ***IMPORTANT CONCEPTS
* Services
* Broadcast receivers
* Native modules (Android)
* React native

import React, { useEffect, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import openMap from 'react-native-open-maps';

import InfoLabel from '../common/InfoLabel';
import { CAR_INFO, COLOR_PALETTE } from '../settings';
import { pullFromDatabase, pushToDatabase } from '../common/dataStorage';
import JavaHelpers from '../common/androidNativeModules';

const CAR_DATA_KEY = '@saved_car_data';

const CarForm = () => {
    const [disable, setDisable] = useState(false);
    const [carData, setCarData] = useState({});

    useEffect(() => {

        (async () => {
            const pulledData = await pullFromDatabase(CAR_DATA_KEY);
            if (pulledData != null && pulledData != {}) {
                setDisable(pulledData['toggleButton']);
                setCarData(pulledData);
            }
        })();

    }, []);

    return (
        <ImageBackground source={require('./background.jpeg')} style={{ flex: 1 }}>
            <InfoLabel title='' information={CAR_INFO} color={COLOR_PALETTE.transparent_dark_green}/>
            <View style={{ marginTop: 'auto', marginBottom: 'auto'}}>
                <Button
                    title='Remember Location'
                    disabled={disable}
                    onPress={() => {
                        (async () => {
                            try {
                                const [latitude, longitude] = await JavaHelpers.getCurrentLocation();
                                const data = {
                                    startGpsLatitude: latitude,
                                    startGpsLongitude: longitude,
                                    toggleButton: true
                                };
                                const success = await pushToDatabase(CAR_DATA_KEY, data);
                                if (success) {
                                    setDisable(true); 
                                    setCarData(data); 
                                } else {
                                    JavaHelpers.showToastMessage('There were problems with storage');
                                }
                            } catch (error) {
                                JavaHelpers.showToastMessage("Turn on phone's GPS to get your location");                                
                            }
                        })();
                    }}
                    buttonStyle={{
                        width: '60%',
                        padding: 20,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        backgroundColor: COLOR_PALETTE.green
                    }}
                    titleStyle={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 18
                    }}
                />
                <Button
                    title='Get Me to My Car!'
                    disabled={!disable}
                    onPress={() => {
                        openMap({ 
                            provider: "google",
                            query: carData.startGpsLatitude + ',' + carData.startGpsLongitude,
                            zoom: 21
                        });
                    }}
                    buttonStyle={{
                        width: '60%',
                        padding: 20,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '7%',
                        marginBottom: '7%',
                        backgroundColor: COLOR_PALETTE.green
                    }}
                    titleStyle={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 18
                    }}
                />
                <Button
                    title='RESET'
                    disabled={!disable}
                    onPress={() => {
                        (async () => {
                            const success = await pushToDatabase(CAR_DATA_KEY, {});
                            if (success) {
                                setDisable(false);
                            } else {
                                JavaHelpers.showToastMessage('Can not do reset. Perhaps restart your phone');
                            }
                        })();
                    }}
                    buttonStyle={{
                        width: '20%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        backgroundColor: COLOR_PALETTE.brown
                    }}
                    titleStyle={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 18
                    }}
                />
            </View>
        </ImageBackground>
    );
}

export { CarForm };
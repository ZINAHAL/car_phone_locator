import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import { useForm, Controller } from 'react-hook-form';
import { Icon, Overlay } from 'react-native-elements'
import { getSystemVersion } from 'react-native-device-info';

import { pullFromDatabase, pushToDatabase } from '../common/dataStorage';
import InfoLabel from '../common/InfoLabel';
import { PHONE_LOST_INFO, PHONE_FOUND_INFO, PHONE_PROTECTION_INFO, COLOR_PALETTE } from '../settings';


const FORM_STORAGE_KEY = '@phone_hook_form';
const FormScreen = () => {

    const formFieldKeys = ['text_message_alarm', 'text_message_gps', 'contact_method', 'contact_number', 'home_address', 'lock_screen_password'];
    const [contact, setcontact] = useState(2);
    const { control, handleSubmit, errors, setValue, getValues } = useForm();
    const radioFormRef = useRef(null);
    const [overlayGreen, setOverlayGreen] = useState(false);
    const toggleOverlayGreen = () => {
        setOverlayGreen(!overlayGreen);
    };
    const [overlayRed, setOverlayRed] = useState(false);
    const toggleOverlayRed = () => {
        setOverlayRed(!overlayRed);
    };

    let compatibleAndroidVersion = true;
    if(Number(getSystemVersion()[0]) >= 6) {
        compatibleAndroidVersion = false;
    }

    const onSubmit = (data) => {

        (async () => {
            const success = await pushToDatabase(FORM_STORAGE_KEY, data);
            if(success) {
                toggleOverlayGreen();
            }else {
                toggleOverlayRed();
            }
        })();

    }

    useEffect(() => {

        (async () => {
            const data = await pullFromDatabase(FORM_STORAGE_KEY);
            if(data != null)
            {
                for (const key of formFieldKeys) {
                    setValue(key, data[key]);
                }

                radioFormRef.current.updateIsActiveIndex(getValues(formFieldKeys[2]));
            }
        })();

    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: COLOR_PALETTE.light_gray }}>
                <View style={{ marginBottom: 75 }}>
                    <InfoLabel title='LOST' color={COLOR_PALETTE.blue} information={PHONE_LOST_INFO}/>
                    {compatibleAndroidVersion ?
                        <View>
                            <Controller
                                control={control}
                                name={formFieldKeys[0]}
                                defaultValue=''
                                rules={{
                                    required: { value: true, message: 'This Field is Required.' }
                                }}
                                render={({ onChange, value }) => (
                                    <Input
                                        label='Text Message to Sound Alarm'
                                        labelStyle={styles.inputLabel}
                                        leftIcon={otherStyles.messageIcon}
                                        inputStyle={styles.userInput}
                                        errorMessage={errors.text_message_alarm && errors.text_message_alarm.message}
                                        onChangeText={(input) => onChange(input) }
                                        value={value}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={formFieldKeys[1]}
                                defaultValue=''
                                rules={{
                                    required: { value: true, message: 'This Field is Required.' }
                                }}
                                render={({ onChange, value }) => (
                                    <Input 
                                        label='Text Message to Send GPS'
                                        labelStyle={styles.inputLabel}
                                        leftIcon={otherStyles.messageIcon}
                                        inputStyle={styles.userInput}
                                        errorMessage={errors.text_message_gps && errors.text_message_gps.message}
                                        onChangeText={(input) => onChange(input) }
                                        value={value}
                                    />
                                )}
                            />
                        </View>
                    : <Text style={styles.disabled_features_warning}>The features in this section are unavailable on Android versions 6.0 or higher.</Text>
                    }

                    <InfoLabel title='FOUND' color={COLOR_PALETTE.blue} information={PHONE_FOUND_INFO}/>
                    <Controller
                        control={control}
                        name={formFieldKeys[2]}
                        defaultValue={2}
                        render={({ onChange, value }) => {
                            const radio_props = [
                                { label: 'Call', value: 0 },
                                { label: 'Text', value: 1 },
                                { label: 'None', value: 2 }
                            ];
                            return (
                                <View style={{ marginLeft: '3%', marginBottom: '5%' }}>
                                    <View style={{ flexDirection: 'row'}}>
                                        <Icon
                                            name='address-book'
                                            type='font-awesome-5'
                                            solid={true}
                                            marginRight={10}
                                            color={COLOR_PALETTE.blue}
                                            size={22}
                                        />
                                        <Text style={styles.radio_label}>How to Contact You?</Text>
                                    </View>
                                    <RadioForm
                                        ref={radioFormRef}
                                        radio_props={radio_props}
                                        initial={2}
                                        onPress={(value, index) => {
                                            setcontact(index); 
                                            onChange(index); 
                                        }}
                                    />
                                </View>
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={formFieldKeys[3]}
                        defaultValue=''
                        rules={{ 
                            pattern: /^\+?\d{1,20}$/,
                            required: true
                        }}
                        render={({ onChange, value }) => (
                            <Input 
                                label='Phone Number'
                                labelStyle={styles.inputLabel}
                                leftIcon={{
                                    type: 'font-awesome-5',
                                    name: 'phone-alt',
                                    color: COLOR_PALETTE.blue,
                                    size: 20
                                }}
                                inputStyle={styles.userInput}
                                keyboardType='phone-pad'
                                errorMessage={(errors.contact_number && contact != 2 && 'Please Enter a Valid Phone Number.') || ('')}
                                onChangeText={(input) => onChange(input) }
                                value={value}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name={formFieldKeys[4]}
                        defaultValue=''
                        rules={{
                            required: { value: true, message: 'This Field is Required.' }
                        }}
                        render={({ onChange, value }) => (
                            <Input
                                label='Delivery Address'
                                labelStyle={styles.inputLabel}
                                leftIcon={{
                                    type: 'font-awesome-5',
                                    name: 'map-marker-alt',
                                    color: COLOR_PALETTE.blue,
                                    size: 20
                                }}
                                inputStyle={styles.userInput}
                                errorMessage={errors.home_address && errors.home_address.message}
                                onChangeText={(input) => onChange(input) }
                                value={value}
                            />
                        )}
                    />

                    <InfoLabel title='DATA PROTECTION' color={COLOR_PALETTE.blue} information={PHONE_PROTECTION_INFO}/>
                    <Controller
                        control={control}
                        name={formFieldKeys[5]}
                        defaultValue=''
                        rules={{
                            pattern: /^\d{6}$/,
                            required: true
                        }}
                        render={({ onChange, value }) => (
                            <Input
                                label='Access Pin'
                                labelStyle={styles.inputLabel}
                                leftIcon={{
                                    type: 'font-awesome-5',
                                    name: 'lock',
                                    color: COLOR_PALETTE.blue,
                                    size: 20
                                }}
                                inputStyle={styles.userInput}
                                errorMessage={errors.lock_screen_password && 'Please Enter a 6 Digit Number.'}
                                onChangeText={(input) => onChange(input) }
                                value={value}
                            />
                        )}
                    />
                </View>
            </ScrollView>
            <View>
                <Button 
                    title="SUBMIT" 
                    onPress={ handleSubmit(onSubmit) } 
                    buttonStyle={{
                        height: 55,
                        backgroundColor: COLOR_PALETTE.green
                    }}
                    titleStyle={{
                        color: 'black',
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}
                />

                <Overlay
                    isVisible={overlayGreen} 
                    onBackdropPress={toggleOverlayGreen}
                    overlayStyle={{
                        padding: 30
                    }}
                >
                    <View>
                        <Icon
                            name='check-circle'
                            type='font-awesome-5'
                            solid={true}
                            size={40}
                            color={COLOR_PALETTE.dark_green}
                            marginBottom={15}
                        />
                        <Text style={styles.overlay_text}>SUBMISSION WAS SUCCESSFUL</Text>
                    </View>
                </Overlay>

                <Overlay
                    isVisible={overlayRed} 
                    onBackdropPress={toggleOverlayRed}
                    overlayStyle={{
                        padding: 30
                    }}
                >
                    <View>
                        <Icon
                            name='times-circle'
                            type='font-awesome-5'
                            solid={true}
                            size={40}
                            color={COLOR_PALETTE.red}
                            marginBottom={15}
                        />
                        <Text style={styles.overlay_text}>SUBMISSION FAILED</Text>
                    </View>
                </Overlay>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputLabel: {
        color: COLOR_PALETTE.blue,
    },
    userInput: {
        color: COLOR_PALETTE.brown,
        fontWeight: 'bold'
    },
    radio_label: {
        color: COLOR_PALETTE.blue,
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: '4%'
    },
    overlay_text: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    disabled_features_warning: {
        marginLeft: '4%',
        marginBottom: '4%',
        fontWeight: 'bold',
        color: 'red'
    }
});

const otherStyles = {
    messageIcon: {
        type: 'font-awesome-5',
        name: 'comment-alt',
        solid: true,
        color: COLOR_PALETTE.blue,
        size: 20
    }
};

export { FormScreen };

/*
NOTES:

-required in RHF means that the field cannot be left empty/untouched. An input must be provided.
*/
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import { useForm, Controller } from 'react-hook-form';
import { Icon, Overlay } from 'react-native-elements'

import { pullFromDatabase, pushToDatabase } from '../common/dataStorage';
import InfoLabel from '../common/InfoLabel';
import { PHONE_LOST_INFO, PHONE_FOUND_INFO, PHONE_PROTECTION_INFO, COLOR_PALETTE } from '../settings';


const FORM_STORAGE_KEY = '@phone_hook_form';
const FormScreen = () => {

    const formFieldKeys = ['text_message_alarm', 'text_message_gps', 'contact_method', 'contact_number', 'home_address', 'lock_screen_password'];

    const [disablePhoneField, setDisablePhoneField] = useState(false);

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
                <View style={{ marginBottom: 70 }}>
                    <InfoLabel title='LOST' color={COLOR_PALETTE.blue} information={PHONE_LOST_INFO}/>
                    <Controller
                        control={control}
                        name={formFieldKeys[0]}
                        defaultValue=''
                        render={({ onChange, value }) => (
                            <Input
                                label='Text Message to Sound Alarm'
                                labelStyle={styles.inputLabel}
                                leftIcon={otherStyles.messageIcon}
                                inputStyle={styles.userInput}
                                onChangeText={(input) => onChange(input) }
                                value={value}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={formFieldKeys[1]}
                        defaultValue=''
                        render={({ onChange, value }) => (
                            <Input 
                                label='Text Message to Send GPS'
                                labelStyle={styles.inputLabel}
                                leftIcon={otherStyles.messageIcon}
                                inputStyle={styles.userInput}
                                onChangeText={(input) => onChange(input) }
                                value={value}
                            />
                        )}
                    />

                    <InfoLabel title='FOUND' color={COLOR_PALETTE.blue} information={PHONE_FOUND_INFO}/>
                    <Controller
                        control={control}
                        name={formFieldKeys[2]}
                        defaultValue={-1}
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
                                        initial={-1}
                                        onPress={(value, index) => {
                                            setDisablePhoneField(index === radio_props[2].value); 
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
                        rules={{ pattern: /^\+?\d{1,20}$/ }}
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
                                disabled={disablePhoneField}
                                onChangeText={(input) => onChange(input) }
                                value={value}
                            />
                        )}
                    />
                    {errors.contact_number && <Text>Please Enter a Valid Number</Text>}

                    <Controller
                        control={control}
                        name={formFieldKeys[4]}
                        defaultValue=''
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
                        render={({ onChange, value }) => (
                            <Input
                                label='Password'
                                labelStyle={styles.inputLabel}
                                leftIcon={{
                                    type: 'font-awesome-5',
                                    name: 'lock',
                                    color: COLOR_PALETTE.blue,
                                    size: 20
                                }}
                                inputStyle={styles.userInput}
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
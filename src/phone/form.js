import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import { useForm, Controller } from 'react-hook-form';

import { pullFromDatabase, pushToDatabase } from '../common/dataStorage';


const FORM_STORAGE_KEY = '@phone_hook_form';
const FormScreen = () => {

    const formFieldKeys = ['text_message_alarm', 'text_message_gps', 'contact_method', 'contact_number', 'home_address', 'lock_screen_password'];

    const [disablePhoneField, setDisablePhoneField] = useState(false);

    const { control, handleSubmit, errors, setValue, getValues } = useForm();

    const radioFormRef = useRef(null);

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

    const onSubmit = (data) => {
        pushToDatabase(FORM_STORAGE_KEY, data);
    }

    return (
        <View style={styles.main}>
            <ScrollView>
                <View style={styles.heading_box}>
                    <Text style={styles.heading_text}>LOST</Text>
                </View>
                <Controller
                    control={control}
                    name={formFieldKeys[0]}
                    defaultValue=''
                    render={({ onChange, value }) => (
                        <Input
                            label='Text Message to Sound Alarm'
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
                            onChangeText={(input) => onChange(input) }
                            value={value}
                        />
                    )}
                />

                <View style={styles.heading_box}>
                    <Text style={styles.heading_text}>FOUND</Text>
                </View>
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
                            <View>
                                <Text>How to contact you?</Text>
                                <RadioForm
                                    ref={radioFormRef}
                                    radio_props={radio_props}
                                    initial={-1}
                                    formHorizontal={true}
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
                            onChangeText={(input) => onChange(input) }
                            value={value}
                        />
                    )}
                />

                <View style={styles.heading_box}>
                    <Text style={styles.heading_text}>DATA PROTECTION</Text>
                </View>
                <Controller
                    control={control}
                    name={formFieldKeys[5]}
                    defaultValue=''
                    render={({ onChange, value }) => (
                        <Input 
                            label='Password'
                            onChangeText={(input) => onChange(input) }
                            value={value}
                        />
                    )}
                />
            </ScrollView>
            <View><Button title="Submit" onPress={ handleSubmit(onSubmit) } /></View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    form: {
        backgroundColor: 'gray'
    },
    button: {
        borderColor: 'red',
        backgroundColor: 'black'
        // height: 45
    },
    heading_box: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '5%',
        backgroundColor: 'lightblue',
        marginBottom: 20
    },
    heading_text: {
        // alignSelf: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        // paddingTop: 10,
        // paddingBottom: 10,
        // backgroundColor: 'lightblue'
    },
    // container: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     padding: 10,
    //     // backgroundColor: 'powderblue'
    // }
});

export { FormScreen };
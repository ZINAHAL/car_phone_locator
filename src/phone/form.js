import * as React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { Input, Button } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';

import { useForm, Controller } from 'react-hook-form';


const FormScreen = () => {
    const { control, handleSubmit, errors } = useForm();
    const onSubmit = (data) => {
        console.log('Store data in database', data);
    };

    console.log('printing the errors', errors);

    return (
        <View style={styles.main}>
            <ScrollView>
                <View style={styles.heading_box}>
                    <Text style={styles.heading_text}>LOST</Text>
                </View>
                <Controller
                    control={control}
                    name='text_message_alarm'
                    defaultValue=''
                    render={({ onChange }) => (
                        <Input 
                            label='Text Message to Sound Alarm' 
                            onChangeText={(input) => { onChange(input) }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='text_message_gps'
                    defaultValue=''
                    render={({ onChange }) => (
                        <Input 
                            label='Text Message to Send GPS'
                            onChangeText={(input) => { onChange(input) }}
                        />
                    )}
                />

                <View style={styles.heading_box}>
                    <Text style={styles.heading_text}>FOUND</Text>
                </View>
                <Controller
                    control={control}
                    name='contact_method'
                    defaultValue=''
                    render={({ onChange }) => {
                        const radio_props = [
                            {label: 'Call', value: 0 },
                            {label: 'Text', value: 1 }
                        ];
                        return (
                            <View>
                                <Text>How to contact you?</Text>
                                <RadioForm
                                    radio_props={radio_props}
                                    initial={-1}
                                    formHorizontal={true}
                                    onPress={(input) => { onChange(input) }}
                                />
                            </View>
                        );
                    }}
                />
                <Controller
                    control={control}
                    name='contact_number'
                    defaultValue=''
                    rules={{ pattern: /^\+?\d{1,20}$/ }}
                    render={({ onChange, onBlur }) => (
                        <Input 
                            label='Phone Number'
                            keyboardType='phone-pad'
                            onChangeText={(input) => { onChange(input) }}
                        />
                    )}
               />
                {errors.contact_number && <Text>Please Enter a Valid Number</Text>}

                {/* <View style={styles.heading_box}>
                    <Text style={styles.heading_text}>DATA PROTECTION</Text>
                </View>
                <Controller
                    control={control}
                    name='phone_login_password'
                    defaultValue=''
                    render={({ onChange }) => (
                        <Input 
                            label='Password'
                            onChangeText={(input) => { onChange(input) }}
                        />
                    )}
                /> */}
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
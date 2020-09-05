import * as React from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

const SaveFormButton = ({ save_content }) => {
    const [visible, setVisible] = useState(false);
    return (
        <View>
            <TouchableHighlight onPress={save_content}>
                <Text style={styles.text}>SAVE CHANGES</Text>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '9%',
        backgroundColor: 'green'
    },
    text: {
        fontSize: 20
    }
});

export { SaveFormButton };
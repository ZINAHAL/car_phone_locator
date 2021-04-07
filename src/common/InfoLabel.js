import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, Overlay } from 'react-native-elements'


const InfoLabel = ({ title, information, color, normal }) => {
    if(normal) {
        return (
            <View 
                style={styles.normal} 
                backgroundColor={color}
            >
                <Text style={styles.text}>{title}</Text>
            </View>
        );
    }

    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return (
        <View
            style={styles.main}
            backgroundColor={color}
        >
            <Pressable
                style={styles.box}
                onPress={toggleOverlay}
            >
                <Text style={styles.text}>{title}</Text>
                <Icon
                    name='info-circle'
                    type='font-awesome-5'
                    size={24}
                    marginLeft={10}
                    color='white'
                />
            </Pressable>

            <Overlay 
                isVisible={visible} 
                onBackdropPress={toggleOverlay}
                overlayStyle={styles.overlay_main}
            >
                <View>
                    <Icon
                        name='info-circle'
                        type='font-awesome-5'
                        size={35}
                        marginBottom={20}
                    />
                    <Text style={{ textAlign: 'justify', fontSize: 16 }}>{information}</Text>
                </View>
            </Overlay>
        </View>
    );
};

InfoLabel.defaultProps = {
    title: 'Empty Title',
    information: 'No Information to Show to User',
    color: 'white',
    normal: false
};

const styles = StyleSheet.create({
    main: {
        height: '12%',
        marginBottom: '4%'
    },
    box: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    text: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    overlay_main: {
        width: '70%',
        padding: 25
    },
    normal: {
        height: '12%',
        marginBottom: '4%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});


export default InfoLabel;
/**
 * Created by fuhuixiang on 2017-3-15.
 */
"use strict";
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';
import Camera from 'react-native-camera';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    }
});

class QrCodePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0)
        };
        this.title = '扫描二维码';
    }

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(
            this.state.moveAnim,//初始值
            {
                toValue: -200,
                duration: 1500,
                easing: Easing.linear
            }//结束值
        ).start(() => this.startAnimation());//开始
    };

    onBarCodeRead = (result) => {
        const {qrCodeRead} = this.props.route;
        const {data} = result;
        qrCodeRead && qrCodeRead(data);
        this.back();
    };

    render() {
        return (
            <View style={styles.container}>
                <Camera
                    style={styles.preview}
                    onBarCodeRead={this.onBarCodeRead}>
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle}/>
                        <Animated.View style={[
                            styles.border,
                            {transform: [{translateY: this.state.moveAnim}]}]}/>
                        <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                    </View>
                </Camera>
            </View>
        );
    }
}

export default QrCodePage;

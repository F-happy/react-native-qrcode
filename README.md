# react-native-qrcode
基于 React Native Camera 实现二维码扫描

> 最近在做 React-native 的项目，里面有个扫描二维码的需求，搜索了一圈发现没有什么满意的组件可以用，所以在这里就记录一下基于 ```react-native-camera``` 来实现的一个扫描二维码的页面。

先上效果图：
![](./qrcode.gif)

## 实现思路：

首先我们需要先绘制出扫码的界面，代码如下：
```javascript
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
```
我们在 Camera 组件中绘制一个绿色的正方形 View，并在下方加上文案提示。随后就是绘制绿色方框中滚动的线来了。这里我们使用 RN 中的 Animated 组件来实现动画效果。
首先在 componentDidMount 函数中初始化动画函数。
```javascript
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
```
并且记得在构造函数中初始化 state：
```javascript
constructor(props) {
    super(props);
    this.state = {
        moveAnim: new Animated.Value(0)
    };
}
```
通过 startAnimation 函数的递归使得这个动画呈现一个循环的效果。更加详细的动画效果可以参考[文档](http://reactnative.cn/docs/0.42/animated.html#content)中的说明。
接下来就是当 Camera 扫描出结果后的处理了，这里通过 ```onBarCodeRead``` 函数来处理扫描结果：
```javascript
onBarCodeRead = (result) => {
    const {navigator, route} = this.props;
    const {qrCodeRead} = route;
    const {data} = result;
    qrCodeRead && qrCodeRead(data);
    navigator.pop();
};
```
很多情况下当我们扫描完成之后页面都会自动关闭并返回扫描结果，所以在调用我这里的 demo 组件的时候需要给组件传入 navigator 来返回上级页面，并且还需要传入一个回调函数来接受扫描的结果，在这里我传入的回调为 ```qrCodeRead``` 函数，所以在扫描结束之后便会调用并传入结果值。到此为止整个的思路都描述完了。其实还是很简单的一个 demo 的~

### 这个组件其实是一个很简单的封装，github 上面有很多类似的组件，在这里我仅仅记录一下实现思路，接下来记录一些我在实现时候遇到的问题。

* 关于react-native-camera版本的选择：
在react-native-camera的文档中提供的安装方式是 git 地址来安装，这个时候默认安装的是0.6.0的版本，而文档中说
```
if on react-native < 0.40: npm i react-native-camera@0.4
if on react-native >= 0.40 npm i react-native-camera@0.6
```
所以当你的 react-native 版本是小于0.40的时候你就需要在安装时指定版本号了，而不是复制文档里的方法了。
```bash
npm i react-native-camera@0.4
``` 
记得安装完成后执行 link 方法。
```bash
react-native link react-native-camera
```

## 参考资料：
* [react-native-camera](https://github.com/lwansbrough/react-native-camera)
* [react-native animated](http://reactnative.cn/docs/0.42/animated.html#content)
import React, { Component, Fragment } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { db } from '../../firebase/index'

import {
  TouchableOpacity,
  Text,
  StatusBar,
  Linking,
  View,
  StyleSheet
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import { FlatList } from 'react-native-gesture-handler'
let itemRef = db.ref('/dbUser')
class ScanQR extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scan: false,
      ScanResult: false,
      result: null,
      onOffFlash: false,
      data: []
    }
  }

  onSuccess = data => {
    const check = data.data.substring(0, 9999999)
    db.ref('/dbUser').push('scanned data ' + '' + check + '')
    console.log('scanned data' + check)
    this.setState({
      result: data,
      scan: false,
      ScanResult: true,
      
    })
    if (check === 'https') {
      Linking.openURL(data.data).catch(err =>
        console.error('An error occured', err)
      )
    } else {
      this.setState({
        result: data,
        scan: false,
        ScanResult: true
      })
    }
  }

  activeQR = () => {
    this.setState({
      scan: true
    })
  }
  scanAgain = () => {
    this.setState({
      scan: true,
      ScanResult: false
    })
  }

  componentDidUpdate(){
    if(this.state.ScanResult){
      setTimeout(()=>{
          itemRef.on('value', snapshot => {
          let data = snapshot.val()
          let items = Object.values(data)
          this.setState({data:items})
      })
    },99999999999)
  }}
  render () {
    const { scan, ScanResult, result } = this.state
    return (
      <View>
        <Fragment>
          <StatusBar barStyle='dark-content' backgroundColor='#fff' />
          {!scan && !ScanResult && (
            <View style={styles.Component}>
              <Text style={styles.Title}>
                Welcome To React-Native QR Code Tutorial !
              </Text>

              <TouchableOpacity
                onPress={this.activeQR}
                style={styles.TouchOnScan}
              >
                <Text style={styles.textOnScan}>Click to Scan !</Text>
              </TouchableOpacity>
            </View>
          )}

          {scan && (
            <View style={styles.scan}>
              <QRCodeScanner
                containerStyle={styles.containerScen}
                cameraStyle={styles.containerScan}
                reactivate={true}
                showMarker={true}
                ref={node => {
                  this.scanner = node
                }}
                onRead={this.onSuccess}
                flashMode={
                  this.state.onOffFlash === true
                    ? RNCamera.Constants.FlashMode.torch
                    : RNCamera.Constants.FlashMode.off
                }
                reactivateTimeout={1}
                bottomViewStyle={styles.bottomViewScan}
                bottomContent={
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({ onOffFlash: !this.state.onOffFlash })
                    }
                  >
                    <Text>Flash</Text>
                  </TouchableOpacity>
                }
              />
            </View>
          )}

          {ScanResult && (
            <Fragment>
              <View style={styles.ScanResult}>
                {/* <Text style={styles.textResult}>Result !</Text>
                <View style={styles.cover}>
                  <Text style={styles.textAllResult}>Type : {result.type}</Text>
                  <Text style={styles.textAllResult}>
                    Result : {result.data}
                  </Text>
                  <Text style={styles.textAllResult} numberOfLines={1}>
                    RawData: {result.rawData}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={this.scanAgain}
                  style={styles.scanAgain}
                >
                  <Text>Click to Scan again!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ scan: false, ScanResult: false })
                  }
                  style={styles.backToHome}
                >
                  <Text>Back to Home</Text>
                </TouchableOpacity> */}
                <FlatList
                  data={this.state.data}
                  keyExtractor={(index)=>index.toString()}
                  renderItem={({item})=>{
                    return(
                      <View>
                        <Text>{item}</Text>
                      </View>
                    )
                  }}
                />
              </View>
            </Fragment>
          )}
        </Fragment>
      </View>
    )
  }
}

export default ScanQR

const styles = StyleSheet.create({
  Component: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Title: {
    fontSize: 16
  },
  TouchOnScan: {
    width: 120,
    paddingVertical: 10,
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    elevation: 5
  },
  textOnScan: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  scan: {
    width: '100%',
    height: '100%'
  },
  containerScan: {
    width: '100%',
    height: '100%'
  },
  bottomViewScan: {
    position: 'absolute',
    marginTop: 100
  },
  ScanResult: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 30
  },
  textResult: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  cover: {
    width: '95%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 5,
    marginTop: 10,
    borderRadius: 10
  },
  textAllResult: {
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    width: '100%',
    paddingVertical: 10
  },
  scanAgain: {
    width: 200,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    marginTop: 20,
    elevation: 5
  },
  backToHome: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    paddingHorizontal: 10,
    marginTop: 20
  }
})

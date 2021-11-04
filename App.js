import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, collection, getDocs, query,
  doc, addDoc, getDoc, onSnapshot
} from "firebase/firestore";
import { firebaseConfig } from './Secrets';

let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
  useFetchStreams: false
});

export default function App() {

  const initMessages = [
    {
      author: 'Bob',
      text: 'Hello, Alice',
      timestamp: 1001,
      key: '1001'
    },
    {
      author: 'Alice',
      text: 'Hello, Bob',
      timestamp: 1002,
      key: '1002'
    }

  ]
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState('Alice');
  const [messages, setMessages] = useState(initMessages);

  return (
    <View style={styles.container}>
      <View style={styles.selectUserContainer}>
        <Button
          title="Alice"
          color={currentUser==="Alice"?"red":"gray"}
          onPress={()=>setCurrentUser("Alice")}
        />
        <Button
          title="Bob"
          color={currentUser==="Bob"?"red":"gray"}
          onPress={()=>setCurrentUser("Bob")}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={inputText}
          onChangeText={(text)=>setInputText(text)}
        />
        <Button
          title="Send"
          onPress={()=>{
            setMessages(oldMessages=>{
              let newMessages = Array.from(oldMessages);
              let ts = Date.now();
              newMessages.push({
                author: currentUser,
                text: inputText,
                timestamp: ts,
                key: '' + ts
              });
              return newMessages;
            });
            setInputText('');
          }}
        />
      </View>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({item})=>{
            console.log(item);
            return (
              <View style={[
                styles.messageContainer,
                currentUser===item.author?{alignItems: 'flex-end'}:{}
              ]}>
                <Text style={styles.messageText}>
                  {currentUser===item.author?'Me':item.author}: {item.text}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '15%'
  },
  selectUserContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    width: '90%',
    paddingBottom: '3%'
  },
  inputContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    width: '90%',
  },
  inputBox: {
    width: '60%', 
    borderColor: 'black',
    borderWidth: 1, 
    height: 40
  },
  chatContainer: {
    flex: 0.6,
    width: '100%',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    margin: '3%'
  },
  messageContainer: {
    flex: 0.05,
    padding: '2%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  messageText: {
    fontSize: 18
  }
});

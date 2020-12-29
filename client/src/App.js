
import './App.css';
import React from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateValue } from './StateProvider';
import messagesService from './services/MessagesService';
function App() {
  const [users, setUsers] = React.useState([]);
  const [messages, setMessages] = useState([]);
  const [userLogin, setUserLogin] = useState();
  const [{user}, dispatch] = useStateValue();
  const getUsers=()=>{
        axios.get("users").then(res=>{
            setUsers(res.data);
            console.log(res.data);
            setUserLogin(localStorage.getItem("user"));
        }).catch(err=>{
            console.log(err);
        });
    };
    const getMessages=()=>{
        axios.get("messages").then(res=>{
            setMessages(res.data);
            console.log(res.data);
          }).catch(err=>{
            console.log(err);
        });
    };
    const setReceive=()=>{
      const data=true;
      messages.map((message)=>{
        if(message.user_to===user){
          if(message.viewed===false){
              messagesService.userViewed(message._id, data);
          } 
        }
      });
    }
     React.useEffect(getUsers,[]);
    React.useEffect(getMessages,[]);
    React.useEffect(setReceive,[messages]);
 
    useEffect(()=>{
    var pusher = new Pusher('9a1706ac26a9d3909601', {
      cluster: 'eu'
    });
        const channel = pusher.subscribe('users');
        channel.bind('inserted', (newUser)=> {
        setUsers([...users, newUser]);
        console.log(users);
  });
  channel.bind('updated', (newUser)=> {
        getUsers();
        console.log("from react update "+ newUser);
  });
    // getrid of above code executing again and again
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
    }, [users]);

  useEffect(()=>{
   var pusher = new Pusher('1d0c2b10507144f2573d', {
      cluster: 'ap2'
    });
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage)=> {
      setMessages([...messages, newMessage]); //[...messages, newMessage] means keep all older messages and load newMessage as well
      
  });
  channel.bind('updated', (newMessage)=> {
        getMessages();
        console.log("from react update Message"+ messages);
  });
    // getrid of above code executing again and again
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe(); 
    }
  }, [messages]); // here we need to insert dependency

  return (
    <div className="app">
       <ToastContainer />
      <div className="app__body">
      {!user ? 
       (<Router>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </Router>) : 
        (<Router>
          <Switch>
            <Route path="/user/:id">
              <Sidebar messages={messages} users={users} user_from={user} />
              <Chat messages={messages} users={users} user_from={user}/>
            </Route>
            <Route path="/">
              <Sidebar messages={messages} users={users} user_from={user}/>
            </Route>
          </Switch>
        </Router>)
      }
      </div>
    </div>
  );
}
export default App;
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { SearchOutlined,AttachFile, MoreVert } from "@material-ui/icons"
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import CheckIcon from '@material-ui/icons/Check';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Chat.css';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useParams } from 'react-router-dom';
import userService from "./services/UserService"
import messagesService from './services/MessagesService';
function Chat({messages,users, user_from}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [body, setBody] = useState("");
    const [userTop, setUserTop] = useState("");
    const [user_to, setUser_to] = useState("");
    const [last_scene, setLast_scene] = useState("");
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const {id} = useParams();
    const handleClick = (event) => {
        var today= new Date();
        var date="Last Scene:  "+today.getHours() + ":" + today.getMinutes() +"    "+(today.getMonth()+1)+'-'+today.getDate();
        userService.setTime(userService.getLoggedInUser()._id, date);
        userService.logout();
        setAnchorEl(event.currentTarget);
        window.location.href = "/";
  };
  const handleClose = (e) => {
      setAnchorEl(null);
    
  };
    useEffect(()=>{
        if(id){
            users.map((user)=>{
                console.log("From Chat ID "+ id); 
                if(user._id===id){
                    setUserTop(user.name);
                    console.log("From chat.js      "+userTop);
                    setUser_to(user.email);
                    setLast_scene(user.last_scene);
                    setTo(user.name);
                    console.log("From Chat User "+ userTop+" last scene "+last_scene);
                } if(user.email===user_from){
                    setFrom(user.name);
                }
            })
        }
    },[id]);
    const sendMesssages = async (e)=>{
        e.preventDefault();
        await axios.post("http://localhost:9000/api/messages/add",{user_to, user_from, body});
        setBody("");
    }
    return (
        <div className='chat'>
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>{userTop}</h3>
                    <p>{last_scene}</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert onClick={handleClick}/>
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
            
            <div className="chat__body">
                {messages.map((message)=>{
                
                    if(message.user_from===user_from && message.user_to===user_to ){
                        return  <p className={`chat__message ${message.user_from===user_from && "chat__receiver"}`}>
                                    {message.user_from===user_from? <span className="chat__name">{from}</span> : <span className="chat__name">{to}</span> }
                                    {message.body}
                                    <span className="chat__timestamp">
                                        {message.time+"  "+message.date}
                                    </span>
                                    {message.viewed === true ? (
                                        <span className={`${message.opened===true && "chat__read"}`}>
                                            <DoneAllIcon />
                                        </span>
                                    ): (
                                        <CheckIcon />
                                    )}
                                </p>
                    }else if(message.user_to===user_from && message.user_from===user_to){
                        return  <p className={`chat__message ${message.user_from===user_from && "chat__receiver"}`}>
                                    {message.user_from===user_from? <span className="chat__name">{from}</span> : <span className="chat__name">{to}</span> }
                                    {message.body}
                                    <span className="chat__timestamp">
                                        {message.time+"  "+message.date}
                                    </span>
                                    {message.opened===false? messagesService.userOpened(message._id, true) : false}
                                    
                                </p>
                    }
                })} 
            </div>

            <div className="chat__footer">
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <form>
                    <input 
                        value={body}
                        onChange = {(e)=>setBody(e.target.value)}
                        placeholder="Type a message"
                        type="text"/>
                        <button onClick={sendMesssages} type="submit"> Send a message</button>
                </form>
                
                <IconButton>
                    <MicIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat

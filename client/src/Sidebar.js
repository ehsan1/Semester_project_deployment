import React from 'react';
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import {SearchOutlined} from '@material-ui/icons';
import SidebarChat from './SidebarChat';
function Sidebar({messages, users, user_from}) {
    return (
        <div className="sidebar">
           <div className="sidebar__header">
                <Avatar src="/ehsan.jpg" /> 
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                 </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="search or start new chat" type="text" />
                </div>
            </div>
            <div className="sidebar__chats">
               {users.map(( user)=>{
                    console.log("Side bar user user From "+user_from);
                    if(user.email===user_from || user.role==="admin"){
                        console.log("Side bar user email "+user.email);
                       
                    }else{
                        console.log("Else part")
                        return < SidebarChat key={user._id} user={user} user_from={user_from}  messages={messages}/>
                    }
                })} 
            </div>
        </div>
    );
}

export default Sidebar

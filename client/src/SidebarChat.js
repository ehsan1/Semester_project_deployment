import { Avatar, Grid } from '@material-ui/core';
import React from 'react'
import { Link } from 'react-router-dom';
import './SidebarChat.css';
import CheckIcon from '@material-ui/icons/Check';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const SidebarChat=({user ,messages, user_from})=>{
    let x=true;
    return (
        <Link to={`/user/${user._id}`}>
            <div className= 'sidebarChat'>
                <Avatar />
                <div className="sidebarChat__info">
                   
                    {messages.slice(0).reverse().map( (message)=>{
                        if(message.user_from===user.email && message.user_to===user_from &&x ){
                            console.log("from sidebar msgsss user-from "+user_from+"  "+ user.email+ "  and msg is "+message.body );
                            x=false;
                            let msg=message.body;
                            if(msg.length>35){
                                msg=msg.slice(0,35)+" ...";
                            }
                            return (<div>
                                <Grid container spacing={3} >
                                    <Grid item xs={6}>
                                        <h2>{user.name}</h2>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className="Sidebar__msgTime">{message.time}</span>
                                    </Grid>
                                </Grid>
                                <p>{msg}</p>
                                </div>)
                            
                        }else if(message.user_to===user.email && message.user_from===user_from && x){
                            console.log("from sidebar msgsss  user to "+ user.email+ "  and msg is "+message.body );
                            x=false;
                            let msg=message.body;
                            if(msg.length>35){
                                msg=msg.slice(0,35)+" ...";
                            }
                            return (<div>
                                    <Grid container spacing={3} >
                                        <Grid item xs={6}>
                                            <h2>{user.name}</h2>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <span className="Sidebar__msgTime">{message.time}</span>
                                        </Grid>
                                    </Grid>
                                   <p><span className="sidebar__read">{message.viewed === true ? (
                                        <span className={`${message.opened===true && "chat__read"}`}>
                                            <DoneAllIcon />
                                        </span>
                                        
                                    ): (
                                        <CheckIcon />
                                    )} </span>{msg}</p></div>)
                        }
                    })}
                    
                </div>
            </div>
        </Link>
    )
}
export default SidebarChat

import { Button, TextField } from '@material-ui/core';
import React from 'react'
import "./Login.css";
import { toast } from "react-toastify";
import userService from "./services/UserService"
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';
const Login=(props)=> {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [{}, dispatch] = useStateValue();
    return (
        <div className="login">
            <div className="login__container">
                <img src="https://st2.depositphotos.com/1116329/7584/v/950/depositphotos_75840613-stock-illustration-vector-modern-phone-icon-in.jpg"/>
                <div className="login__text">
                    <h2>Sign in to Whatsapp</h2>
                </div>
                <div className="login__form">
                    <TextField
                    label="email"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    />{" "}
                    <br />
                    <TextField
                    label="password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    />{" "}
                    <br />
                    <Button
                    
                    onClick={(e) => {
                        userService
                        .login(email, password)
                        .then((data) => {
                            console.log(data);
                            localStorage.setItem("user", userService.getLoggedInUser().email);
                            userService.setTime(userService.getLoggedInUser()._id, "Online");
                            dispatch({
                                type: actionTypes.SET_USER,
                                user: userService.getLoggedInUser().email,
                            });
                                console.log(userService.getLoggedInUser().email);
                            //   window.location.href = "/";     
                        })
                        .catch((err) => {
                            console.log(err);
                            // toast.error(err.response.data, {
                            // position: toast.POSITION.TOP_LEFT,
                            // });
                        });
                    }}
                    >
                    Login
                    </Button>
                </div>
                <Button type="submit" onClick={(e) => {
                                window.location.href = "/register";
                            }}>
                SignUp
                </Button>
            </div>
        </div>
    )
}

export default Login

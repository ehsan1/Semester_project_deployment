import { Button, TextField } from '@material-ui/core';
import React from 'react'
import "./Login.css";
import userService from "./services/UserService"
import { toast } from "react-toastify";
const Register=(props)=> {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    return (
        
        <div className="login">
            <div className="login__container">
                <img src="https://st2.depositphotos.com/1116329/7584/v/950/depositphotos_75840613-stock-illustration-vector-modern-phone-icon-in.jpg"/>
                <div className="login__text">
                    <h2>Sign in to Whatsapp</h2>
                </div>
                <div className="login__form">
                    <TextField
                    label="name"
                    fullWidth
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    />{" "}
                    <br />
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
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                            userService
                            .register(name, email, password)
                            .then((data) => {
                                console.log(data);
                                window.location.href = "/";
                            })
                            .catch((err) => {
                                console.log(err);
                                toast.error(err.response.data, {
                                position: toast.POSITION.TOP_LEFT,
                                });
                            });
                        }}
                        >
                    Register
                    </Button>
                </div>
                <Button type="submit" onClick={(e) => {
                                window.location.href = "/";
                            }}>
                Sign In
                </Button>
            </div>
        </div>
    )
}

export default Register

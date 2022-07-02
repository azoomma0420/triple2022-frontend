import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setCookie } from './Cookies'

function Login() {
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')

    const handleInputId = (e) => {
        setInputId(e.target.value)
    }

    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }

    const onClickLogin = () => {
        axios.post('http://localhost:8080/login', null, {
            params: {
                'userName': inputId,
                'password': inputPw
                }
            })
        .then(res => setCookie('TRIPLE_SID', res, {
            path: "/",
            secure: true,
            sameSite: "none",
        }))
        .catch()
    }

    useEffect(() => {

    },
    [])

    return(
        <div>
            <h2>Login</h2>
            <div>
                <label htmlFor='input_id'>ID : </label>
                <input type='text' name='input_id' value={inputId} onChange={handleInputId} />
            </div>
            <div>
                <label htmlFor='input_pw'>PW : </label>
                <input type='password' name='input_pw' value={inputPw} onChange={handleInputPw} />
            </div>
            <div>
                <button type='submit' onClick={onClickLogin}>로그인</button>
            </div>
        </div>
    )
}

export default Login;
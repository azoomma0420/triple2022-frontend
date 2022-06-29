import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { getCookie } from './Cookies'
import Login from './Login'
import Review from './Review'

function Main() {
    const [loginShow, setLoginShow] = useState(false);
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState(0)

    useEffect(() => {
        let cookie = getCookie('TRIPLE_SID')
        let token = 'Bearer ' + cookie?.data

        axios.get('http://localhost:8080/session', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        }
        })
        .then(res => {
                setUserId(res.data.userId)
                setUserName(res.data.userName)
                setLoginShow(true);
         })
        .catch()

        console.log(userName)
    },
    [])

    return(
        <div>
            {loginShow && <h2> <Review userId={userId} userName={userName}></Review></h2>}
            {!loginShow &&<Login />}
        </div>
    )
}

export default Main;
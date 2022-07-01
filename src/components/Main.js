import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { getCookie } from './Cookies'
import Login from './Login'
import TextEditor from './TextEditor'

function Main() {
    const [loginShow, setLoginShow] = useState(false);
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState(0)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [point, setPoint] = useState(0)
    const [reviews, setReviews] = useState([]);

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
    },
    [])

    return(
        <div>
            {loginShow &&
                <TextEditor
                    setContent={setContent}
                    userName={userName}
                    point={point}
                    reviews={reviews}
                />}
            {content}
            {!loginShow &&<Login />}
        </div>
    )
}

export default Main;
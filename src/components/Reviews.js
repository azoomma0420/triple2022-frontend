import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getCookie } from './Cookies'
import Review from './Review'
import Images from './Images'

function Reviews(props) {
    const [content, setContent] = useState('')
    const [point, setPoint] = useState(0)
    const [reviews, setReviews] = useState([]);

    const handleContent = (e) => {
        setContent(e.target.value)
    }

    const onClickSubmit = (event) => {
        let data = {
            type: "REVIEW",
            action: "ADD",
            content: content,
            userId : props.userId
        }

        let cookie = getCookie('TRIPLE_SID')
        let token = 'Bearer ' + cookie?.data

        axios.post('http://localhost:8080/event', JSON.stringify(data), {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        }
        })
        .then()
        .catch()

        axios.get('http://localhost:8080/point', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        }
        })
        .then(res => {
            setPoint(res.data)
        })
        .catch()
        console.log(point)

        axios.get('http://localhost:8080/reviews', {
                         headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                         }
        })
        .then(res => setReviews(res.data))
        .catch()
    }

    useEffect(() => {
        let cookie = getCookie('TRIPLE_SID')
        let token = 'Bearer ' + cookie?.data

        axios.get('http://localhost:8080/point', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        }
        })
        .then(res => {
              setPoint(res.data)
        })
        .catch()
        console.log(point)

        axios.get('http://localhost:8080/reviews', {
                                 headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: token,
                                 }
                })
                .then(res => setReviews(res.data))
                .catch()
                console.log(reviews)
    },
    [])

    return(
        <div>
            <h2>{props.userName}님 현재 포인트 {point}점 입니다.</h2>
            <textarea placeholder='리뷰를 남겨 주세요.' value={content} onChange={handleContent} ></textarea>
            <Images />
            <button type='button' onClick={onClickSubmit}>Submit</button>
            <br />
            <br />

            <p>남긴 리뷰 들...</p>
            {
                reviews.map(review=> (<Review review={review} />))
            }

        </div>
    )
}

export default Reviews;

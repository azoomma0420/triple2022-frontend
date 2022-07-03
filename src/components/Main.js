import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { setCookie, getCookie } from './Cookies'
import Login from './Login'
import TextEditor from './TextEditor'
import Review from './Review'
import UseGeoLocation from './UseGeoLocation'

function Main() {

    const location = UseGeoLocation()

    const cookie = getCookie('TRIPLE_SID')
    const token = 'Bearer ' + cookie?.data

    const [loginShow, setLoginShow] = useState(false);
    const [userName, setUserName] = useState('')
    const [point, setPoint] = useState(0)
    const [reviews, setReviews] = useState([])
    const [review, setReview] = useState()

    const [userId, setUserId] = useState(0)
    const [reviewId, setReviewId] = useState(0)
    const [placeId, setPlaceId] = useState(0)
    const [content, setContent] = useState('')
    const [attachedPhotoIds, setAttachedPhotoIds ] = useState([])
    //const attachedPhotoIds = getCookie('attachedPhotoIds')

    const onClickSubmit = (action, id) => {
        const data = {
            type: "REVIEW",
            action: action,
            reviewId: id,
            content: content,
            attachedPhotoIds : attachedPhotoIds,
            userId : userId,
            placeId : placeId
        }

        axios.post('http://localhost:8080/event', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            }
        })
        .then()
        .catch()

        setCookie('attachedPhotoIds', null, {
                        path: "/",
                        secure: true,
                        sameSite: "none",
        })
    }

    const onLoadImageIds = () => {
        axios.get('http://localhost:8080/images', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            params: {
                type: "REVIEW"
            }
        })
        .then(res => {
            if(res.data[0] != null)
                setAttachedPhotoIds([...attachedPhotoIds, res.data[0]])
        })
        .catch()
    }

    const onLoadReview = () => {
        onLoadSession()
        axios.get('http://localhost:8080/reviews', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            }
        })
        .then(res => setReviews(res.data))
        .catch()
    }

    const onLoadSession = () => {
        axios.get('http://localhost:8080/session',
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            }
        })
        .then(res => {
                setUserId(res.data.userId)
                setUserName(res.data.userName)
                setPoint(res.data.point)
                setLoginShow(true);
         })
        .catch()
    }

    const showReviewDetail = (id, data) => {
        setContent(data)
        setReviewId(id)
    }

    const onSavePosition = () => {
        axios.post('http://localhost:8080/savePlace', null, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            params: {
                latitude: location.coordinates.lat,
                longitude: location.coordinates.lng,
            }
        })
        .then(res => {
            alert('새로운 장소 등록 성공!')
            setCookie('place', res.data, {
                            path: "/",
                            secure: true,
                            sameSite: "none",
            })
        })
        .catch(
            alert('이미 등록된 장소 입니다.')
        )
    }

    const onLoadPosition = () => {
        setPlaceId(getCookie('place'))
    }

    const onLoadImage = () => {
    }

    const onLogout = () => {
        setCookie('TRIPLE_SID', '', {
                    path: "/",
                    secure: true,
                    sameSite: "none",
        })
    }

    useEffect(() => {
        onLoadSession()
        onLoadReview()
    },
    [])

    return(
        <div>
            {loginShow &&
                <div>
                    <h2>{userName}님 현재 포인트 {point}점 입니다.</h2>
                    <h2>리뷰를 남겨 주세요 </h2>
                    <TextEditor data={content} setContent={setContent}  />
                    <div>
                        <button type='button' onClick={(e)=>{onClickSubmit("ADD", null, e)}}>전송</button>
                    </div>
                    <div>
                        <button type='button' onClick={onSavePosition}>위치저장</button>
                    </div>
                    <div>
                        <button type='button' onClick={onLoadImageIds}>이미지 가져오기</button>
                    </div>
                    <div>
                        <button type='button' onClick={onLoadPosition}>위치 가져오기</button>
                    </div>
                    <div>
                        <button type='button' onClick={onLogout}>로그아웃</button>
                    </div>
                    <br />
                    <br />
                    {
                        reviews?.map(r =>(
                            <Review key={r.reviewId} review={r} onClickSubmit={onClickSubmit} showReviewDetail={showReviewDetail} />
                        ))
                    }
                    <br />
                </div>
            }
            {!loginShow &&<Login />}
            이미지: {attachedPhotoIds}, 장소: {placeId}
        </div>
    )
}

export default Main;
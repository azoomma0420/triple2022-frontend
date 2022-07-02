import React, { useState } from 'react'

function Review(prop) {

    return(
        <div>
            {prop.review.reviewId} ::::
            <input type='button' name='input_mod' value="수정" onClick={(e)=>{prop.onClickSubmit("MOD", prop.review.reviewId , e)}} />
            <input type='button' name='input_del' value="삭제" onClick={(e)=>{prop.onClickSubmit("DELETE", prop.review.reviewId, e)}} />
            <input type='button' name='input_review_view' value="리뷰 불러오기" onClick={(e)=>{prop.showReviewDetail(prop.review.reviewId, prop.review.content, e)}} />
        </div>
    )
}

export default Review;

import React from 'react'


function ReviewList(prop) {

    return(
        <div>
            {prop.review.reviewId} ::: {prop.review.content}
        </div>
    )
}

export default ReviewList;

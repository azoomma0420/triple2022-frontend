import React from 'react'


function Review(prop) {

    return(
        <div>
            {prop.review.reviewId} ::: {prop.review.content}
        </div>
    )
}

export default Review;

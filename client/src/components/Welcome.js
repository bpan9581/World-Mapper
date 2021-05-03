import React from 'react'

const Welcome = (props) => {
    return(
        <div className="welcome">
            <img id = "img" src = {require('./images/earth2.png')}/>
            <h1>Welcome To The <br/>World Data Mapper</h1>
        </div>
    )
}

export default Welcome;
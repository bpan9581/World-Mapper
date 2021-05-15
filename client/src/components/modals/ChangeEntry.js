import React, { useState } 	from 'react';

const ChangeEntry = (props) => {
    const changeParent = () => {
        props.changeParent(props.id)
    }

    return(
        <div className = "change-parent-text" onClick = {changeParent}>{props.name}</div>
    )
}

export default ChangeEntry;
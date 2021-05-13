import React, { useState }  from 'react';

const Landmark = (props) => {
    const [editing, toggleEdit] = useState(false);

    const handleEdit = (e) => {
        toggleEdit(false);
        const newLandmark = e.target.value ? e.target.value : 'Untitled';
        const prevLandmark = props.x;
        props.editItem(newLandmark, prevLandmark);
    };

    const deleteLandmark = () => {
        props.deleteLandmark(props.index, props.x)
    }


    return (
        <div>{editing ? <input onBlur={handleEdit} autoFocus={true} defaultValue={props.x} type='text' />
            : <div className="flex landmark-text-container">
                <div className="landmark-delete" onClick = {deleteLandmark}>x</div>
                <div className="landmark-text" onClick={toggleEdit}>{props.x}</div>
            </div>}
        </div>
    )
}

export default Landmark;
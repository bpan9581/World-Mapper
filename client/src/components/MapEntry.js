import React, { useState }  from 'react';
import { Link } from 'react-router-dom';


const MapEntry = (props) => {
    const [editing, toggleEditing] = useState(false);
    const [preEdit, setPreEdit] = useState(props.name);

    const handleEditing = (e) => {
        e.stopPropagation();
        setPreEdit(props.map);
        toggleEditing(!editing);
    };

    const handleSubmit = (e) => {
        handleEditing(e);
        const { name, value } = e.target;
        console.log(e.target);
        props.updateRegionField(props._id, name, value, preEdit);
    };

    const deleteRegion = () =>{
        props.delete(props._id);
    }

    const setActiveRegion = () => {
        props.setActiveRegion(props.map);
    }


    return (
        <div  className = "map-entry">
            <Link to = {`/maps/${props._id}`}className = "map-entry-item" onClick = {setActiveRegion} >
            {
                editing ? <input name='name' onBlur={handleSubmit} autoFocus={true} defaultValue={props.name} />
                    :   <div className = "map-entry-text">{props.name}</div>
            }
            </Link>
            <i className="material-icons map-entry-edit" onClick = {handleEditing}>edit</i>
            <i className="material-icons map-entry-delete" onClick = {deleteRegion}>delete_outline</i>
        </div>
        
    );

};

export default MapEntry;
import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';
import WMFooter from 'wt-frontend/build/components/wmodal/WMFooter';
import ChangeEntry from './ChangeEntry'

const Change = (props) => {

    const handleChange = async (id) => {
        props.setShowChange(id);
    }

    let change = []
    if(props.maps && props.path){
        props.path.map(x => props.maps.map(y =>{
            if(x === y._id){
                y.children.map(z => props.maps.map(a =>{
                    if(z === a._id && a._id !== props.id && a._id !== props.parent) change.push(<ChangeEntry changeParent = {handleChange} id = {a._id} name = {a.name}/>)
                }))
            }
        }))
    }

    return (
        <WModal className="delete-modal" visible = {props.showChange} animation="slide-fade-top" cover = {true}>
            <WMHeader className="modal-header" onClose={() => props.setShowChange1(false)}>
                Choose Parent
			</WMHeader>
            <WMFooter>
                {change}
            </WMFooter>
        </WModal>
    );
}

export default Change;
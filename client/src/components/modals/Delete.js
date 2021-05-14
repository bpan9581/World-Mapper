import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';
import WMFooter from 'wt-frontend/build/components/wmodal/WMFooter';

const Delete = (props) => {

    const handleDelete = async () => {
        props.deleteRegion();

        props.setShowDelete(false);
    }

    return (
        <WModal className="delete-modal" visible = {props.showDelete} animation="slide-fade-top" cover = {true}>
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete Item?
			</WMHeader>

            <WMFooter>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMFooter>

        </WModal>
    );
}

export default Delete;
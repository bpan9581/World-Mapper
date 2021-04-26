import e from 'cors';
import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const clickDisabled = () => { };
    let hasUndo = props.hasUndo;
    let hasRedo = props.hasRedo;
    let redoButtonStyle = ' table-header-button-tpsDisabled ';
    let undoButtonStyle = ' table-header-button-tpsDisabled ';

    if(!props.disabled){
        redoButtonStyle = hasRedo ? 'table-header-button-tps ': ' table-header-button-tpsDisabled ';
        undoButtonStyle = hasUndo ? 'table-header-button-tps ': ' table-header-button-tpsDisabled ';
    }

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton className='table-header-section' wType="texted" onClick = {() => props.sort("description")}>Task</WButton>
            </WCol>

            <WCol size="3">
                <WButton className='table-header-section' wType="texted"onClick = {() => props.sort("due_date")}>Due Date</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick = {() => props.sort("completed")}>Status</WButton>
            </WCol>

            <WCol size = "2">
                <WButton className='table-header-section' wType = "texted" onClick = {() => props.sort("assigned_to")}>Assigned To</WButton>
            </WCol>


            <WCol size="2">
                <div className="table-header-buttons">
                    <WButton className="undo-redo" onClick={props.undo} wType="texted"
                        clickAnimation={hasUndo? "ripple-light": ""} shape="rounded" className={`${undoButtonStyle}`}>
                            <i className="material-icons">undo</i>
                    </WButton>
                    <WButton className="undo-redo" onClick={props.redo} wType="texted" clickAnimation={hasRedo? "ripple-light": ""} shape="rounded" className={`${redoButtonStyle}`}>
                            <i className="material-icons">redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => props.setActiveList({})} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;
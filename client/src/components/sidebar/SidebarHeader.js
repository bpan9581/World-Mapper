import React                    from 'react';
import { WButton, WRow, WCol }  from 'wt-frontend';

const SidebarHeader = (props) => {
    const clickDisabled = () => { };


    return (
        <WRow className='sidebar-header'>
            <WCol size="9">
                <WButton wType="texted" hoverAnimation="text-primary" className='sidebar-header-name'>
                    Todolists
                </WButton>
            </WCol>

            <WCol size="3">
                {
                    props.auth && <div className="sidebar-options">
                        <WButton className="sidebar-buttons" onClick={props.activeid === undefined ?props.createNewList: clickDisabled} clickAnimation={props.activeid === undefined? "ripple-light": ""} shape="rounded" color={props.activeid === undefined ? "primary": "colored"}>
                            <i className="material-icons">add</i>
                        </WButton>
                    </div>
                }
            </WCol>

        </WRow>

    );
};

export default SidebarHeader;
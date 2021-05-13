import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GET_DB_REGION, GET_DB_REGIONS } from '../cache/queries'
import * as mutations from '../cache/mutations';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import Landmark from './Landmark';

const Regions = (props) => {
    const { _id } = useParams();
    const [UpdateRegionLandmark] = useMutation(mutations.UPDATE_REGION_LANDMARK);

    const clickDisabled = () => { };

    let path = props.path;

    let maps = [];
    let region = [];
    let parentId;
    const { data, refetch } = useQuery(GET_DB_REGION, { variables: { _id: _id } });
    if (data) {
        region = data.getRegionById;
        parentId = data.getRegionById.parent;
    }

    const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_DB_REGIONS);
    if (loading1) { console.log(loading1, 'loading'); }
    if (error1) { console.log(error1, 'error'); }
    if (data1) {
        maps = data1.getAllRegions;
    }


    let inputValue = "Add New Landmark";
    let length = region.children ? region.children.length : 0;


    let children = props.children;
    let index = children.toString().indexOf(_id) / 25;
    let prevButtonStyle = index === 0 ? "material-icons viewer-buttons-disabled" : "material-icons viewer-buttons"
    let nextButtonStyle = index === children.length - 1 ? "material-icons viewer-buttons-disabled" : "material-icons viewer-buttons"

    const addItem = async () => {
        let input = document.getElementById("landmark-box")
        let value = input.value;
        if (value !== "") {
            input.value = "";
            let landmark = region.landmark;
            let preEdit = landmark;
            let newLandmark = [];
            landmark.map(x => newLandmark.push(x))
            newLandmark.push(value)
            UpdateRegionLandmark({ variables: { _id: _id, field: 'landmark', value: newLandmark }, refetchQueries: [{ query: GET_DB_REGIONS }] });
            refetch();
        }
    }

    const editItem = async (index, edit, preEdit) => {
        let landmark = region.landmark;
        let newLandmark = [];
        landmark.map(x => newLandmark.push(x))
        newLandmark[index] = edit;

        UpdateRegionLandmark({ variables: { _id: _id, field: 'landmark', value: newLandmark }, refetchQueries: [{ query: GET_DB_REGIONS }] });
        refetch();
    }

    const deleteLandmark = async (itemToDelete, item) => {
        let landmark = region.landmark;
        let preEdit = item;
        let newLandmark = [];
        landmark.map(x => newLandmark.push(x))
        newLandmark.splice(itemToDelete, 1)

        UpdateRegionLandmark({ variables: { _id: _id, field: 'landmark', value: newLandmark }, refetchQueries: [{ query: GET_DB_REGIONS }] });
        refetch();
    }

    return (
        <div className="region-viewer-container">
            <img className="stock-photo" src={require('./images/stock-photo.png')} />
            <div className="region-viewer-text">
                <div className="region-viewer-text-values">
                    <div>Region Name:</div>
                    <div>{region.name}</div>
                </div>
                <div className="region-viewer-text-values">
                    <div>Parent Region:</div>
                    <Link to={`/maps/${parentId}`}>{props.parentName}</Link>
                </div>
                <div className="region-viewer-text-values">
                    <div>Region Capital:</div>
                    <div>{region.capital}</div>
                </div>
                <div className="region-viewer-text-values">
                    <div>Region Leader:</div>
                    <div>{region.leader}</div>
                </div>
                <div className="region-viewer-text-values">
                    <div># of Sub Regions:</div>
                    <div>{length}</div>
                </div>
            </div>
            <div className="region-viewer-landmark-container">
                <div className="region-viewer-landmark-header">
                    <div>Region Landmarks</div>
                </div>
                <div className="region-viewer-landmark-body">
                    {region.landmark && region.landmark.map((x, index) => <Landmark x={x} index={index} editItem={editItem} deleteLandmark={deleteLandmark} />)}
                </div>
                <div className="region-viewer-landmark-adder">
                    <div className="landmark-adder" onClick={addItem}>+</div>
                    <input id="landmark-box" className="new-landmark" />
                </div>
            </div>
            <div className="absolute-sister">
                {index === 0 ? <i className={`${prevButtonStyle}`}>arrow_back</i> :
                    <Link to={`/maps/${children[index - 1]}/region-viewer`} className={`${prevButtonStyle}`}>arrow_back</Link>}
                <div className="whitespace"></div>
                {index === children.length - 1 ? <i className={`${nextButtonStyle}`}>arrow_forward</i> :
                    <Link to={`/maps/${children[index + 1]}/region-viewer`} className={`${nextButtonStyle}`}>arrow_forward</Link>}
            </div>
            <div className="path">
                {path}
                {path.length === 0 ? <Link className="disable-link" to={`/maps/${parentId}`}><div>{props.parentName}</div></Link> : <div className="flex">
                    <div className="whitespace"></div>
                    <div>{'>'}</div>
                    <div className="whitespace"></div>
                    <Link className="disable-link" to={`/maps/${parentId}`}><div>{props.parentName}</div></Link>
                </div>}
            </div>
        </div>
    )
}

export default Regions;
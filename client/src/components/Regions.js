import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import {GET_DB_REGION} from '../cache/queries'
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } 		from '@apollo/client';

const Regions = () => {
    const { _id } = useParams();
    let region = [];
    const { loading, error, data, refetch } = useQuery(GET_DB_REGION, { variables: {_id: _id} });
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		region = data.getRegionById; 
	}
    let inputValue = "Add New Landmark";
    let length = region.children ? region.children.length : 0;

    let parentName;
    let parentId;
    const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_DB_REGION, { variables: {_id: region.parent} });
	if(loading1) { console.log(loading, 'loading'); }
	if(error1) { console.log(error, 'error'); }
	if(data1) { 
        parentId = data1.getRegionById._id;
		parentName = data1.getRegionById.name; 
	}

    return(
        <div className = "region-viewer-container">
            <img className = "stock-photo" src = {require('./images/stock-photo.png')}/>
            <div className = "region-viewer-text">
                <div className="region-viewer-text-values">
                    <div>Region Name:</div>
                    <div>{region.name}</div>
                </div>
                <div className="region-viewer-text-values">
                    <div>Parent Region:</div>
                    <Link to = {`/maps/${parentId}`}>{parentName}</Link>
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
            <div className = "region-viewer-landmark-container">
                <div className = "region-viewer-landmark-header">
                    <div>Region Landmarks</div>
                </div>
                <div className = "region-viewer-landmark-body">
                    <div>Hello</div>
                </div>
                <div className = "region-viewer-landmark-adder">
                    <div className = "landmark-adder">+</div>
                    <input className = "new-landmark"/>
                </div>
            </div>
        </div>
    )
}

export default Regions;
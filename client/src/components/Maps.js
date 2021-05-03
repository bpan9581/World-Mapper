import React, { useState, useEffect } 	from 'react';
// import { GET_DB_REGIONS } 				from '../cache/queries';
import MapEntry from './MapEntry'
import * as mutations 					from '../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {} 				from '../utils/jsTPS';
import {GET_DB_REGIONS} from '../cache/queries'

const Maps = (props) => {
    let maps = [];
    const [activeMap, setActiveMap] = useState({})
    const [AddMap] = useMutation(mutations.ADD_MAP);
	const [DeleteRegion] = useMutation(mutations.DELETE_REGION);
	const [UpdateRegion] = useMutation(mutations.UPDATE_REGION_FIELD);


    const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		maps = data.getAllRegions; 
		props.maps(maps)
	}

    const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
	
			if (activeMap._id) {
				let tempID = activeMap._id;
				let list = maps.find(list => list._id === tempID);
				setActiveMap(list);

			}
		}
	}

    const createNewMap = async () => {
		const length = maps.length
		const id = length >= 1 ? maps[length - 1].id + Math.floor((Math.random() * 1000) + 1) : 1;
		const map = {
			_id: '',
			name: 'Untitled',
			owner: props.user._id,
			children: [],
		}
		const { data } = await AddMap({ variables: { map: map }});
		map._id = data.addMap;
		refetch();
	};

	const deleteRegion = async (e) => {
		DeleteRegion({ variables: { _id: e}, refetchQueries: [{ query: GET_DB_REGIONS }]});
		refetch();
	};

	const updateRegion = async (_id, field , value, preEdit) => {
		UpdateRegion({ variables: { _id: _id, field: field, value: value}, refetchQueries: [{ query: GET_DB_REGIONS }]});
		refetch();
	};

	const setActiveRegion = (_id) => {
		let region = maps.filter(x => x._id === _id)
		props.setActiveReg(region)
	}


    return(
        <div className = "map-container">
            <div className = "map-header">Your Maps</div>
            <div className = "user-maps">{maps && maps.filter(regions => regions.map === true).map(map => (
                    <MapEntry
                        name = {map.name} _id = {map._id}
                        id = {map.id} map = {map} delete = {deleteRegion}
						updateRegionField = {updateRegion} setActiveRegion = {setActiveRegion}
                    />
                ))}</div>
            <div className = "map-right-body">
                <img id = "img2" src = {require('./images/earth2.png')}/>
                <div className = "map-create" onClick = {createNewMap}>Create New Map</div>
            </div>
        </div>
    )
}

export default Maps;
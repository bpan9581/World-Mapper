import React, { useState, useEffect } 	from 'react';
// import { GET_DB_REGIONS } 				from '../cache/queries';
import MapEntry from './MapEntry'
import * as mutations 					from '../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import {} 				from '../utils/jsTPS';
import {GET_DB_REGIONS} from '../cache/queries'
import Delete from './modals/Delete'

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

	const [showDelete, toggleShowDelete] 	= useState(false);
    const [toDelete, setDeleteRegion] = useState({})

	const setShowDelete = (_id) => {
        setDeleteRegion(_id);
		toggleShowDelete(!showDelete)
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

	const deleteRegion = async () => {
		DeleteRegion({ variables: { _id: toDelete}, refetchQueries: [{ query: GET_DB_REGIONS }]});
		refetch();
	};

	const updateRegion = async (_id, field , value, preEdit) => {
		UpdateRegion({ variables: { _id: _id, field: field, value: value}, refetchQueries: [{ query: GET_DB_REGIONS }]});
		refetch();
	};

	const setActiveRegion = (region) => {
		props.setActiveRegion(region)
	}

	useEffect(() => {refetch()}, [])

    return(
        <div className = "map-container">
            <div className = "map-header">Your Maps</div>
            <div className = "user-maps">{maps && maps.filter(regions => regions.map === true).map(map => (
                    <MapEntry
                        name = {map.name} _id = {map._id}
                        id = {map.id} map = {map} delete = {deleteRegion}
						updateRegionField = {updateRegion} setActiveRegion = {setActiveRegion}
						setShowDelete = {setShowDelete}
                    />
                ))}</div>
            <div className = "map-right-body">
                <img id = "img2" src = {require('./images/earth2.png')}/>
                <div className = "map-create" onClick = {createNewMap}>Create New Map</div>
            </div>
			<div>{showDelete && (<Delete _id = {toDelete} deleteRegion = {deleteRegion} showDelete = {showDelete} setShowDelete={setShowDelete} />)}</div>
        </div>
    )
}

export default Maps;
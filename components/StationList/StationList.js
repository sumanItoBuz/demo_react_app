import React, { Component } from 'react';
import Loading from '../Loading/Loading.js';
import Station from '../Station/Station.js';
import _ from 'lodash';

class StationList extends Component{
    constructor(){
        super();
        this.errorInterval = 500;
        this.isMount = true;
        this.state = {
            isLoading: false,
            stations_list: [],
            parameters_list: [],
            selected_station: null,
            add_station: false,
            isError: false
        }
        
        this.updateStationsList = this.updateStationsList.bind(this);
        this.handleHttpError = this.handleHttpError.bind(this);
        this.getStationList = this.getStationList.bind(this);
        this.getParametersList = this.getParametersList.bind(this);
        this.getParameters = this.getParameters.bind(this);
        this.getStationDetails = this.getStationDetails.bind(this);
        this.closeDialogue = this.closeDialogue.bind(this);
        this.dataUpdated = this.dataUpdated.bind(this);
        this.addStation = this.addStation.bind(this);
    }

    getStationDetails(station_id){
        this.setState({
            selected_station: station_id
        })
    }

    updateStationsList(station_list){
        this.setState({
            isLoading: false,
            stations_list: station_list
        });
    }

    handleHttpError(error){
        let self = this;
        console.log('Error >',error);
        this.setState({
            isLoading: false,
            isError: true
        });
        setTimeout(()=>{
            self.setState({
                isError: false
            })
        }, self.errorInterval);
    }

    getStationList(){
        let self = this;
        
        fetch('http://5bed7bcd7839000013e6f9b4.mockapi.io/stations')
            .then( response => response.json() )
            .then( result => self.updateStationsList(result))
            .catch((error)=>{self.handleHttpError(error)});
    }

    getParametersList(){
        let self = this;
        this.setState({
            isLoading: true
        });

        fetch('http://5bed7bcd7839000013e6f9b4.mockapi.io/parameters')
            .then( response => response.json())
            .then((result) => {
                self.setState({
                    parameters_list: result
                },()=>{
                    self.getStationList();
                })
            })
            .catch(error => self.handleHttpError(error));
        
    }

    getParameters(parameters){

        let return_value = [];
        let param_list = this.state.parameters_list;

        if(parameters instanceof Array){
            if(!param_list.length){
                return parameters.toString();
            }
            
            parameters.map((param)=>{

                let param_details = _.find(param_list, {key: param});
                if(param_details){
                    return_value.push(param_details.symbol);
                }else{
                    return_value.push(param)
                }
            });

            return return_value.toString();

        }else {
            return 'NA'
        }
    }

    closeDialogue(){
        if(this.state.selected_station || this.state.add_station){
            this.setState({
                selected_station: null,
                add_station: false
            })
        }
    }

    dataUpdated(){
        this.getStationList();
        this.closeDialogue();
    }

    addStation(){
        this.setState({
            selected_station: null,
            add_station: true
        })
    }

    componentDidMount(){
        this.isMount = true;
        this.getParametersList();
    }

    componentWillUnmount(){
        this.isMount = false;
    }

    render(){
        return(
            <div className="fullheight">
                {(()=>{
                    if(this.state.isLoading){
                        return <Loading></Loading>;
                    }else{
                        return <div id="station_list">
                            {(()=>{
                                if(this.state.selected_station || this.state.add_station){
                                    return <div id="station_details"> 
                                        <Station station_id={this.state.selected_station} onExit={()=>{this.closeDialogue()}} onUpdate={()=>{this.dataUpdated()}} onDelete={()=>{this.dataUpdated()}} onNewAdd={()=>{this.dataUpdated()}} ></Station>
                                    </div>;
                                }
                            })()}
                            <div className="heading">
                                List of All the Stations
                                <button onClick={()=>{this.addStation()}} className="add-station-button" > + </button>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sl No</th>
                                        <th>Station Name</th>
                                        <th>Parameters</th>
                                        <th>Sync Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(()=>{
                                        if(this.state.stations_list instanceof Array){
                                            return this.state.stations_list.map((station, index)=>{
                                                let parameters = this.getParameters(station.parameters);
                                                let isOnline = (station.status == 'active')? true: false;
                                                return <tr key={station.id}>
                                                    <td>{index}</td>
                                                    <td>
                                                        {(()=>{
                                                            if(isOnline){
                                                                return <svg className="status_icon" version="1.1" height="10" width="10"  id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style={{enableBackground: 'new 0 0 50 50'}} xmlSpace="preserve">
                                                                    <circle style={{fill: 'var(--online)'}} cx={25} cy={25} r={25} />
                                                                </svg>;

                                                            } else{
                                                                return <svg className="status_icon" version="1.1" height="10" width="10"  id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style={{enableBackground: 'new 0 0 50 50'}} xmlSpace="preserve">
                                                                    <circle style={{fill: 'var(--offline)'}} cx={25} cy={25} r={25} />
                                                                </svg>;
                                                            }
                                                        })()}
                                                        {station.name}
                                                    </td>
                                                    <td dangerouslySetInnerHTML={{ __html: parameters }}></td>
                                                    <td>{station.sync_status}</td>
                                                    <td>
                                                        <button className="configure" onClick={()=>this.getStationDetails(station.id)}>
                                                            <svg version="1.1" height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129" xmlnsXlink="http://www.w3.org/1999/xlink" enableBackground="new 0 0 129 129">
                                                                <g>
                                                                    <path style={{fill: 'var(--dark)'}} d="m40.4,121.3c-0.8,0.8-1.8,1.2-2.9,1.2s-2.1-0.4-2.9-1.2c-1.6-1.6-1.6-4.2 0-5.8l51-51-51-51c-1.6-1.6-1.6-4.2 0-5.8 1.6-1.6 4.2-1.6 5.8,0l53.9,53.9c1.6,1.6 1.6,4.2 0,5.8l-53.9,53.9z" />
                                                                </g>
                                                            </svg> 
                                                        </button>
                                                    </td>
                                                </tr>;
                                            })
                                        }else if(this.state.isLoading == false){
                                            return <tr>
                                                <td colSpan={5}>
                                                    No Records Found
                                                </td>
                                            </tr>
                                        }
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    }
                })()}
            </div>
        )
    }
}

export default StationList
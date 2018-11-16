import React, { Component } from 'react';
import Loading from '../Loading/Loading.js';

class Station extends Component{

    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            station_details: {},
            parameter_list: [],
            updated_station: {},
            editMode: true,
            is_form_valid: false
        }
        this.onDelete = this.onDelete.bind(this);
        this.onExit = this.onExit.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.getStationDetails = this.getStationDetails.bind(this);
        this.getParameterList = this.getParameterList.bind(this);
        this.updateData = this.updateData.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.unselectParameter = this.unselectParameter.bind(this);
        this.addNewStation = this.addNewStation.bind(this);
        this.updateStationDetails = this.updateStationDetails.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.toEditMode = this.toEditMode.bind(this);
        this.deleteStation = this.deleteStation.bind(this);
    }

    toEditMode(){
        this.setState({
            editMode:true
        })
    }

    resetForm(){

        let data_state = {},self = this;

        if(this.props.station_id){
            data_state = JSON.parse(JSON.stringify(this.state.station_details));
        }else{
            data_state = {
                name:'',
                address:'',
                parameters:[]
            }
        }

        console.log(data_state);

        this.setState({
            updated_station: data_state
        },()=>{
            self.isFormValid();
        })
    }

    isFormValid(){

        let form_data = this.state.updated_station;

        let isValid = true;

        if(!form_data.name || form_data.name == '' || !form_data.address || form_data.address == '' || !form_data.parameters || form_data.parameters.length <= 0 ){
            isValid = false;
        }

        this.setState({
            is_form_valid: isValid
        })

    }

    onExit(){
        this.props.onExit();
    }

    onUpdate(){
        this.props.onUpdate();
    }

    onDelete(){
        this.props.onDelete();
    }

    onAddNew(){
        this.props.onAddNew();
    }

    getParameterList(){
        let self = this;
        fetch('http://5bed7bcd7839000013e6f9b4.mockapi.io/parameters')
            .then( response => response.json() )
            .then( (result) => {
                self.setState({
                    isLoading: false,
                    parameter_list: result
                })
            })
            .catch((error)=>{console.log(error)});
    }

    unselectParameter(index){

        let stataion_data = this.state.updated_station;

        stataion_data.parameters.splice(index, 1)

        this.setState({
            updated_station : stataion_data
        })

    }

    getStationDetails(){
        let self = this;

        self.setState({
            isLoading: true
        })
        
        fetch('http://5bed7bcd7839000013e6f9b4.mockapi.io/stations/'+this.props.station_id)
            .then( response => response.json() )
            .then( (result) => {
                self.setState({
                    isLoading: false,
                    station_details: result,
                    editMode:false
                },()=>{
                    self.resetForm();
                })
            })
            .catch((error)=>{console.log(error)});
    }

    updateData(key,value){
        console.log(key, value);

        let self = this, form_data = this.state.updated_station;

        if(key != 'parameters'){
            form_data[key] = value;
        }else{
            if(form_data[key].indexOf(value) == -1){
                form_data[key].push(value);
            }
        }

        this.setState({
            updated_station: form_data
        },()=>{
            self.isFormValid();
        })

    }

    addNewStation(){

        let station_date = this.state.updated_station, self = this;

        fetch('http://5bed7bcd7839000013e6f9b4.mockapi.io/stations',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(station_date)
        }).then( response => response.json() )
            .then( (result) => {
                self.onAddNew();
            })
            .catch((error)=>{console.log(error)});

    }

    updateStationDetails(){

        let station_date = this.state.updated_station, self = this;

        fetch('http://5bed7bcd7839000013e6f9b4.mockapi.io/stations/'+this.props.station_id,{
            method: 'PUT',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(station_date)
        }).then( response => response.json() )
            .then( (result) => {
                self.onUpdate();
            })
            .catch((error)=>{console.log(error)});

    }

    deleteStation(){

        let self = this;

        fetch('http://5bed7bcd7839000013e6f9b4.mockapi.io/stations/'+this.props.station_id,{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then( response => response.json() )
            .then( (result) => {
                self.onDelete();
            })
            .catch((error)=>{console.log(error)});

    }

    handleFormSubmit(){

        if(this.props.station_id){
            this.updateStationDetails();
        }else{
            this.addNewStation();
        }

    }

    componentDidMount(){
        console.log(this.props.station_id);
        if(this.props.station_id){
            this.getStationDetails();
        }else{
            this.resetForm();
        }
        this.getParameterList();

    }

    // "address": "road 1, city 1, state 1, pin: 700001",
    //         "sync_status": "sync",
    //         "parameters": ["prm1", "prm3"],

    render(){
        return(
            <div className="fullheight">
                {(()=>{
                    if(this.state.isLoading){
                        return <Loading></Loading>;
                    }else {
                        return <div id="station_details_form">
                            <div className="heading">
                                {(()=>{
                                    if(this.state.editMode){
                                        return <input id="name" type="text" value={this.state.updated_station.name} onChange={(e)=>{this.updateData('name',e.target.value)}} />
                                    }else{
                                        return <lebel> {this.state.updated_station.name} </lebel>
                                    }
                                })()}    
                                <button className="edit_button" disabled={this.state.editMode} onClick={()=>{this.toEditMode()}}> Edit </button>
                                <button className="close_button" onClick={()=>{this.onExit()}}> Close </button>
                            </div>
                            <div className="body">
                                
                                <div className="row">
                                    <div className="lebel">
                                        Station Status :
                                    </div>

                                    <div className="value">
                                        {(this.state.station_details && this.state.station_details.status)? this.state.station_details.status : 'NA'}
                                    </div>

                                    <div className="lebel">
                                        Sync Status :
                                    </div>

                                    <div className="value">
                                        {(this.state.station_details && this.state.station_details.sync_status)? this.state.station_details.sync_status : 'NA'}
                                    </div>
                                
                                </div>
                                
                                <div className="row">
                                    <div className="lebel">
                                        Station Address :
                                    </div>
                                    <div className="value">
                                        {(()=>{
                                            if(this.state.editMode){
                                                return <input id="address" type="text" value={this.state.updated_station.address} onChange={(e)=>{this.updateData('address',e.target.value)}} />
                                            }else{
                                                return <div> {this.state.updated_station.address}</div>
                                            }
                                        })()}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="lebel">
                                        Station Parameters
                                    </div>
                                    <div className="station_parameters">
                                        <div className="param_list">
                                            {(()=>{
                                                if(this.state.updated_station.parameters && this.state.updated_station.parameters.length){
                                                    return this.state.updated_station.parameters.map((param, index)=>{
                                                        return <lebel className="param"> {param} <button className={((this.state.editMode)? '': 'invisivle')} onClick={()=>{ this.unselectParameter(index) }} > x </button> </lebel>;
                                                    })
                                                }else{
                                                    return <lebel className="no-param">No parameters selected</lebel>;
                                                }
                                            })()}
                                        </div>
                                        <div className="select_parameter">
                                            <select id="parameter" className={((this.state.editMode)? '': 'invisivle')} onChange={(e)=>{this.updateData('parameters', e.target.value)}} >
                                                {(()=>{
                                                    if(this.state.parameter_list && this.state.parameter_list.length){
                                                        return this.state.parameter_list.map((param)=>{
                                                            return <option value={param.key} > {param.name} ( {param.key} ) </option>;
                                                        })
                                                    }else{
                                                        return <option>No Parameters Found</option>;
                                                    }
                                                })()}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form_buttons">
                                <button className="reset" onClick={()=>{this.resetForm()}} > Reset </button>
                                <button className="success" disabled={(!this.state.is_form_valid || !this.state.editMode)} onClick={()=>{this.handleFormSubmit()}} > {(this.props.station_id)? "Save" : "Add"} </button>
                                <button className="delete" onClick={()=>{this.deleteStation()}} > Delete </button>
                            </div>
                        </div>;
                    }
                })()}
            </div>
        )
    }
}

export default Station
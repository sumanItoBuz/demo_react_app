import React, { Component } from 'react';

class Station extends Component{

    constructor(props){
        super(props);
        this.state = {
            station_details:{}
        }
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

    componentDidMount(){

    }

    render(){
        return(
            <div>
                
            </div>
        )
    }
}

export default Station
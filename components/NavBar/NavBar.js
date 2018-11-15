import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class NavBar extends Component{
    render(){
        return(
            <div id="nav">
                <NavLink activeClassName="active" to="/stations">Stations</NavLink>
                <NavLink activeClassName="active" to="/parameters">Parameter</NavLink>
            </div>
        )
    }
}

export default NavBar
//dependency
import React, { Component } from 'react';
import { Route, HashRouter as Router } from 'react-router-dom'

//components
import NavBar from './components/NavBar/NavBar.js';
import StationList from './components/StationList/StationList.js';
import Station from './components/Station/Station.js';
import ParameterList from './components/ParameterList/ParameterList.js';
import Parameter from './components/Parameter/Parameter.js';

class App extends Component{
   render(){
      return(
         <div className="fullheight">
            <Router>
               <div className="fullheight">
                  <NavBar></NavBar>
                  <div id="body">
                     <Route exact path='/' component={StationList}></Route>  
                     <Route path='/stations' component={StationList}></Route>  
                     <Route path='/parameters' component={ParameterList}></Route>
                  </div>
               </div>
            </Router>
         </div>
      );
   }
}
export default App;
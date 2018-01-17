import React, { Component } from 'react';
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            numMain: 1
        }
    }
   
    render() {
        var mainComponents = [];
        var colWidth =  12/this.state.numMain;
        if(colWidth < 4) colWidth = 4;
        for(let i = 0; i < this.state.numMain; i++){
            mainComponents.push(
                <div className={"col-md-" + colWidth} key={i}>
                    <Main />
                </div>
            );
        }
        return (
          <div>
            <Navbar />
            <div className="container">
                <button className="btn btn-success" id="addBtn" 
                    onClick={(e) => {this.setState({numMain: this.state.numMain+1})}}>
                    Add Widget
                </button>
                <button className="btn btn-danger" id="removeBtn" 
                    onClick={(e) => {if(this.state.numMain > 1) this.setState({numMain: this.state.numMain-1})}}>
                    Remove Widget
                </button>
                <div className="row">
                    {mainComponents}
                </div>
            </div>
          </div>
        );
    }
}

export default App;

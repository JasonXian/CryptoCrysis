import React, { Component } from 'react';
import './bootstrap-cyborg.min.css';

var getCurrentDate = function(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let zero = "0"
    if(month >= 10) zero = "";
    return "" + year + "-" + zero + month + "-" + day;
}

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            investedMoney: 0,
            cryptoCurr: "BTC",
            currentDate: getCurrentDate(),
            currentPrice: 0,
            purchaseDate: "2013-09-01",
            purchasePrice: 0
        }
        this.submitData = this.submitData.bind(this);
    }
    
    submitData(e){
        e.preventDefault();
        var purchaseDate = this.state.purchaseDate;
        var apiURL = "https://api.coindesk.com/v1/bpi/historical/close.json?start=" + purchaseDate + "&end=" + purchaseDate;
        var currentURL = "https://api.coindesk.com/v1/bpi/currentprice.json";
        fetch(apiURL)
        .then((res) => res.json())
        .then((data) => {
            this.setState({...this.state, purchasePrice: parseInt(data["bpi"][purchaseDate], 10)});
        });
        fetch(currentURL)
        .then((res) => res.json())
        .then((data) => {
            this.setState({...this.state, currentPrice: parseInt(data["bpi"]["USD"]["rate_float"], 10)});
        });
    }
    
    render() {
        var amountMade = this.state.investedMoney / this.state.purchasePrice * this.state.currentPrice;
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                    <h1>What if I ... </h1>
                    </div>
                    <div className="panel-body">
                        <form className="form-group" onSubmit={this.submitData}>
                            <label htmlFor="investedMoney">I put (USD)</label>
                            <input type="number" name="investedMoney" min="0" id="investedMoney" className="form-control" 
                                value={this.state.investedMoney} onChange={(e) => this.setState({investedMoney: e.target.value})}/>
                            <label htmlFor="cryptoCurr">Into</label>
                            <input type="text" name="cryptoCurr" id="cryptoCurr" className="form-control" 
                                value={this.state.cryptoCurr} onChange={(e) => this.setState({cryptoCurr: e.target.value})}/>
                            <label htmlFor="purchaseDate">On</label>
                            <input type="date" name="purchaseDate" id="purchaseDate" min="2010-08-17" max={this.state.currentDate} className="form-control" 
                                value={this.state.purchaseDate} onChange={(e) => this.setState({purchaseDate: e.target.value})}/>
                            <input className="btn btn-primary" type="submit"/>
                            <h2>
                                It would have costed {this.state.purchasePrice} for 1 {this.state.cryptoCurr}
                            </h2>
                            <h2>
                                You would have made ${amountMade}
                            </h2>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;

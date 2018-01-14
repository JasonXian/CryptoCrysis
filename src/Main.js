import React, { Component } from 'react';
import "./bootstrap-cyborg.min.css";

var getCurrentDate = function(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let zero = "0"
    if(month >= 10) zero = "";
    return "" + year + "-" + zero + month + "-" + day;
}

var getDateUnix = function(date){
    return (new Date(date)).getTime() / 1000;
}

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            investedMoney: 0,
            cryptoCurr: "BTC",
            minDate: "2010-08-17",
            currentDate: getCurrentDate(new Date()),
            currentPrice: 0,
            purchaseDate: "2013-09-01",
            purchasePrice: 0
        }
        this.submitData = this.submitData.bind(this);
        this.updateDateRange = this.updateDateRange.bind(this);
    }
    
    submitData(e){
        e.preventDefault();
        var purchaseDate = this.state.purchaseDate;
        var purchasePrice, oldURL, currentURL;
        if(this.state.cryptoCurr === "BTC"){
            oldURL = "https://api.coindesk.com/v1/bpi/historical/close.json?start=" + purchaseDate + "&end=" + purchaseDate;
            currentURL = "https://api.coindesk.com/v1/bpi/currentprice.json";
            fetch(oldURL)
            .then((res) => res.json())
            .then((data) => {
                purchasePrice = parseFloat(data["bpi"][purchaseDate], 10);
                fetch(currentURL)
                .then((res) => res.json())
                .then((data) => {
                    this.setState({...this.state, currentPrice: parseFloat(data["bpi"]["USD"]["rate_float"], 10), purchasePrice: purchasePrice});
                });
            });
        }else if(this.state.cryptoCurr === "ETH"){
            oldURL = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=" + getDateUnix(purchaseDate);
            currentURL = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=" + Date.now();
            fetch(oldURL)
            .then((res) => res.json())
            .then((data) => {
                purchasePrice = parseFloat(data["ETH"]["USD"], 10);
                fetch(currentURL)
                .then((res) => res.json())
                .then((data) => {
                    this.setState({...this.state, currentPrice: parseFloat(data["ETH"]["USD"], 10), purchasePrice: purchasePrice});
                });
            });
        }
    }
    
    updateDateRange(e){
        var newMin;
        if(e.target.value === "BTC"){
            newMin = "2010-08-17";
        }else if(e.target.value === "ETH"){
            newMin = "2015-09-01";
        }
        this.setState({...this.state, minDate: newMin, cryptoCurr: e.target.value, purchaseDate: newMin, purchasePrice: 0, currentPrice: 0});
    }
    
    render() {
        var amountMade = (this.state.investedMoney / this.state.purchasePrice * this.state.currentPrice) || 0;
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                    <h1>What if I ... </h1>
                    </div>
                    <div className="panel-body">
                        <form className="form-group" onSubmit={this.submitData}>
                            <label htmlFor="investedMoney">Put ($USD)</label>
                            <input type="number" name="investedMoney" min="0" id="investedMoney" className="form-control" 
                                value={this.state.investedMoney} onChange={(e) => this.setState({investedMoney: e.target.value})}/>
                            <label htmlFor="cryptoCurr">Into</label>
                            <select name="cryptoCurr" id="cryptoCurr" className="form-control" 
                                value={this.state.cryptoCurr} onChange={this.updateDateRange}>
                                <option value="BTC">Bitcoin (BTC)</option>
                                <option value="ETH">Ethereum (ETH)</option>
                            </select>
                            <label htmlFor="purchaseDate">On</label>
                            <input type="date" name="purchaseDate" id="purchaseDate" min={this.state.minDate} max={this.state.currentDate} className="form-control" 
                                value={this.state.purchaseDate} onChange={(e) => this.setState({purchaseDate: e.target.value})}/>
                            <input className="btn btn-primary" type="submit"/>
                            <h2>
                                It would have costed ${this.state.purchasePrice.toFixed(2)} for 1 {this.state.cryptoCurr}
                            </h2>
                            <h2>
                                And it is currently ${this.state.currentPrice.toFixed(2)} for 1 {this.state.cryptoCurr}
                            </h2>
                            <h2>
                                You would currently have ${amountMade.toFixed(2)} worth of {this.state.cryptoCurr}
                            </h2>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;

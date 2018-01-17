import React, { Component } from 'react';
import "./bootstrap-cyborg.min.css";
import "./Main.css"

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

var flavourTextSad = ["Yikes.", "Better luck next time!", "Guess you didn't hop on the bandwagon fast enough...", "Hopefully you still have a job..", "It's bound to go back up!"];
var flavourTextNeutral = ["Not bad, not great.", "It could be worse.", "It'll explode in no time!", "It could be better.", "Just keep on waiting..."];
var flavourTextHappy = ["You're rich!", "You're crazy for holding that long ... but congrats!", "You should probably sell quick!", "Well, time to quit your job.", "Lucky!"];

var getFlavourText = function(investedMoney, currentPrice, purchasePrice){
    var flavourText;
    var randomNum = Math.floor(Math.random() * 5);
    if(investedMoney === 0){
        flavourText = "";    
    }else if(currentPrice/purchasePrice >= 100){
        flavourText = flavourTextHappy[randomNum];
    }else if(currentPrice/purchasePrice < 1){
        flavourText = flavourTextSad[randomNum];
    }else{
        flavourText = flavourTextNeutral[randomNum];
    }
    return flavourText;
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
            purchaseDate: "2010-08-17",
            purchasePrice: 0,
            status: "Fetch Data",
            flavourText: "\n"
        }
        this.submitData = this.submitData.bind(this);
        this.updateDateRange = this.updateDateRange.bind(this);
    }
    
    submitData(e){
        e.preventDefault();
        this.setState({...this.state, status: "Fetching..."});
        var purchaseDate = this.state.purchaseDate;
        var cryptoCurr = this.state.cryptoCurr;
        var purchasePrice, oldURL, currentURL;
        oldURL = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + cryptoCurr + "&tsyms=USD&ts=" + getDateUnix(purchaseDate);
        currentURL = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + cryptoCurr + "&tsyms=USD&ts=" + Date.now();
        fetch(oldURL)
        .then((res) => res.json())
        .then((data) => {
            purchasePrice = parseFloat(data[cryptoCurr]["USD"], 10);
            fetch(currentURL)
            .then((res) => res.json())
            .then((data) => {
                var currentPrice = parseFloat(data[cryptoCurr]["USD"], 10);
                this.setState({
                    ...this.state,
                    currentPrice: currentPrice,
                    purchasePrice: purchasePrice,
                    status: "Fetch Data",
                    flavourText: getFlavourText(this.state.investedMoney, currentPrice, purchasePrice)
                });
            });
        });
    }
    
    updateDateRange(e){
        var newMin;
        if(e.target.value === "BTC"){
            newMin = "2010-08-17";
        }else if(e.target.value === "BCH"){
            newMin = "2017-08-01";
        }else if(e.target.value === "DASH"){
            newMin = "2014-02-03";
        }else if(e.target.value === "DOGE"){
            newMin = "2015-12-06";
        }else if(e.target.value === "ETH"){
            newMin = "2015-09-01";
        }else if(e.target.value === "LTC"){
            newMin = "2013-09-29";
        }else if(e.target.value === "XRP"){
            newMin = "2015-02-01";
        }
        this.setState({
            ...this.state,
            minDate: newMin,
            cryptoCurr: e.target.value,
            purchaseDate: newMin,
            purchasePrice: 0,
            currentPrice: 0
        });
    }
    
    render() {
        var amountMade = (this.state.investedMoney / this.state.purchasePrice * this.state.currentPrice) || 0;
        var rounding = 2;
        if(this.state.purchasePrice === "XRP") rounding = 4;
        if(this.state.cryptoCurr === "DOGE") rounding = 6;
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                    <h2>What if you... </h2>
                    </div>
                    <div className="panel-body">
                        <form className="form-group" onSubmit={this.submitData}>
                            <label htmlFor="investedMoney">Put ($USD)</label>
                            <input type="number" name="investedMoney" min="0" id="investedMoney" className="form-control" step="0.01"
                                value={this.state.investedMoney} onChange={(e) => this.setState({investedMoney: e.target.value})} required/>
                            <label htmlFor="cryptoCurr">Into</label>
                            <select name="cryptoCurr" id="cryptoCurr" className="form-control" 
                                value={this.state.cryptoCurr} onChange={this.updateDateRange}>
                                <option value="BTC">Bitcoin (BTC)</option>
                                <option value="BCH">Bitcoin Cash (BCH)</option>
                                <option value="DASH">Dash (DASH)</option>
                                <option value="DOGE">Dogecoin (DOGE)</option>
                                <option value="ETH">Ethereum (ETH)</option>
                                <option value="LTC">Litecoin (LTC)</option>
                                <option value="XRP">Ripple (XRP)</option>
                            </select>
                            <label htmlFor="purchaseDate">On</label>
                            <input type="date" name="purchaseDate" id="purchaseDate" min={this.state.minDate} max={this.state.currentDate} className="form-control" 
                                value={this.state.purchaseDate} onChange={(e) => this.setState({purchaseDate: e.target.value})} required/>
                            <input className="btn btn-primary" type="submit" value={this.state.status}/>
                            <h4>
                                It costed ${this.state.purchasePrice.toFixed(rounding)} for 1 {this.state.cryptoCurr}
                            </h4>
                            <h4>
                                It is now ${this.state.currentPrice.toFixed(rounding)} for 1 {this.state.cryptoCurr}
                            </h4>
                            <h4>
                                You currently have ${amountMade.toFixed(rounding)} of {this.state.cryptoCurr}
                            </h4>
                            <h4>
                                {this.state.flavourText}
                            </h4>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;

import React, { Component } from 'react';
import github from "./github.png"
import "./bootstrap-cyborg.min.css";
import "./Main.css";

class Navbar extends Component{
    render(){
        return(
            <nav className="navbar navbar-default">
              <div className="container">
                <div className="navbar-header">
                  <a className="navbar-brand" href="">Crypto Crysis</a>
                </div>
                <div>
                  <ul className="nav navbar-nav navbar-right">
                    <li id="githubContainer">
                      <a id="githubLink" href="https://github.com/JasonXian/CryptoCrysis" target="_blank" rel="noopener noreferrer">
                        <img id="githubIcon" src={github} alt="Github"/>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
        );
    }
}

export default Navbar;
import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import "./App.css";
import LogoUrl from './assets/images/logo.png';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
function Logo(){
  return(
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-6 logo-header text-right pr-2">
        <Link to="/">
          <img src={LogoUrl} alt="Chem 101" className="logo"/>
          </Link>
        </div>
        <div className="col-sm-5 text-right">
        <LinkContainer to="/settings">
            <NavItem><SettingsIcon style={{fontSize:"15px"}}/></NavItem>
        </LinkContainer>
        </div>
      </div>
    </div>
  )
}
function Navigation(){
  return(
    <div className="container-fluid" id="navigation">
      <div className="row">
        <div className="col-sm-4 nav">
          Assignment
        </div>
        <div className="col-sm-4 nav">
          Class
        </div>
        <div className="col-sm-4 nav" style={{color:"#E43A30"}}>
          Questions
        </div>
        
      </div>
    </div>
  )
}

function TitleBar(){
  return(
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 text-center" style={{backgroundColor:"#E43A30",color:"white"}}>
          <h4>Questions</h4>
        </div>
        
      </div>
    </div>
  )
}

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <div className="App container-fluid">
        
        <Navbar fluid collapseOnSelect>
          {isAuthenticated? (<><Logo />
                <Navigation />
               <TitleBar /></>):
               (<>
                <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Home</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
              
            </Nav>
          </Navbar.Collapse>
               </>)
               }
         
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
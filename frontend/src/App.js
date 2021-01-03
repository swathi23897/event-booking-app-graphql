
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from './Pages/auth'
import BookingPage from './Pages/Booking'
import EventsPage from './Pages/Events'
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context'

class App extends React.Component {
  state = {
    token: null,
    userId: null
  }
  login = (token, userId, tokenExpiration) => {
    console.log("inside login ", userId)
    this.setState({ token: token, userId: userId }, () => {
      console.log(this.state.userId)
    })
  }
  logout = () => {
    this.setState({ token: null, userId: null });

  }
  render() {

    return (


      <BrowserRouter>
        <AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
          <MainNavigation />
          <main className="main-content">
            <Switch>
        
              
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              {this.state.token && <Redirect path="/" to="/events" exact />}
              {this.state.token && <Redirect path="/auth" to="/events" exact />}
              <Route path="/events" component={EventsPage} />
              {this.state.token && <Route path="/bookings" component={BookingPage} />}

              {!this.state.token && <Redirect to="/auth"  />}
            </Switch>
          </main>
        </AuthContext.Provider>

      </BrowserRouter>

    );
  }

}
export default App;

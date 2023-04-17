/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 1234567.89,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }
    
    // When the component (the app itself) is loaded, run this
    async componentDidMount() {
        // Set the URL for our default credits/debits json files
        const defaultCredits = "https://johnnylaicode.github.io/api/credits.json"
        const defaultDebits = "https://johnnylaicode.github.io/api/debits.json"
        
        // Asynchronously fetch the credits/debits json files
        const fetchedCredits = await fetch(defaultCredits)
        const fetchedDebits = await fetch(defaultDebits)
        
        // Convert the fetched data, when it is ready, to json/object form
        const jsonCredits = await fetchedCredits.json()
        const jsonDebits = await fetchedDebits.json()
        
        // Add every credit to our credits list, when they are ready
        for (let item of await jsonCredits) {
            this.state.creditList.push(await item)
        }
        
        // Add every debit to our debits list, when they are ready
        for (let item of await jsonDebits) {
            this.state.debitList.push(await item)
        }
        
        // Update the account balances based on the imported data
        this.updateBalance();
    }
    
    // Updates the account balances
    updateBalance() {
        // Keep track of our new balance
        let counter = 0;
        
        // For every credit, increment our counter by its amount
        for (let item of this.state.creditList) {
            counter += item.amount
        }
        
        // For every debit, decrement our counter by its amount
        for (let item of this.state.debitList) {
            counter -= item.amount
        }
        
        // Cut off anything in the counter past two decimal places
        counter = counter.toFixed(2)
        
        // Set the accountBalance to our counter (the balance we just calculated)
        this.setState({accountBalance: counter})
    }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
      const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
      
      // For Credits and Debits, pass the account balance (to display at the bottom) and respective lists & functions (to display and modify)
      const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} accountBalance={this.state.accountBalance}/>)
      const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} accountBalance={this.state.accountBalance}/>)

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/webdev-bank">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;

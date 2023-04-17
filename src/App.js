/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/

// Import our primary components
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

// Define our App component
class App extends Component {
  // Create and initialize state, including creditList, debitList, and accountBalance
  constructor() {
    super();
    this.state = {
      accountBalance: 0,
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
    
    // Add debits as inputted on the form
    addDebit = (event) => {
        // Override default form submission behavior completely (prevents the post-submit refresh)
        event.preventDefault()
        
        // Create a blank debit object
        let debit = {}
        
        // Set all of the properties of our object
        debit.id = this.state.debitList.length + 1 // IDs start at one here, so increment length of debits
        debit.amount = parseFloat(event.target[1].value) // We already validated the decimal places before, so just convert string->float and set
        debit.description = event.target[0].value // Just set this property to the one from the form
        debit.date = new Date().toISOString() // Get the current date and make it into ISO format
        
        // Add this new object to our debits list
        this.state.debitList.push(debit)
        
        // Update the balance state across all pages
        this.updateBalance();
        
        console.log(this.state.debitList)
        
        // Clear the form (since we overrode the default post-submit refresh which also does this)
        event.target.reset()
    }
    
    // Add credits as inputted on the form
    addCredit = (event) => {
        // Override default form submission behavior completely (prevents the post-submit refresh)
        event.preventDefault()
        
        // Create a blank credit object
        let credit = {}
        
        // Set all of the properties of our object
        credit.id = this.state.creditList.length + 1 // IDs start at one here, so increment length of credits
        credit.amount = parseFloat(event.target[1].value) // We already validated the decimal places before, so just convert string->float and set
        credit.description = event.target[0].value // Just set this property to the one from the form
        credit.date = new Date().toISOString() // Get the current date and make it into ISO format
        
        // Add this new object to our credits list
        this.state.creditList.push(credit)
        
        console.log(this.state.creditList)
        
        // Update the balance state across all pages
        this.updateBalance();
        
        // Clear the form (since we overrode the default post-submit refresh which also does this)
        event.target.reset()
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

// Export our App component
export default App;

/*==================================================
src/components/Credits.js
==================================================*/

// Import Link as well as the balance component
import {Link} from 'react-router-dom';
import AccountBalance from './AccountBalance';

// Define our credits component
const Credits = (props) => {
  // Create the list of Credit items
  let creditsView = () => {
    const { credits } = props;
    return credits.map((credit) => {  // Extract "id", "amount", "description" and "date" properties of each credit JSON array element
      let date = credit.date.slice(0,10);
      return <li key={credit.id}>{credit.amount} {credit.description} {date}</li>
    });
  }

  // Render the list of Credit items and a form to input new Credit item
  // We use placeholders in the forms so it is understandable what either
  // text field is, and a step of 0.01 on the amount so values can only be
  // multiples of one cent (and thus only two digits after the decimal)
  return (
    <div>
      <h1>Credits</h1>

      {creditsView()}

      <form onSubmit={props.addCredit}>
        <input type="text" name="description" placeholder="Description" />
        <input type="number" name="amount" placeholder="Amount" step="0.01" />
        <button type="submit">Add Credit</button>
      </form>
      <br/>
      <AccountBalance accountBalance={props.accountBalance}/>
      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

// Export our credits component
export default Credits;

/*==================================================
src/components/Debits.js
==================================================*/

// Import Link as well as the balance component
import {Link} from 'react-router-dom';
import AccountBalance from './AccountBalance';

// Define our debits component
const Debits = (props) => {
  // Create the list of Debit items
  let debitsView = () => {
    const { debits } = props;
    return debits.map((debit) => {  // Extract "id", "amount", "description" and "date" properties of each debits JSON array element
      let date = debit.date.slice(0,10);
      return <li key={debit.id}>{debit.amount} {debit.description} {date}</li>
    });
  }
    
  // Render the list of Debit items and a form to input new Debit item
  // We use placeholders in the forms so it is understandable what either
  // text field is, and a step of 0.01 on the amount so values can only be
  // multiples of one cent (and thus only two digits after the decimal)
  return (
    <div>
      <h1>Debits</h1>

      {debitsView()}

      <form onSubmit={props.addDebit}>
        <input type="text" name="description" placeholder="Description" />
        <input type="number" name="amount" placeholder="Amount" step="0.01" />
        <button type="submit">Add Debit</button>
      </form>
      <br/>
      <AccountBalance accountBalance={props.accountBalance}/>
      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

// Export our debits component
export default Debits;

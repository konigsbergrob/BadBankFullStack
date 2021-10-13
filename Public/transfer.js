function Transfer(){
    const [show, setShow]     = React.useState(true);
    const [status, setStatus] = React.useState(''); 
    const [status2, setStatus2] = React.useState(''); 
  
    return (
      <Card
        bgcolor="secondary"
        header="Please use this form in order to initiate a TRANSFER to your account."
        status={status}
        status2 = {status2}
        body={show ? 
          <TransferForm setShow={setShow} setStatus={setStatus} setStatus2={setStatus2}/> :
          <TransferMsg setShow={setShow} setStatus={setStatus}setStatus2={setStatus2}/>}
      />
    )
  }
  
  function TransferMsg(props){
    return (<>
      
      <br />
      <button type="submit" 
        className="btn btn-light" 
        onClick={() => {
            props.setShow(true);
            props.setStatus('');
        }}>
          Make another transfer!
      </button>
    </>);
  } 
  
  function TransferForm(props){
    const [email, setEmail]   = React.useState('');
    const [email2, setEmail2] = React.useState('');
    const [amount, setAmount] = React.useState('');
  
    function handle(){
      fetch(`/account/findOne/${email2}`)
      .then(response => response.text())
      .then(text => {
          try {
            const data = JSON.parse(text);
            console.log(amount)
            console.log(data.balance)
            console.log(amount<data.balance)
              if (amount<data.balance){
                fetch(`/account/update/${email}/${amount}`)
                .then(response => response.text())
                .then(text => {
                    try {
                        const data = JSON.parse(text);
                        props.setStatus("Transaction successful! The receiver's new balance is: $" + JSON.stringify(data.value.balance));
                        props.setShow(false);
                        console.log('JSON:', data);
                    } catch(err) {
                        props.setStatus('Deposit failed')
                        console.log('err:', text);
                    }
                });
                fetch(`/account/update/${email2}/-${amount}`)
                .then(response => response.text())
                .then(text => {
                    try {
                        const data = JSON.parse(text);
                        props.setStatus2("The sender's new balance is: $" + JSON.stringify(data.value.balance));
                        props.setShow(false);
                        console.log('JSON:', data);
                    } catch(err) {
                        props.setStatus2('Deposit failed')
                        console.log('err:', text);
                    }
                });}
              else {
                props.setShow(false)
                props.setStatus("You don't have adequate funds for this withdrawl. Short by: $" + (amount-data.balance))}
              console.log('JSON:', data);    
          } catch(err) {
              console.log('err:', text);
          }
      });   
      
      
  
    }
  
    return(<>
  
      Email (receiver) <br/>
      <input type="input" 
        className="form-control" 
        placeholder="Enter receiver email" 
        value={email} onChange={e => setEmail(e.currentTarget.value)}/><br/>

      Email (sender) <br/>
      <input type="input" 
        className="form-control" 
        placeholder="Enter sender email" 
        value={email2} onChange={e => setEmail2(e.currentTarget.value)}/><br/>    
        
      Amount<br/>
      <input type="number" 
        className="form-control" 
        placeholder="Enter amount" 
        value={amount} onChange={e => setAmount(e.currentTarget.value)}/><br/>
  
      <button type="submit" 
        className="btn btn-light" 
        onClick={handle}>Deposit</button>
  
    </>);
  }
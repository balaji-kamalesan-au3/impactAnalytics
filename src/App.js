import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Divider,Header,Icon, Input,Card, Image,Button, Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

function App() {

  const [userData, setUserData] = useState([]);
  const [userCard,setUserCard] = useState([]);
  const [approvedUser, setApprovedUser] = useState([]);
  const [rejectedUser, setRejectedUser] = useState([]);

  useEffect(() => {
      fetch("https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json")
          .then(data => data.json())
          .then(data => {setUserData(data); setUserCard(data)});
  },[])

  const searchOnChange = (e) => {
    const term = e.target.value;
    let newData = [];
    newData = userCard.filter((user) => {
        return user.name.includes(term) || user.id.includes(term)
    })
    setUserCard(newData);
    if(!term) setUserCard(userData);
  }
  const presentInApproved = (id) => {
      return approvedUser.findIndex(user => user.id ===id);
  }
  const presentInRejected = (id) => {
    return rejectedUser.findIndex(user => user.id ===id);
}
  const addApprovedUser = (id) => { 
      console.log(id)
      let rejectedIndex = presentInRejected(id) 
      let accepted =  presentInApproved(id) !== -1;
      let rejected =  presentInRejected(id) !== -1;

      if(!accepted && rejected){
        let temp = rejectedUser;
        temp.splice(rejectedIndex,1);
        setRejectedUser(temp);
        temp = approvedUser;
        temp.push(userData.filter(user => user.id === id)[0]);
        setApprovedUser(temp)
      }
      if(!accepted && !rejected){
        let temp = approvedUser
        temp.push(userData.filter(user => user.id === id)[0]);
        setApprovedUser(temp);
      }
  }

  const addRejectedUser = (id) => {
    console.log(id)
    let acceptedIndex = presentInApproved(id) 
    let accepted =  presentInApproved(id) !== -1;
    let rejected =  presentInRejected(id) !== -1;

    if(accepted && !rejected){
      let temp = approvedUser;
      temp.splice(acceptedIndex,1);
      setApprovedUser(temp);
      temp = rejectedUser;
      temp.push(userData.filter(user => user.id === id)[0]);
      setRejectedUser(temp)
    }
    if(!accepted && !rejected){
      let temp = rejectedUser
      temp.push(userData.filter(user => user.id === id)[0]);
      setRejectedUser(temp);
    }
  }

  console.log(userCard);
  return (
    <div className="App">
  
      <Container textAlign='center'>
          <Image.Group size="small">
              <Image src={"https://prnewswire2-a.akamaihd.net/p/1893751/sp/189375100/thumbnail/entry_id/1_ktmhwzlw/def_height/344/def_width/657/version/100011/type/2/q/100"} />
              <Icon name='users' circular />
          </Image.Group>
          <Header as='h2' icon textAlign='center'> 
            <Header.Content>Job Portal</Header.Content>
          </Header>
      </Container>
      <Divider />
      <Button.Group>
        <Button onClick = {() => setUserCard(userData) }>All</Button>
        <Button.Or />
        <Button onClick = {() => setUserCard(approvedUser)}>Accepted</Button>
        <Button.Or />
        <Button onClick = {() => setUserCard(rejectedUser)}>Rejected</Button>
      </Button.Group>
      <Divider /> 
      <Input placeholder='Search...' onChange={(e) => searchOnChange(e)} />
      <Divider /> 
      <Container >
        <div className="cardContainer">

          {!userCard.length && <h3 style={{textAlign : 'center'}} >No Data Available</h3> }
          {userCard.length>0  &&   
          userCard.map((user) => ( 
              <div className="cardColumn">  
              <Card>
                <Image  src={user.Image} centered  size="medium"  />
                <Card.Content>
                    <Card.Header>{user.name}</Card.Header>
                    <Card.Meta>
                      <span className='date'>Id - {user.id}</span>
                    </Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    <div className='ui two buttons'>
                      <Button basic color='green' onClick={() => addApprovedUser(user.id) }>
                        Accept
                      </Button>
                      <Button basic color='red' onClick={() => addRejectedUser(user.id)}>
                        Reject
                      </Button>
                    </div>
                  </Card.Content>
              </Card> 
              </div>
          ))
          }
          </div>

      </Container>

    </div>
  );
}

export default App;

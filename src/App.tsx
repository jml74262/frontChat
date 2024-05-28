import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container,Row,Col } from 'react-bootstrap'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import ChartRoom from './components/ChatRoom'
import WaitingRoom from './components/SelectRoom'

function App() {


  const[conn,setConnection] = useState<HubConnection>();
  const[messages,setmessages] = useState<Array<{}>>([])

  const JoinChatRoom = async (username:any,chatroom:any) => {
    try{
      const conn = new HubConnectionBuilder().withUrl("https://contactcenter.dkt.com.mx:88/api/chatHub").configureLogging(LogLevel.Information).build();
      conn.on("JoinSpecificChatRoom",(username,msg) => {console.log("Mensajeeeeee: ",msg);
      // setmessages(messages => [...messages, {username,msg}]);
      setmessages(msg);
      });

      conn.on("ReceiveSpecificMessage",(username,msg) => {
        setmessages(messages => [...messages, {username,msg}]);
      })
      await conn.start();
      await conn.invoke("JoinSpecificChatRoom",{username,chatroom});
      setConnection(conn);
    }catch(e){
      console.log(e);

    }
  }

  const sendMessage = async(message:string) => {
    try{
      await conn?.invoke("SendMessage",message);
    }catch(e){
      console.log(e);
    }
  }

  return (
    <>
     <main>
        <Container>
          <Row clas='px-5 my-5'>
            <Col sm='12'>
              <h1>Bienvenido</h1>
            </Col>
          </Row>
          {!conn ?
          <WaitingRoom joinChatRoom={JoinChatRoom}/>
          :<ChartRoom messages={messages} sendMessage={sendMessage}></ChartRoom>
          }
        </Container>
     </main>
    </>
  )
}

export default App

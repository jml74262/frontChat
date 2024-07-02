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
      const conn = new HubConnectionBuilder().withUrl("https://med.telefem.org:83/chatHub").configureLogging(LogLevel.Information).build();
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
      /* El primer parametro es el nombre del metodo en el backend
      el segundo parametro es el mensaje que se va a enviar
      el tercer parametro es el usuario que envia el mensaje (colocar nombre del paciente o del agente)
      el cuarto parametro es el tipo de mensaje (ya sea mensaje de texto, imagen, video, etc), IMPORTANTE VERIFICAR CON LUIS CÓMO MANEJA ESTO
      el quinto parametro es el attachment (si es que se envia un archivo)
      */
      await conn?.invoke("SendMessage",message,"Enviado por paciente", "Tipo mensaje", null);
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

import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const SendMessageForm = ({sendMessage}:{sendMessage:any}) => {

    const[msg,setMessage] = useState("");

    return<Form onSubmit={e => { e.preventDefault(); sendMessage(msg);setMessage("")}}>

        <InputGroup className="mb-3">
            <InputGroup.Text>Chat</InputGroup.Text>
            <Form.Control onChange={e => setMessage(e.target.value) } value={msg} placeholder="Ingresa el mensaje perro"></Form.Control>
            <Button variant="primary" type="submit" disabled={!msg}>Enviar</Button>
        </InputGroup>
    </Form>

};

export default SendMessageForm;
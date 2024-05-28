import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

interface MongoCollection {
    id: string;
    user_created: string;
    created_at: string;
}

const WaitingRoom = ({ joinChatRoom }: { joinChatRoom: any }) => {
    const [user, setUsername] = useState("");
    const [otherUser, setOtherUser] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [conversaciones, setConversaciones] = useState<MongoCollection[]>([]);

    const SendRequest = (user: string) => {
        setSubmitted(true);

        const myHeaders = new Headers();
        myHeaders.append("accept", "text/plain");

        const url = user.toLowerCase() === "admin" 
            ? "https://contactcenter.dkt.com.mx:88/api/api/Mongo/Conversaciones"
            : `https://contactcenter.dkt.com.mx:88/api/api/Mongo/ConversacionesUsuario?usuario=${user}`;

        fetch(url, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        })
        .then(response => response.json())
        .then((result: MongoCollection[]) => {
            setConversaciones(result);
        })
        .catch(error => console.error(error));
    };

    const CrearNuevaConversacion = (_user: string) => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("Content-Type", "application/json");

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        const raw = JSON.stringify({
            user_created: _user,
            created_at: formattedDate
        });

        fetch("https://localhost:7164/api/Mongo/Conversacion", {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        })
        .then(response => response.json())
        .then((result: MongoCollection) => {
            joinChatRoom(user, result.id);
            console.log(result);
        })
        .catch(error => console.error(error));
    };

    const TestCorsRequest = () => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            user_created: "andrade",
            created_at: "2024-05-21T06:22:12.968Z"
        });

        fetch("https://contactcenter.dkt.com.mx:88/api/api/Mongo/Conversacion", {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        })
        .then(response => response.json())
        .then((result) => {
            console.log("CORS Test Result:", result);
        })
        .catch(error => console.error(error));
    };

    return (
        <>
            {!submitted ? 
                <Form onSubmit={e => {
                    e.preventDefault();
                    SendRequest(user);
                }}>
                    <Row className="px-5 py-5">
                        <Col sm={12}>
                            <Form.Group>
                                <Form.Control placeholder="Usuario" onChange={e => setUsername(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <hr />
                            <Button variant='success' type='submit'>Enviar</Button>
                        </Col>
                    </Row>
                </Form>
                : 
                <div>
                    <Row className="px-5 py-5">
                        <Col sm={12}>
                            {conversaciones.map((conversacion: MongoCollection, index: number) =>
                                <table key={index}>
                                    <tbody>
                                        <tr>
                                            <td>{conversacion.user_created} - {conversacion.created_at}</td>
                                            <td><button onClick={() => joinChatRoom(user, conversacion.id)}>Entrar a la conversación</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </Col>
                        <div style={{ height: "40px" }} />
                        {user.toLowerCase() !== "admin" ? 
                            <Col sm={12}>
                                <button onClick={() => CrearNuevaConversacion(user)}>Crear nueva conversación</button>
                            </Col> : 
                            <Col sm={12}>
                                <Form onSubmit={e => {
                                    e.preventDefault();
                                    CrearNuevaConversacion(otherUser);
                                }}>
                                    <Col sm={12}>
                                        <Form.Group>
                                            <Form.Control placeholder="Usuario a crear nueva conversación" onChange={e => setOtherUser(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <hr />
                                        <Button variant='success' type='submit'>Crear nueva conversación</Button>
                                    </Col>
                                </Form>
                            </Col>
                        }
                        <Col sm={12}>
                            <hr />
                            <Button variant='primary' onClick={TestCorsRequest}>Test CORS</Button>
                        </Col>
                    </Row>
                </div>
            }
        </>
    );
};

export default WaitingRoom;

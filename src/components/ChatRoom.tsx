import { Row,Col } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";




const ChartRoom = ({messages,sendMessage}:{messages:any,sendMessage:any}) => <div>
    <Row className="px-5 py-5">
           
            <Col>

            </Col>
    </Row>
    <Row className="px-5 py-5">
        <Col sm={12}>
            <MessageContainer messages={messages} />
        </Col>
        <div style={{"height":"40px"}}/>
        <Col sm={12}>
            <SendMessageForm sendMessage={sendMessage} />
        </Col>

    </Row>

</div>

export default ChartRoom;
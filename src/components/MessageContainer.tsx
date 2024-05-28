const MessageContainer = ({messages}:{messages:any}) => {

return <div>
    {
        messages.map((msg:any,index:any) =>
            <table >
                <tr key={index}>
                    <td>{msg.message} - {msg.user ? "Doc" : "Paciente"} - {msg.status}</td>
                </tr>
            </table>
        )

    }
</div>

}

export default MessageContainer;
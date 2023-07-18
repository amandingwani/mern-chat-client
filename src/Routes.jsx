import { useContext } from "react";
import RegisterOrLoginForm from "./RegisterOrLoginForm"
import { UserContext } from "./UserContext";
import Chat from "./Chat"

function Routes() {
    const {username, id} = useContext(UserContext);

    if (username) {
        return (
            <Chat />
        );
    }

    return(
        <RegisterOrLoginForm />
    );
}

export default Routes
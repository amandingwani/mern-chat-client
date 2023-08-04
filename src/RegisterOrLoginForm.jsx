import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import Logo from "./Logo";

export default function RegisterOrLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errMsg, setErrMsg] = useState('');
    const { setUsername:setLoggedInUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLogin ? '/login' : '/register';
        const {data} = await axios.post(url, {username, password});
        if (data.error) {
            setErrMsg('Internal Server Error');
        }
        else if (data.msg) {
            setErrMsg(data.msg);
        }
        else {
            setLoggedInUsername(username);
            setId(data.id);
        }
    }

    return (
        <div className="bg-blue-50 h-screen flex flex-col items-center justify-center gap-4">
            <Logo page={"login"}/>
            <form onSubmit={handleSubmit} className="w-64 mx-auto mb-16">
                <input type="text" 
                    value={username}
                    required
                    onChange={ev => setUsername(ev.target.value)} placeholder="username" className="block w-full rounded-sm p-2 mb-2 border"
                />
                <input type="password" 
                    value={password}
                    required
                    onChange={ev => setPassword(ev.target.value)} placeholder="password" className="block w-full rounded-sm p-2 mb-2 border"
                />
                <div className="text-center text-red-600">{errMsg}</div>
                <button type='submit' className="bg-blue-500 text-white block w-full rounded-sm p-2">
                    {isLogin ? 'Login' : 'Register'}
                </button>
                <div className="text-center">
                    {isLogin ? "Don't have an account? " : 'Already a member? '}
                    <button type='button' className="text-blue-500" onClick={() => setIsLogin(!isLogin)}>
                        {!isLogin ? 'Login' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    );
}
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import Logo from "./Logo";

export default function RegisterOrLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errMsg, setErrMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);
    const { setUsername:setLoggedInUsername, setId } = useContext(UserContext);
	


    async function handleSubmit(ev) {
        ev.preventDefault();
		setErrMsg('');
		setIsLoading(true);
        const url = isLogin ? '/login' : '/register';
        try {
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
        } catch (error) {
            setErrMsg('Internal Server Error');
        }
		finally {
			setIsLoading(false);
		}
    }

	function loadingMsg() {
		return (
			<div className="text-blue-500 flex gap-1 pb-2 items-center justify-center">
				<svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
				</svg>
				Loading...
			</div>
		);
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
				{isLoading && loadingMsg()}
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
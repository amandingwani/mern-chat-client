import Avatar from "./Avatar";

export default function Contact({userId, onClick, isSelected, username, online}) {
    return (
        <div onClick={onClick}
            className={"border-b border-gray-200 flex items-center gap-2 cursor-pointer " + (isSelected ? "bg-blue-100" : "")} 
            key={userId}>
                {isSelected && (
                    <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>    
                )}
                <div className="flex py-2 p-4 gap-2 items-center">
                    <Avatar online={online} userId={userId} username={username}/>
                    <span className="text-gray-800">{username}</span>
                </div>
        </div>
    );
}
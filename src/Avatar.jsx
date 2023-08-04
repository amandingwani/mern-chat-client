export default function Avatar({userId, username, online}) {
    const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-teal-200', 'bg-purple-200', 'bg-rose-200'];
    const userIdInt = parseInt(userId, 16);
    const color = colors[(userIdInt % colors.length)];

    return (
        <div>
            <div className={`relative w-8 h-8 ${color} rounded-full flex items-center`}>
                <div className="text-center w-full opacity-70">{username[0]}</div>
                {online && (
                    <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
                )}
                {!online && (
                    <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
                )}
            </div>
        </div>
    );
}
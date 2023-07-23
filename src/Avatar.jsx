export default function Avatar({userId, username}) {
    const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-teal-200', 'bg-purple-200', 'bg-rose-200'];
    const userIdInt = parseInt(userId, 16);
    const color = colors[(userIdInt % colors.length)];

    return (
        <div className={`w-8 h-8 ${color} rounded-full flex items-center`}>
            <div className="text-center w-full opacity-70">{username[0]}</div>
        </div>
    );
}
export default function Player(props) {
    const name = props.name || 'Player Name';
    const imageSrc = props.imageSrc;
    return (
        <>
        <div className="flex flex-col items-center ">
            <span className="text-lg sm:text-xl md:text-2xl font-medium">{name}</span>
        <div className="flex items-center space-x-4 p-2">
         <img src={imageSrc} alt={name}/>   
        </div>

        </div>
        </>
        
    );
}
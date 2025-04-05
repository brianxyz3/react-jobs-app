const Card = ({ children, bgColor = "bg-gray-100" }) => {
    return (
        <div className={`${bgColor} p-6 rounded-lg shadow-md`}>
            {children}
        </div>
    )
}

export default Card;
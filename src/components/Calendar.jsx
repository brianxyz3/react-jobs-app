import { useState } from "react"


const Calendar = () => {
    const d = new Date();
    const month = d.getMonth() + 1;

    const date = d.getFullYear() + "-" + month + "-" + d.getDate() + "T09:00";

    const [value, setValue] = useState(date);

    const onChange = (evt) => {
        setValue(evt.target.value);
    }

    return (
        <div className="border border-black w-fit m-1">
            <input type="datetime-local" name="" id="" defaultValue={value} onChange={onChange} />
        </div>
    )
}

export default Calendar
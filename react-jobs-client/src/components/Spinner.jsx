import { ClipLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "100px auto"
}

const Spinner = ({ loading, size}) => {
    return (
        <ClipLoader
            color="#4338ca"
            loading={loading}
            cssOverride={override}
            size={size}
        />
    )
}

export default Spinner;
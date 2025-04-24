import { PulseLoader } from "react-spinners";

const override = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // margin: "100px auto"
}

const Loader = ({ loading, size }) => {
    return (
        <PulseLoader
            color="#1e40af"
            loading={loading}
            cssOverride={override}
            size={size}
        />
    )
}

export default Loader;
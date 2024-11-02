import validator from "validator";

const CompanyInfo = ({ company, contact }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6">Company Info</h3>

            <h2 className="text-2xl">{validator.unescape(company.name)}</h2>

            <p className="my-2">
                {validator.unescape(company.description)}
            </p>

            <hr className="my-4" />

            <h3 className="text-xl">Contact Email:</h3>

            <p className="my-2 bg-indigo-100 p-2 font-bold">
                {validator.unescape(contact.email)}
            </p>

            <h3 className="text-xl">Contact Phone:</h3>

            <p className="my-2 bg-indigo-100 p-2 font-bold">{validator.unescape(contact.phone)}</p>
        </div>)
}

export default CompanyInfo;
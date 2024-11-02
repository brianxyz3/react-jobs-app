import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
const Footer = () => {
    return (
        <footer className="bg-indigo-950">
            <div className="flex flex-wrap justify-evenly pt-12">
                <div className="grid grid-cols-2 text-center text-slate-400 md:grid-cols-4 gap-5 p-10">
                    <div>
                        <div className="mb-6 border-b-2 text-white pb-2 font-bold text-xl">Marketing</div>
                        <ul className="p-0 flex flex-col gap-2">
                            <li>Analytics</li>
                            <li>Commerce</li>
                            <li>Automation</li>
                            <li>Insights</li>
                        </ul>
                    </div>
                    <div>
                        <div className="mb-6 border-b-2 text-white pb-2 font-bold text-xl">Company</div>
                        <ul className="p-0 flex flex-col gap-2">
                            <li>About</li>
                            <li>Jobs</li>
                            <li>Press</li>
                        </ul>
                    </div>
                    <div>
                        <div className="mb-6 border-b-2 text-white pb-2 font-bold text-xl">Support</div>
                        <ul className="p-0 flex flex-col gap-2">
                            <li>Submit ticket</li>
                            <li>Documentation</li>
                            <li>Guides</li>
                        </ul>
                    </div>
                    <div>
                        <div className="mb-6 border-b-2 text-white pb-2 font-bold text-xl">Legal</div>
                        <ul className="p-0 flex flex-col gap-2">
                            <li>Terms of service</li>
                            <li>Privacy policy</li>
                            <li>License</li>
                        </ul>
                    </div>
                </div>
                <div className="flex gap-4 text-3xl text-slate-400 p-8">
                    <FaFacebook />
                    <a href="https://linkedin.com/in/brian-chima-xyz" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    <FaInstagram />
                    <a href="https://x.com/BrianXYZ_01" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    <a href="https://github.com/brianxyz3" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer; 
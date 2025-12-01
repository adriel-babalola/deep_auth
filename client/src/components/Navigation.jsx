import {Github, Linkedin, Twitter  } from 'lucide-react';


const Navigation = () => {
  return (
    <div>
      <nav className="flex m-5 rounded-xl shadow lg:px-10 md:px-5 px-3 py-3.5 items-center bg-white justify-between">
      <div className="logo font-roboto">
        <h1 className="text-xl">DeepAuth</h1>
      </div>
      <div className="">
        <ul className="links flex justify-between lg:gap-10 md:gap-5 gap-2">
          <li className="bg-gray-100 rounded-md p-2">
            <a className="" href="https://github.com/adriel-babalola" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 icon" />
            </a>
          </li>
          <li className="bg-gray-100 rounded-md p-2">
            <a href="https://linkedin.com/in/adriel-babalola" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 icon" />
            </a>
          </li>
          <li className="bg-gray-100 rounded-md p-2">
            <a href="https://x.com/AdrielBaba57136" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 icon" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
    </div>
  )
}

export default Navigation

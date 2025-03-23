import ReusableButtons from './ReusableButtons';
import { FaGithub } from 'react-icons/fa';
const SkillsSection = () =>
    {
        return (
            
        <section id="skills" className="min-h-screen flex items-center justify-center snap-start bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl">
        <div className="flex flex-col items-center w-full max-w-5xl p-6 gap-8">
          <h2 className="text-5xl font-bold text-gray-800 mb-2 border-3 border-gray-700 rounded-3xl px-5 py-5 self-start">
            Skills
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 w-full">
            {/* Programming */}
            <div className="flex-1 border-2 border-purple-500/50 rounded-lg p-6 bg-gray-700/50">
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">Programming</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">C</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">C++</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">Python</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 border-2 border-purple-500/50 rounded-lg p-6 bg-gray-700/50">
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">Frontend</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">HTML</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">ReactJS, NextJS</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">Tailwind CSS</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 border-2 border-purple-500/50 rounded-lg p-6 bg-gray-700/50">
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">Backend</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">FastAPI</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">NodeJS</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">MongoDB</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-lg text-gray-200">MySQL</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
        );
    };
export default SkillsSection;
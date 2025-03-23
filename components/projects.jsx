import ReusableButtons from './ReusableButtons';
import { FaGithub } from 'react-icons/fa';

const ProjectSection = () =>
{
    return (
        
      <section id="projects" className="h-full flex items-center justify-center snap-start bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl tablet:m-7 ">
      <div className="flex flex-col items-center justify-center w-full max-w-5xl p-6 gap-8">
        <h2 className="text-5xl font-bold text-gray-300 mb-2 border-3 border-gray-700 rounded-3xl px-5 py-5 self-center">
          Projects
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
          <div className="flex-1 border-2 border-purple-500/50 rounded-lg p-6 bg-gray-700/50">
            <h3 className="text-2xl font-semibold text-purple-300 mb-4">Portfolio</h3>
            <ReusableButtons href="https://github.com/parampanwar" icon={FaGithub}>GitHub</ReusableButtons>
          </div>
    
          <div className="flex-1 border-2 border-purple-500/50 rounded-lg p-6 bg-gray-700/50">
            <h3 className="text-2xl font-semibold text-purple-300 mb-4">Cashbook</h3>
            <ReusableButtons href="https://github.com/parampanwar" icon={FaGithub}>GitHub</ReusableButtons>
          </div>
        </div>
      </div>
    </section>
    
    );
};
export default ProjectSection;
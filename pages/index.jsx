import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import MainScreenWrapper from '../components/MainScreenWrapper';
import { useGlobalDashboardContext } from '../contexts/DashboardContext'
import CircuitAnimation from '../components/MousePointer';
import styles from '../styles/Home.module.css';

import ReusableButtons from '../components/ReusableButtons';
import ProjectSection from '../components/projects';
import SkillsSection from '../components/skills';
import AboutSection from '../components/about'
import MyDashboard from '../components/dashboard'
export default function Dashboard() {
  let bDetails = 1
  const router = useRouter()
  const { query } = useRouter()

  //JS for mouse pointer
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  //JS for welcome text

  return (
    <MainScreenWrapper>
      <MyDashboard />
      < br />< br />< br />< br />
      {/* *******************About Section************************ */}
      <AboutSection />
      < br />< br />< br />< br />
      {/* *******************-----------------Skills Section-------------------************************ */}
      <SkillsSection />
      <br /><br /><br /><br />
      {/* Projects Section */}
      <ProjectSection />
      <br /><br />
      <footer className="flex flex-col items-center text-white font-light text-center sm:flex-row sm:justify-center">
        <span>Copyright © 2025 Param Panwar.</span>
        <span className="sm:ml-2 sm:whitespace-nowrap">All Rights Reserved</span>
        <br />
        
      </footer>

      <br /><br />
    </MainScreenWrapper >
  )
}
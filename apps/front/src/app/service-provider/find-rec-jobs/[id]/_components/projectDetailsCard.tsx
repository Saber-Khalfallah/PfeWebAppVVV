// app/_components/project-details/ProjectDetailsCard.tsx
import React from 'react';

interface ProjectDetailsCardProps {
  project: {
    title: string;
    description: string;
    budget: string;
  };
}

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{project.title}</h2>
      <p className="text-gray-700 text-base leading-relaxed mb-4">{project.description}</p>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <p className="text-lg font-semibold text-gray-800">Budget:</p>
        <p className="text-blue-600 text-xl font-bold mt-1">{project.budget}</p>
      </div>
    </div>
  );
};

export default ProjectDetailsCard;
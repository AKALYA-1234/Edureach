import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Users,
  Mic,
  Heart,
  Calendar,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useLanguageStore from '../../store/languageStore';

const sidebarLinks = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/learning', icon: BookOpen, labelKey: 'nav_learning' },
  { path: '/scholarships', icon: GraduationCap, labelKey: 'nav_scholarships' },
  { path: '/mentoring', icon: Users, labelKey: 'nav_mentoring' },
  { path: '/speech-therapy', icon: Mic, labelKey: 'nav_speech' },
  { path: '/mental-health', icon: Heart, labelKey: 'nav_mental_health' },
  { path: '/study-plan', icon: Calendar, labelKey: 'nav_study_plan' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { t } = useLanguageStore();

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          const label = link.labelKey ? t(link.labelKey) : link.label;

          return (
            <Link
              key={link.path}
              to={link.path}
              title={isCollapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

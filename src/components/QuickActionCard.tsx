import React from 'react';
import { 
  MessageSquareText, 
  Search, 
  FileCheck2, 
  FlaskConical, 
  Gem, 
  HelpCircle, 
  ArrowRight 
} from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (tabId: string) => void;
}

export const QuickActionCard: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'chat',
      title: 'Ask BIS AI',
      badge: 'Conversational RAG',
      desc: 'Ask questions in natural language about Indian Standards, licensing rules, and regulatory requirements.',
      icon: MessageSquareText,
      color: 'blue',
      btnText: 'Start Asking AI'
    },
    {
      id: 'finder',
      title: 'Find My Standard',
      badge: 'Product Matcher',
      desc: 'Describe what you manufacture or use to discover potentially applicable Indian Standards and scopes.',
      icon: Search,
      color: 'indigo',
      btnText: 'Identify Standard'
    },
    {
      id: 'certification',
      title: 'Certification Guide',
      badge: 'Schemes & Licences',
      desc: 'Understand BIS Scheme I (ISI Mark), Scheme II (CRS), FMCS, factory audit checklists and fees.',
      icon: FileCheck2,
      color: 'emerald',
      btnText: 'Explore Schemes'
    },
    {
      id: 'testing',
      title: 'Testing & Laboratory',
      badge: 'Quality & Test Labs',
      desc: 'Explore required mechanical, chemical and electrical tests and locate BIS Recognized Laboratories.',
      icon: FlaskConical,
      color: 'amber',
      btnText: 'View Test Requirements'
    },
    {
      id: 'hallmarking',
      title: 'Hallmarking Assistant',
      badge: 'Gold & Silver Purity',
      desc: 'Learn about mandatory 6-digit HUID, 3 hallmark symbols, fineness grades, and jeweller registration.',
      icon: Gem,
      color: 'yellow',
      btnText: 'Understand Hallmarking'
    },
    {
      id: 'consumer',
      title: 'Consumer Help',
      badge: 'Public Protection',
      desc: 'Learn how to verify genuine ISI marks on BIS CARE App, report counterfeit goods, and consumer rights.',
      icon: HelpCircle,
      color: 'sky',
      btnText: 'Get Consumer Advice'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive BIS Services Intelligence
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Dedicated intelligent modules designed for MSMEs, startups, industries, testing laboratories, and everyday consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                id={`quick-action-${act.id}`}
                onClick={() => onSelectAction(act.id)}
                className="group relative rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {act.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {act.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {act.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-800 group-hover:text-blue-950">
                  <span>{act.btnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

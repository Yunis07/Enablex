import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
}

export function ActionCard({ icon: Icon, title, bgColor, iconColor, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} rounded-3xl p-6 flex flex-col items-center justify-center gap-5 min-h-[180px] w-full shadow-xl hover:shadow-2xl active:scale-[0.96] transition-all duration-300 hover:scale-[1.03] animate-in slide-in-from-bottom border-4 border-white/20`}
    >
      <div className={`${iconColor} p-5 rounded-full bg-white/30 backdrop-blur-sm shadow-lg`}>
        <Icon className="w-14 h-14 drop-shadow-md" strokeWidth={3} />
      </div>
      <span 
        className={`${iconColor} text-center leading-tight drop-shadow-md`}
        style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Times New Roman, serif' }}
      >
        {title}
      </span>
    </button>
  );
}

import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

const FeatureCard = ({ icon: Icon, title, description, iconColor = "text-primary" }: FeatureCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="flex justify-center mb-4">
        <Icon className={`w-16 h-16 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-card-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;

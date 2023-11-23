export interface ModuleProps {
  key: number;
  module: {
    id: number;
    title: string;
    description: string;
    component: React.FC<ModuleProps>;
    step: number;
  };
  isOpen: boolean;
  onToggle: () => void;
  campaignId: string | '';
  campaignInfo: any[];
}

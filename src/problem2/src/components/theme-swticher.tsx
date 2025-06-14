import { MoonIcon, SunIcon } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/theme-context';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <SunIcon size={18} />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked) => {
          setTheme(checked ? 'dark' : 'light');
        }}
      />
      <MoonIcon size={18} />
    </div>
  );
};

export default ThemeSwitcher;

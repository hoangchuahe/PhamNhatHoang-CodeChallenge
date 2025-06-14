import ExchangeForm from './components/exchange-form';
import ThemeSwitcher from './components/theme-swticher';

function App() {
  return (
    <div className="w-lvw h-lvh flex flex-col">
      <div className="flex px-5 py-3 justify-end">
        <ThemeSwitcher />
      </div>
      <div className="flex-1 flex items-center justify-center p-5">
        <ExchangeForm />
      </div>
    </div>
  );
}

export default App;

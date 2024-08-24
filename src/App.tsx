import './App.css'
import { WeatherProvider  } from './context/WeatherContext'
import Sidebar from './components/Sidebar'
import Dashboard from './screens/Dashboard'

// function App() {
//   <WeatherProvider>
//     <main className='flex items-center justify-center bg-[#0B131E] overflow-hidden font-roboto'>
//       <Sidebar />
//       <Dashboard />
//     </main>
//   </WeatherProvider>
// }

const App: React.FC = () => (
  <WeatherProvider>
  <main className='flex items-center justify-center bg-[#0B131E] overflow-hidden font-roboto'>
    <Sidebar />
    <Dashboard />
  </main>
</WeatherProvider>
);

export default App

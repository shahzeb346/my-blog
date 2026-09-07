import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import News from './components/News';
import Sports from './components/Sport';
import Health from './components/Health';
import Technology from './components/Technology';
import Detail from './components/Detail';
import './App.css';

const pageMap = {
  News,
  Sports,
  Health,
  Technology,
  Detail,
};

function App() {
  const [activePage, setActivePage] = useState('News');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
    setActivePage('Detail');
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
    setActivePage('News');
  };

  const CurrentPage = activePage === 'Detail' ? Detail : pageMap[activePage] || News;

  return (
    <>
      <div>
        <Navbar
          activePage={activePage === 'Detail' ? 'News' : activePage}
          setActivePage={(page) => {
            setSelectedArticle(null);
            setActivePage(page);
          }}
        />
        <div>
          {activePage === 'Detail' ? (
            <CurrentPage article={selectedArticle} onBack={handleBackToList} />
          ) : (
            <CurrentPage onOpenArticle={handleOpenArticle} />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App

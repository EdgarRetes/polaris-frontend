import HeaderTile from '../assets/HeaderTile.png'; 
import BanorteNameWhite from '../assets/BanorteNameWhite.png';

const Header = () => {
  return (
    <header
      className="h-17 w-full flex items-center justify-left text-white text-2xl"
      style={{
        backgroundImage: `url(${HeaderTile})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'contain',
        backgroundPosition: 'top left',
      }}
    >
        <img src={BanorteNameWhite} alt="BanorteLogo" className="mr-4 ml-6" />

    </header>
  );
};

export default Header;

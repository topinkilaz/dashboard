
import { BrowserRouter as Router, Route, Routes,useLocation } from "react-router-dom";
import store from "./store";
import {Helmet, HelmetProvider} from 'react-helmet-async'
import { Provider } from "react-redux"; 
import AnimateRoutes from "hocs/routes/animatedRoutes";

function App() {
  return (
    <HelmetProvider>
    <Helmet>
      <title>Infotech  Dashboard</title>
      <meta name="description" content="Ofrecemos soluciones expertas en reparación, mantenimiento y optimización de equipos electrónicos." />
      <meta name="keywords" content='Servicio técnico, Reparación de equipos, Soluciones tecnológicas' />
      <meta name="robots" content='all' />
      <link rel="canonical" href="https://www.infotech.com/" />
      <meta name="author" content='Infotech' />
      <meta name="publisher" content='Infotech' />

      {/* Social Media Tags */}
      <meta property="og:title" content='Infotech  Sucre-Bolivia' />
      <meta property="og:description" content='Ofrecemos soluciones expertas en reparación, mantenimiento y optimización de equipos electrónicos.' />
      <meta property="og:url" content="https://www.infotech.com/" />
      <meta property="og:image" content='https://i.postimg.cc/c4hQJ8p5/Computer-Services.webp' />

      <meta name="twitter:title" content='Infotech  Sucre-Bolivia' />
      <meta
          name="twitter:description"
          content='Ofrecemos soluciones expertas en reparación, mantenimiento y optimización de equipos electrónicos.'
      />
      <meta name="twitter:image" content='https://i.postimg.cc/c4hQJ8p5/Computer-Services.webp' />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  <Provider store={store}>
  <Router >
   <AnimateRoutes/>
   
  </Router>
  </Provider>
  </HelmetProvider>
  );
}

export default App;

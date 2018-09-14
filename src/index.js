import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AutorBox from './componentes/Autor';
import LivroBox from './componentes/Livro';
import Home from './componentes/Home';
import {BrowserRouter,Route, Switch, Link} from 'react-router-dom';

ReactDOM.render(
  (<BrowserRouter>
      <App>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/autores" component={AutorBox}/>
            <Route path="/livros" component={LivroBox}/>
          </Switch>
      </App>
  </BrowserRouter>),
  document.getElementById('root')
);

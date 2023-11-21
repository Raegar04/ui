import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';
import { TournamentList } from './Components/Tournaments/List';
import { Tournament } from './models';
import Header from './Components/Header/Header';



function App({children}:{children:ReactNode}) {
  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
}

export default App;

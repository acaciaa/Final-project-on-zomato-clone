import React from 'react'
import Quicksearch from './QuickSearch'
import Wallpaper from './Wallpaper'
import Header from './../Common/Header';

export default function () {
  return (
    <div>
      <Header></Header>
        <Wallpaper/>
        <Quicksearch></Quicksearch>
    </div>
  )
}

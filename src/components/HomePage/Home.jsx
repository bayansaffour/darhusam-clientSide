import React from 'react'
import Hero from './Hero'
import WhoWeAre from './WhoWeAre'
import Programs from './Programs'
import News from './News'
import Initiatives from './Initiatives'
import SuccessStories from './SuccessStories'
import Gallery from './Gallery'
import NewsTicker from './NewsTicker'

function Home() {
  return (
    <>
    <NewsTicker/>
    <Hero/>
    <WhoWeAre/>
    <Programs/>
    <Gallery/>
    <News/>
    <SuccessStories/>
    <Initiatives/>

    </>
  )
}

export default Home

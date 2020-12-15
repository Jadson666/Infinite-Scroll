import React from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import styled from 'styled-components'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const App = () => {
  return (
    <Container>
      <ReactNotification />
      <InfiniteScroll />
    </Container>
  )
}

export default App

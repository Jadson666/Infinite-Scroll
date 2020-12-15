import React from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const App = () => {
  return (
    <Container>
      <InfiniteScroll />
    </Container>
  )
}

export default App

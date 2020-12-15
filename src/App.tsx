import React, { useRef, useState } from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import styled from 'styled-components'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { Cell } from './Cell'
import axios, { AxiosResponse } from 'axios'
import { IGitApiResponse } from './types'
import { gitApiUrl } from './config'
import { ScaleLoader } from 'react-spinners'
import SearchBar from './SearchBar'
import { showNotification } from './utils'

const PER_PAGE = 50
const EXCEED_RATE_LIMIT = 403

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const searchReposForNextPage: (
  pageNo: number,
  keyword: string
) => Promise<AxiosResponse<IGitApiResponse>> = async (pageNo, keyword) => {
  const result: AxiosResponse<IGitApiResponse> = await axios.get(gitApiUrl, {
    params: {
      q: keyword,
      per_page: PER_PAGE,
      page: pageNo + 1
    }
  })
  return result
}

const LoaderContain = styled.div`
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MainApp = () => {
  const pageRef = useRef<number>(0)
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const keywordRef = useRef<string>('')

  const fetchData = () =>
    searchReposForNextPage(pageRef.current, keywordRef.current)
  const onContentChange = (newContent) => (keywordRef.current = newContent)
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <InfiniteScroll
        Cell={Cell}
        fetchData={fetchData}
        onLoadSuccess={() => (pageRef.current += 1)}
        onLoadFailed={() => showNotification()}
        preventLoading={keywordRef.current === ''}
        startToScrollIn={100}
      >
        {(renderDataCell, setData, isThrottle) => {
          const onSearch = async () => {
            if (keywordRef.current === '') return
            if (isThrottle) return
            setShowLoader(true)
            try {
              const {
                data: { items }
              } = await searchReposForNextPage(0, keywordRef.current)
              pageRef.current = 1
              setData(items)
            } catch (error) {
              const status = error.response.status
              if (status === EXCEED_RATE_LIMIT) showNotification()
            } finally {
              setShowLoader(false)
            }
          }

          return (
            <>
              <SearchBar
                onSearch={onSearch}
                onContentChange={onContentChange}
                waitForFire={1500}
              />
              {!showLoader && renderDataCell('id')}
              {showLoader && (
                <LoaderContain>
                  <ScaleLoader
                    width={12}
                    radius={4}
                    margin={7}
                    height={80}
                    color='#36D7B7'
                  />
                </LoaderContain>
              )}
            </>
          )
        }}
      </InfiniteScroll>
    </div>
  )
}

const App = () => {
  return (
    <Container>
      <ReactNotification />
      <MainApp />
    </Container>
  )
}

export default App

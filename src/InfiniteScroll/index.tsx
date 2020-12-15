import axios, { AxiosResponse } from 'axios'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Cell } from './Cell'
import { gitApiUrl } from '../config'
import { SearchBar } from '../SearchBar'
import { IGitApiResponse, Item } from '../types'
import { showNotification } from '../utils'
import ScaleLoader from 'react-spinners/ScaleLoader'

const startToScrollIn = 100
const PER_PAGE = 50
const SUCCESSFUL = 200
const EXCEED_RATE_LIMIT = 403

const WholeWrapper = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100%;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.1);
`

const LoaderContain = styled.div`
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const searchReposByPage: (
  pageNo: number,
  keyword: string
) => Promise<AxiosResponse<IGitApiResponse>> = async (pageNo, keyword) => {
  const result: AxiosResponse<IGitApiResponse> = await axios.get(gitApiUrl, {
    params: {
      q: keyword,
      per_page: PER_PAGE,
      page: pageNo
    }
  })
  return result
}

export const InfiniteScroll = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [page, setPage] = useState<number>(0)
  const [isThrottle, setIsThrottle] = useState<boolean>(false)
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [data, setData] = useState<Item[]>([])
  const [keyword, setKeyword] = useState<string>('')

  const handleLoad = async () => {
    if (!wrapperRef.current) return

    const {
      scrollHeight,
      scrollTop,
      clientHeight
    } = wrapperRef.current as HTMLDivElement
    const scrollHappen =
      scrollHeight - (clientHeight + scrollTop) < startToScrollIn

    if (!isThrottle && scrollHappen && keyword !== '') {
      setIsThrottle(true)
      const {
        status,
        data: { items }
      } = await searchReposByPage(page + 1, keyword)
      if (status === SUCCESSFUL) {
        setPage(page + 1)
        setData([...data, ...items])
      }
      setIsThrottle(false)
    }
  }

  const onSearch = async () => {
    if (keyword === '') return
    if (isThrottle) return
    setIsThrottle(true)
    setShowLoader(true)
    try {
      const {
        data: { items }
      } = await searchReposByPage(1, keyword)
      setPage(page + 1)
      setData(items)
    } catch (error) {
      const status = error.response.status
      if (status === EXCEED_RATE_LIMIT) showNotification()
    } finally {
      setShowLoader(false)
      setIsThrottle(false)
    }
  }

  const onContentChange = (newContent) => {
    setKeyword(newContent)
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <WholeWrapper ref={wrapperRef} onScroll={handleLoad}>
        <SearchBar onClick={onSearch} onContentChange={onContentChange}></SearchBar>
        {!showLoader && data.map((v) => {
          return <Cell data={v} key={`${v.id}-${page}`} />
        })}
        {(showLoader) && (
          <LoaderContain>
            <ScaleLoader
              width={12}
              radius={4}
              margin={7}
              height={80}
              color='#36D7B7'
              loading={showLoader}
            />
          </LoaderContain>
        )}
      </WholeWrapper>
    </div>
  )
}

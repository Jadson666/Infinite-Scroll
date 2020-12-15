import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { SyntheticEvent, useRef, useState } from 'react'
import styled from 'styled-components'
import { Cell } from './Cell'
import { SearchBar } from './SearchBar'
import { IGitApiResponse, Item } from './types'
import { NotificationContainer, NotificationManager } from 'react-notifications'

const startToScrollIn = 100
const url = 'https://api.github.com/search/repositories'
const PER_PAGE = 50
const SUCCESSFUL = 200
const REACH_RATE_LIMIT = 403

const WholeWrapper = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100%;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.1);
`

export const searchReposByPage: (
  pageNo: number,
  keyword: string
) => Promise<AxiosResponse<IGitApiResponse>> = async (pageNo, keyword) => {
  const result: AxiosResponse<IGitApiResponse> = await axios.get(url, {
    params: {
      q: keyword,
      per_page: PER_PAGE,
      page: pageNo
    }
  })
  return result
}

export const InfiniteScroll = () => {
  const [page, setPage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Item[]>([])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
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

    if (!isLoading && scrollHappen && keyword !== '') {
      setIsLoading(true)
      const {
        status,
        data: { items }
      } = await searchReposByPage(page + 1, keyword)
      if (status === SUCCESSFUL) {
        setPage(page + 1)
        setData([...data, ...items])
      }
      setIsLoading(false)
    }
  }

  const onSearch = async (e?: SyntheticEvent) => {
    if (keyword === '') return
    try {
      const {
        data: { items }
      } = await searchReposByPage(1, keyword)
      setPage(page + 1)
      setData(items)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <WholeWrapper ref={wrapperRef} onScroll={handleLoad}>
        <SearchBar onClick={onSearch} keyword={{keyword, setKeyword}}  ></SearchBar>
        {data.map((v) => {
          return <Cell data={v} key={`${v.id}-${page}`} />
        })}
      </WholeWrapper>
    </div>
  )
}

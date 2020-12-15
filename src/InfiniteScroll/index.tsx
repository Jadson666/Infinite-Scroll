import { AxiosResponse, AxiosError } from 'axios'
import React, { FunctionComponent, useRef, useState } from 'react'
import styled from 'styled-components'
import { IGitApiResponse, Item } from '../types'

interface InfiniteScrollProps {
  Cell: FunctionComponent<{data: Item}>
  fetchData: () => Promise<AxiosResponse<IGitApiResponse>>
  onLoadSuccess: () => void
  onLoadFailed: (error: AxiosError) => void
  preventLoading: boolean
  children: (
    renderDataCell: (pk: string) => React.ReactNode,
    setData: (data: Item[]) => void,
    isThrottle: boolean
  ) => React.ReactNode
  startToScrollIn: number
}

const WholeWrapper = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100%;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.1);
`

export const InfiniteScroll: FunctionComponent<InfiniteScrollProps> = ({
  startToScrollIn,
  preventLoading,
  onLoadSuccess,
  onLoadFailed,
  Cell,
  fetchData,
  children
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [data, setData] = useState<Item[]>([])
  const [isThrottle, setIsThrottle] = useState<boolean>(false)

  const handleLoad = async () => {
    if (!wrapperRef.current) return

    const {
      scrollHeight,
      scrollTop,
      clientHeight
    } = wrapperRef.current as HTMLDivElement
    const scrollHappen =
      scrollHeight - (clientHeight + scrollTop) < startToScrollIn

    if (!isThrottle && scrollHappen && !preventLoading) {
      setIsThrottle(true)
      try {
        const {
          data: { items }
        } = await fetchData()
        onLoadSuccess()
        setData([...data, ...items])
      } catch (error) {
        onLoadFailed(error)
      } finally {
        setIsThrottle(false)
      }
    }
  }

  const renderDataCell = (primaryKey: string): React.ReactNode => {
    return data.map((v) => {
      return <Cell data={v} key={`${v[primaryKey]}`} />
    })
  }

  return (
    <WholeWrapper ref={wrapperRef} onScroll={handleLoad}>
      {children(renderDataCell, setData, isThrottle)}
    </WholeWrapper>
  )
}

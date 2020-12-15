import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Item } from '../types'
import Link from '@material-ui/core/Link'
import StarOutlineIcon from '@material-ui/icons/StarOutline'
import { getFromNow } from '../utils'

const CardContain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const CardEle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  width: 50%;
  padding: 10px;
  margin: 2% 0;
  border-radius: 3px;
  background: white;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
`

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 92%;
  line-height: 30px;
`

const DescField = styled.div`
  font-size: 17px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`
interface CellProps {
  data: Item
}

export const Cell: FunctionComponent<CellProps> = ({ data }) => {
  const {
    name,
    description,
    stargazers_count,
    language,
    updated_at,
    html_url
  } = data

  const updatedFrom = `updated at ${getFromNow(updated_at)}`
  return (
    <CardContain>
      <CardEle>
        <InfoContent>
          <Link href={html_url} target='_blank' rel='noreferrer'>
            {name}
          </Link>
          <DescField>{description}</DescField>
          <Row>
            <StarOutlineIcon />{' '}
            <span style={{ color: '#bfaa13', marginLeft: '4px' }}>{stargazers_count}</span>{' '}
            <span style={{ color: '#8e8b76', margin: '0 4px' }}>Language: {language}</span>
            {updatedFrom}
          </Row>
        </InfoContent>
      </CardEle>
    </CardContain>
  )
}

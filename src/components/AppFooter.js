import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter>
      <div>
        <a href="https://www.facebook.com/EGeekHouse1" target="_blank" rel="noopener noreferrer">
          GeekHouse
        </a>
        <span className="ms-1">&copy; {currentYear}.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

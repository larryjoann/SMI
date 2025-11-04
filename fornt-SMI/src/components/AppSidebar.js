import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import myLogo from 'src/assets/images/logo.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      style={{backgroundColor: "#016172"}}
      // style={{ backgroundColor: "#2E2F2F" }}
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom p-0 bg-white d-flex justify-content-center">
        <CSidebarBrand to="#" className="d-flex align-items-center justify-content-center w-100">
          {/* Mode full: logo + titre */}
          <span className="sidebar-brand-full d-flex align-items-center">
            <img src={myLogo} alt="Logo" height={62} />
            <span className="me-4 fw-bold h4 mb-0" style={{ color: '#6b7785' }}>S.M.I</span>
          </span>
          {/* Mode narrow: logo seul */}
          <span className="sidebar-brand-narrow">
            <img src={myLogo} alt="Logo" height={62} />
          </span>
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

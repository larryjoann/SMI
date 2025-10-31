import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    // Exact match first
    const exact = routes.find((route) => route.path === pathname)
    if (exact) return exact.name

    // Try matching parameterized routes like /nc/fiche/:id
    // Convert route.path into a regex: replace ":param" with "[^/]+"
    const paramMatch = routes.find((route) => {
      if (!route.path) return false
      // route.path may contain '*' or other patterns; handle simple :param cases
      const pattern = '^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$'
      try {
        const re = new RegExp(pattern)
        return re.test(pathname)
      } catch (e) {
        return false
      }
    })
    return paramMatch ? paramMatch.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)

      // If this is an intermediate segment (not the full path) and there is a
      // parameterized child route (e.g. "/.../formprocessus/:id"), skip adding
      // the parent route to avoid showing both 'Insertion' and 'Modification'
      // when visiting the child path.
      const isNotLast = index + 1 !== array.length
      const hasParamChild = routes.find(
        (r) => r.path && r.path.startsWith(currentPathname + '/:')
      )

      if (routeName) {
        if (isNotLast && hasParamChild) {
          // skip adding this parent entry because a parameterized child will
          // represent this step in the breadcrumb for the full path
        } else {
          breadcrumbs.push({
            pathname: currentPathname,
            name: routeName,
            active: index + 1 === array.length ? true : false,
          })
        }
      }
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      {/* <CBreadcrumbItem href="/">Home</CBreadcrumbItem> */}
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)

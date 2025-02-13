import { Outlet } from "react-router-dom"
import TheHeader from "../../components/front/TheHeader"
export default function FrontLayout() {
  return (
    <>
      <TheHeader />
      <Outlet />
    </>
  )
}

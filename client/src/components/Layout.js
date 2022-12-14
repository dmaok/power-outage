import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return <div className="app-layout">
    <header className="app-header">
      <div className="siteName">
        Pout
      </div>
      <nav>
        <ul className="app-navigation">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pout">Power Outages</Link>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <Outlet/>
    </main>

    <footer className="app-footer">
      &copy; Dmytro Kovtun
    </footer>
  </div>
}

export default Layout;
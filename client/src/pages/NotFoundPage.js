import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return <div className="not-found-page">
    <div className="hero-text">404</div>
    <h2>Page Not Found</h2>
    <div>
      <Link to="/">
        Go to main page
      </Link>
    </div>
  </div>
}

export default NotFoundPage;

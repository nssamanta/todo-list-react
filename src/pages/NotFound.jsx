import { Link } from 'react-router'

function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/">Go back to the Home page</Link>
    </div>
  );
}
export default NotFound;

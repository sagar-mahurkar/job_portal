import { Link } from "react-router";

const HomePage = () => {
  return (
    <main style={{padding: '2rem'}}>
      <h1>Welcome to the Job Portal</h1>
      <p className="muted">Shows simple job posting from backend</p>
      <div style={{marginTop: '1rem'}}>
          <Link to="/jobs">View Jobs</Link>
      </div>
    </main>
  );
};

export default HomePage;
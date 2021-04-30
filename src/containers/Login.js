// Custom Components
import LoginCard from '../components/LoginCard'

const Login = () => {
  return (
    <div>
      <LoginCard isAdmin={true} title="ADMIN login"/>
      {/* render employee */}
      {/* <LoginCard isAdmin={false} title="Employee login"/> */}
    </div>
  );
};

export default Login;
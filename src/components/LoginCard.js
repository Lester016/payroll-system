// material imports
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

// Custom Components
import CardContent from './CardContent'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
  },

  card:{
    display: 'block',
    textAlign: 'center',
    // marginTop: 20,
    // marginBottom: 20,
    // minWidth: '40%',
    // backgroundColor: '#E1E1E1',
    alignSelf: 'center',
  },
});

const LoginCard = ({
  isAdmin,
  title,
}) => {
  
const classes = useStyles();

return (
  <div className = {classes.root}>
    <h1>{title}</h1>       
    <Card className={classes.card}>
      <CardContent isAdmin = {isAdmin}/>
    </Card>
  </div>
)}

export default LoginCard;
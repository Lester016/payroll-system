
// Custom component
import AdminLogin from './AdminLogin'
import EmployeeLogin from './EmployeeLogin'

const CardContent = ({isAdmin}) => {
    if(isAdmin){
        return(
            <AdminLogin />
        )
    }
    return(
        <EmployeeLogin />
    )
    
}


export default CardContent;
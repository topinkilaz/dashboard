import Layouts from "hocs/layout/layouts"
import { connect } from "react-redux"

function Dashboard(){
    return(
      <Layouts>
Dashboard
      </Layouts>
    )
}

const mapStateToProps=state=>({

})

export default connect(mapStateToProps,{
    
})(Dashboard)
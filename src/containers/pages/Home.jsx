import Layouts from "hocs/layout/layouts"
import { connect } from "react-redux"

function Home(){
    return(
      <Layouts>
home
      </Layouts>
    )
}

const mapStateToProps=state=>({

})

export default connect(mapStateToProps,{
    
})(Home)
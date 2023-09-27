import {connect} from 'react-redux'
import { motion} from 'framer-motion'

function Layouts ({children}){
    return(
        <motion.div
        initial={{opacity:0} }
        animate={{opacity:1}}
        exit={{opacity:0}}
        transition={{ duration: 0.5 }}   
        >
            {children}
        </motion.div>
    )
}
const  mapStateToProp =state=>(
    {

    }
)
export default connect(mapStateToProp,{

}) (Layouts)
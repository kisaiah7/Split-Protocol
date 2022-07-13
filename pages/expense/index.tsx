import type { NextPage } from 'next'
import Create from './create'
import View from './view'

const Expense: NextPage = () => {
    return (
        <div className="h-screen bg-body-gradient">
            <View />
        </div>
    )
}

export default Expense

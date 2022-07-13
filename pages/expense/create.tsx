import type { NextPage } from 'next'
import Create from './create'

const Expense: NextPage = () => {
    return (
        <div className='h-screen bg-body-gradient'>
            <Create />
        </div>
    )
}

export default Expense

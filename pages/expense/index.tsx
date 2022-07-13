import type { NextPage } from 'next'
import Pay from './pay'
import View from './view'

const Expense: NextPage = () => {
    return (
        <div className='h-screen bg-body-gradient'>
            <Pay />
        </div>
    )
}

export default Expense

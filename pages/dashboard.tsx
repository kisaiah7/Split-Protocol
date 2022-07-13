import type { NextPage } from 'next'
import Preview from '../components/preview'

const Dashboard: NextPage = () => {
    return (
        <div className='h-full bg-body-gradient pb-20'>
            <div className='container mx-auto'>
                <p className='pt-16 pb-8 text-primary text-3xl font-sans font-bold'>Your Expenses</p>
                <div className='grid grid-cols-4 gap-4'>
                    <Preview />
                    <Preview />
                    <Preview />
                    <Preview />
                    <Preview />
                    <Preview />
                    <Preview />
                    <Preview />
                    <Preview />
                    <Preview />
                </div>
            </div>
        </div>
    )
}

export default Dashboard

import type { NextPage } from 'next'
import Preview from '../components/preview'

const Dashboard: NextPage = () => {
    return (
        <div className="h-screen bg-body-gradient">
            <Preview />
        </div>
    )
}

export default Dashboard

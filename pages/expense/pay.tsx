import type { NextPage } from 'next'
import Image from 'next/image'
import infoIcon from '../../public/info-icon.svg'
import cancelIcon from '../../public/close-icon.svg'
import checkIcon from '../../public/check-icon.svg'

const Pay: NextPage = () => {
    return (
        <div className='bg-secondary px-10 py-8 sm:container mx-auto rounded-lg'>
            <div className='grid grid-cols-2 w-full gap-3'>
                <div>
                    <p className='text-muted text-xs mb-2'>Token</p>
                    <select className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' id='tokens'>
                        <option value='eth'>ETH</option>
                    </select>
                </div>
                <div>
                    <p className='text-muted text-xs mb-2'>Share amount (in selected token)</p>
                    <input type='number' className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm'></input>
                </div>
                <div>
                    <p className='text-muted text-xs mb-2'>Recipient token</p>
                    <select className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' id='tokens'>
                        <option value='eth'>USDT</option>
                    </select>
                </div>
                <div>
                    <p className='text-muted text-xs mb-2'>Share amount (in recipient token)</p>
                    <input type='number' className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm'></input>
                </div>
            </div>

            <span className='mt-2 text-muted text-2xs flex items-center'><Image src={infoIcon} width={10} height={10} /><p className='ml-1'>1 USDT = 0.001 ETH</p></span>

            <div className='border-b-2 pb-3 border-tertiary mt-5 grid grid-cols-2 w-full gap-x-3 text-secondary text-sm'>
                <p>Share (in selected token): </p>
                <p className='text-right'>1 ETH</p>
                <p>Network fee: </p>
                <p className='text-right'>0.00000001 ETH</p>
                <p>Swap fee: </p>
                <p className='text-right'>0.000001ETH</p>
                <span className='col-span-2 mt-2 flex justify-end text-muted text-xs flex items-center'><Image src={infoIcon} width={10} height={10} /><p className='ml-1'>Your selected token diverges from jon-doe.eth’s accepted token. In order to swap ETH to USDT a small fee has to be provided.</p></span>
            </div>

            <div className='mt-4 grid grid-cols-2 w-full gap-3 text-primary text-sm'>
                <p>Total</p>
                <p className='text-right'>1.00000101 ETH</p>
            </div>

            <div className='text-primary flex justify-end mt-7'>
                <button className='flex items-center bg-cancel-gradient tracking-widest px-2 py-1 text-sm rounded-sm'><Image src={cancelIcon} /><a className='ml-2'>Cancel</a></button>
                <button className='ml-3 flex items-center bg-btn-gradient tracking-widest px-2 py-1 text-sm rounded-sm'><Image src={checkIcon} /><a className='ml-2'>Confirm</a></button>
            </div>
        </div>
    )
}

export default Pay

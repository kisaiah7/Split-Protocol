import type { NextPage } from 'next'
import Image from 'next/image'
import closeIcon from '../../public/close-icon.svg'
import plusIcon from '../../public/plus-icon.svg'
import checkIcon from '../../public/check-icon.svg'

const Expense: NextPage = () => {
    return (
        <div className='h-full bg-body-gradient'>
            <form className='container pt-16 pb-20 mx-auto'>
                <p className='text-primary font-sans text-xl font-bold'>Create a Shared Expense</p>
                <div className='mt-4 gap-2 rounded-md bg-secondary px-8 py-10 grid grid-cols-2'>
                    <div className='col-span-2'>
                        <label className='text-muted text-xs mb-2'>Name</label>
                        <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='Holiday villa'></input>
                    </div>
                    <div className='col-span-2'>
                        <label className='text-muted text-xs mb-2'>Recipient</label>
                        <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='villas-on-mallorca.eth'></input>
                    </div>
                    <div>
                        <label className='text-muted text-xs mb-2'>Recipient token</label>
                        <select className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' id='tokens'>
                            <option value='eth'>USDT</option>
                        </select>
                    </div>
                    <div>
                        <label className='text-muted text-xs mb-2'>Total amount</label>
                        <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='4000'></input>
                    </div>

                    <div className='col-span-2'>
                        <label className='text-muted text-xs mb-2'>Category</label>
                        <select className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' id='tokens'>
                            <option value='eth'>Accomodation</option>
                        </select>
                    </div>
                    <div className='col-span-2'>
                        <label className='text-muted text-xs mb-2'>Description</label>
                        <textarea className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor morbi vel facilisis ornare sagittis. Ultricies senectus pretium maecenas sagittis quam at leo
                            egestas.
                        </textarea>
                    </div>
                </div>

                <p className='mt-10 text-primary font-sans text-xl font-bold'>Debtors</p>
                <div className='mt-4 rounded-md bg-secondary px-8 py-10'>
                    <div className='grid grid-cols-2 gap-2 bg-tertiary py-2 px-3'>
                        <div>
                            <label className='text-muted text-xs mb-2'>Name</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='Holiday villa'></input>
                        </div>
                        <div>
                            <label className='text-muted text-xs mb-2'>Recipient</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='villas-on-mallorca.eth'></input>
                        </div>
                    </div>

                    <div className='relative grid grid-cols-2 gap-2 bg-tertiary py-2 px-3 mt-4'>
                        <button className='absolute top-0.5 right-1'>
                            <Image src={closeIcon} width={13} height={13} />
                        </button>
                        <div>
                            <label className='text-muted text-xs mb-2'>Name</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='Holiday villa'></input>
                        </div>
                        <div>
                            <label className='text-muted text-xs mb-2'>Recipient</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='villas-on-mallorca.eth'></input>
                        </div>
                    </div>

                    <div className='relative grid grid-cols-2 gap-2 bg-tertiary py-2 px-3 mt-4'>
                        <button className='absolute top-0.5 right-1'>
                            <Image src={closeIcon} width={13} height={13} />
                        </button>
                        <div>
                            <label className='text-muted text-xs mb-2'>Name</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='Holiday villa'></input>
                        </div>
                        <div>
                            <label className='text-muted text-xs mb-2'>Recipient</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='villas-on-mallorca.eth'></input>
                        </div>
                    </div>

                    <div className='relative grid grid-cols-2 gap-2 bg-tertiary py-2 px-3 mt-4'>
                        <button className='absolute top-0.5 right-1'>
                            <Image src={closeIcon} width={13} height={13} />
                        </button>
                        <div>
                            <label className='text-muted text-xs mb-2'>Name</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='Holiday villa'></input>
                        </div>
                        <div>
                            <label className='text-muted text-xs mb-2'>Recipient</label>
                            <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='villas-on-mallorca.eth'></input>
                        </div>
                    </div>

                    <button className='mt-5 text-primary text-xs flex items-center'><Image src={plusIcon} width={14} height={14} /><span className='ml-2'>Add debtor</span></button>
                </div>

                <div className='mt-5 mb-5'>
                    <label className='text-muted text-xs mb-2'>Payment due</label>
                    <input className='w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm' placeholder='2022-07-20'></input>
                </div>

                <button className='text-primary flex items-center bg-btn-gradient tracking-widest px-2 py-1 text-sm rounded-sm'><Image src={checkIcon} width={16} /><a className='ml-2'>Confirm</a></button>
            </form>
        </div>
    )
}

export default Expense

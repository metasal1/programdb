import Link from 'next/link';
import { useState } from 'react';
import { ProgressBar } from "react-loader-spinner";

function Modal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [programName, setProgramName] = useState('');
    const [programAddress, setProgramAddress] = useState('');
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [transferResult, setTransferResult] = useState(null);

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        console.log('creating')
        try {
            const response = await fetch('/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ program: programName }),
            });

            if (!response.ok) {
                throw new Error('This program name is not registered');
            }
            const data = await response.json();
            setResult(data);

            try {
                const response = await fetch('/api/transfer',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: JSON.stringify({ programName, programAddress }),
                    });

                if (!response.ok) {
                    throw new Error('Transfer failed');
                }
                const data = await response.json();
                setTransferResult(data);

            } catch (error: any) {
                setError(error.message);
            }

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
        setResult(null);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Register
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Register New Program</h3>
                            <form onSubmit={handleRegister} className="mb-4">
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Choose name for your program
                                    </p>
                                    <input type="text" className="mt-2 w-full border p-2" required onChange={(e) => setProgramName(e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Provide the program address</p>
                                    <input type="text" className="mt-2 w-full border p-2" required onChange={(e) => setProgramAddress(e.target.value)} />

                                </div>
                                <ProgressBar
                                    visible={loading}
                                    height="80"
                                    width="80"
                                    ariaLabel="progress-bar-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                                {error && <p className="text-red-500">{error}</p>}
                                {result &&
                                    <>
                                        <p className="text-green-500">{result['message']}</p>
                                        <Link className='text-green-900 underline text-xs' target='_blank' href={`https://solana.fm/tx/${result['signature']}`}>fetch</Link>
                                    </>
                                }

                                {transferResult &&
                                    <>
                                        <p className="text-green-500">{transferResult['message']}</p>
                                        <Link className='text-green-900 underline text-xs' target='_blank' href={`https://solana.fm/tx/${transferResult['signature']}`}>fetch</Link>
                                    </>
                                }

                                <div className="items-center px-4 py-3">
                                    <button
                                        onClick={(e) => handleRegister(e)}
                                        className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        Register
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            )
            }
        </>
    );
}

export default Modal;